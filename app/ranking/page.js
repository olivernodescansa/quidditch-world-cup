import Link from "next/link";
import { auth } from "@/lib/auth";
import { leaderboard } from "@/lib/players";
import { TEAMS, POSITIONS, teamBySlug, roleById } from "@/lib/teams";
import Avatar from "@/components/Avatar";
import Crest from "@/components/Crest";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ranking · Mundial de Quidditch" };

export default async function Ranking({ searchParams }) {
  const sp = await searchParams;
  const session = await auth();
  const team = TEAMS.some((t) => t.slug === sp?.team) ? sp.team : null;
  const role = POSITIONS.some((p) => p.id === sp?.role) ? sp.role : null;
  const byPosition = Boolean(team && role);

  let rows = [];
  let dbError = false;
  try {
    rows = await leaderboard({ team, role, limit: 100 });
  } catch {
    dbError = true;
  }

  const slots = role ? roleById(role)?.slots : 0;
  const href = (t, r) => `/ranking${t ? `?team=${t}${r ? `&role=${r}` : ""}` : ""}`;

  return (
    <div className="wrap page">
      <p className="eyebrow">Clasificación</p>
      <h1>Tabla de puntos</h1>
      <p className="lead">Puntos = tu mejor puntaje + bono diario. Los mejores de cada posición clasifican a su equipo.</p>

      <div className="tabs">
        <Link href="/ranking" className={`tab ${!team ? "on" : ""}`}>Global</Link>
        {TEAMS.map((t) => (
          <Link key={t.slug} href={href(t.slug, role)} className={`tab ${team === t.slug ? "on" : ""}`}>
            {t.short}
          </Link>
        ))}
      </div>

      {team && (
        <div className="tabs">
          <Link href={href(team, null)} className={`tab ${!role ? "on" : ""}`}>Todas</Link>
          {POSITIONS.map((p) => (
            <Link key={p.id} href={href(team, p.id)} className={`tab ${role === p.id ? "on" : ""}`}>
              {p.plural}
            </Link>
          ))}
        </div>
      )}

      {byPosition && (
        <p className="quota">
          Cupos de {roleById(role).plural.toLowerCase()} en {teamBySlug(team).name}: {slots}. Los primeros {slots} clasifican.
        </p>
      )}

      {dbError ? (
        <div className="alert">La base de datos todavía no está configurada.</div>
      ) : rows.length === 0 ? (
        <p className="lead">Todavía no hay jugadores en esta vista.</p>
      ) : (
        <div className="rank-list">
          {rows.map((r) => (
            <div key={r.id} className={`rank-row ${r.id === session?.user?.id ? "me" : ""} ${r.qualified ? "q" : ""}`}>
              <span className="rank-pos">{r.pos}</span>
              <Avatar id={r.icon} size={40} />
              <div>
                <div className="rank-name">@{r.instagram}</div>
                <div className="rank-meta">
                  <Crest slug={r.team} size={12} /> {teamBySlug(r.team)?.short} · {roleById(r.role)?.label}
                  {r.qualified && <span className="badge-q">CLASIFICADO</span>}
                </div>
              </div>
              <span className="rank-pts">{r.total}</span>
            </div>
          ))}
        </div>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RANKING} />
    </div>
  );
}
