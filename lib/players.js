import { db } from "@/lib/db";
import { roleById } from "@/lib/teams";

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
export async function leaderboard({ team = null, role = null, limit = 50 } = {}) {
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
  return rows.map((r, i) => ({
    ...r,
    total: Number(r.total),
    pos: i + 1,
    qualified: Boolean(team && role) && i < slots,
  }));
}

/** Fecha de hoy en Argentina (YYYY-MM-DD) para el bono diario. */
export function todayAR() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}
