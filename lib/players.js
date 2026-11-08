import { db } from "@/lib/db";
import { roleById, POSITIONS } from "@/lib/teams";

export const totalOf = (p) => p.best_score + p.bonus_points;

export async function getPlayer(id) {
  const sql = db();
  const rows = await sql`select * from players where id = ${id}`;
  return rows[0] ?? null;
}

/** Puesto global: cuantos jugadores tienen mas puntos que `total`. */
export async function getRankInfo(total) {
  const sql = db();
  const rows = await sql`
    select count(*)::int as n,
           count(*) filter (where best_score + bonus_points > ${total})::int as above
    from players`;
  return { rank: rows[0].above + 1, n: rows[0].n };
}

/** Tabla de posiciones. Con team + role filtra y marca quien clasifica segun los cupos. */
export async function leaderboard({ team = null, role = null, limit = 50, markStarters = false } = {}) {
  const sql = db();
  const rows = await sql`
    select id, instagram, icon, team, role, best_score, bonus_points,
           (best_score + bonus_points) as total
    from players
    where (${team}::text is null or team = ${team})
      and (${role}::text is null or role = ${role})
    order by total desc, created_at asc
    limit ${limit}`;
  const slots = role ? roleById(role)?.slots ?? 0 : 0;
  const starterIds = markStarters ? new Set((await starters()).map((s) => s.id)) : null;
  return rows.map((r, i) => ({
    ...r,
    total: Number(r.total),
    pos: i + 1,
    qualified: Boolean(team && role) && i < slots,
    starter: starterIds ? starterIds.has(r.id) : false,
  }));
}

/**
 * Titulares: los mejores de cada posicion en cada equipo, segun los cupos
 * (3 cazadores, 2 golpeadores, 1 guardian, 1 entrenador, 1 buscador).
 */
export async function starters() {
  const sql = db();
  const slots = JSON.stringify(Object.fromEntries(POSITIONS.map((p) => [p.id, p.slots])));
  const rows = await sql`
    select id, instagram, icon, team, role, best_score, bonus_points, total from (
      select id, instagram, icon, team, role, best_score, bonus_points, created_at,
             (best_score + bonus_points) as total,
             row_number() over (partition by team, role
                                order by (best_score + bonus_points) desc, created_at asc) as rn
      from players
    ) t
    where rn <= coalesce((${slots}::jsonb ->> role)::int, 0)
    order by team, total desc`;
  return rows.map((r) => ({ ...r, total: Number(r.total) }));
}

/** Fecha de hoy en Argentina (YYYY-MM-DD) para el bono diario. */
export function todayAR() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}
