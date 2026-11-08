import Link from "next/link";
import { auth } from "@/lib/auth";
import { leaderboard, starters } from "@/lib/players";
import { seasonState } from "@/lib/season";
import Star from "@/components/Star";
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
  const { closed } = await seasonState();
  const lineups = closed && sp?.titulares !== undefined;

  let rows = [];
  let lineup = [];
  let dbError = false;
  try {
    if (lineups) lineup = await starters();
    else rows = await leaderboard({ team, role, limit: 100, markStarters: closed });
  } catch {
    dbError = true;
  }

  const slots = role ? roleById(role)?.slots : 0;
  const href = (t, r) => `/ranking${t ? `?team=${t}${r ? `&role=${r}` : ""}` : ""}`;

  return (
    <div className="wrap page">
      <p className="eyebrow">Clasificación</p>
      <h1>Tabla de puntos</h1>
      <p className="lead">
        {closed
          ? "La clasificación cerró. Los titulares de cada equipo llevan una estrella dorada y juegan los partidos de diciembre."
          : "Puntos = tu mejor puntaje + bono diario. Podés rankear hasta el 29/11 a las 24:00 UTC: los mejores de cada posición serán titulares de su equipo."}
      </p>

      <div className="tabs">
        {closed && (
          <Link href="/ranking?titulares=1" className={`tab ${lineups ? "on" : ""}`}>★ Titulares</Link>
        )}
        <Link href="/ranking" className={`tab ${!team && !lineups ? "on" : ""}`}>Global</Link>
        {TEAMS.map((t) => (
          <Link key={t.slug} href={href(t.slug, role)} className={`tab ${team === t.slug ? "on" : ""}`}>
            {t.short}
          </Link>
        ))}
      </div>

      {team && !lineups && (
        <div className="tabs">
          <Link href={href(team, null)} className={`tab ${!role ? "on" : ""}`}>Todas</Link>
          {POSITIONS.map((p) => (
            <Link key={p.id} href={href(team, p.id)} className={`tab ${role === p.id ? "on" : ""}`}>
              {p.plural}
            </Link>
          ))}
        </div>
      )}

      {byPosition && !lineups && (
        <p className="quota">
          {closed
            ? `Titulares de ${roleById(role).plural.toLowerCase()} en ${teamBySlug(team).name}: los primeros ${slots}.`
            : `Cupos de ${roleById(role).plural.toLowerCase()} en ${teamBySlug(team).name}: ${slots}. Los primeros ${slots} serán titulares.`}
        </p>
      )}

      {lineups && !dbError ? (
        <div className="lineups">
          {TEAMS.map((t) => {
            const list = POSITIONS.flatMap((p) => lineup.filter((r) => r.team === t.slug && r.role === p.id));
            return (
              <section key={t.slug} className="lineup">
                <h2><Crest slug={t.slug} size={22} /> {t.name}</h2>
                {list.length === 0 ? (
                  <p className="quota">Sin titulares todavía.</p>
                ) : (
                  <div className="rank-list">
                    {list.map((r) => (
                      <div key={r.id} className={`rank-row t ${r.id === session?.user?.id ? "me" : ""}`}>
                        <span className="rank-pos"><Star size={18} /></span>
                        <Avatar id={r.icon} size={40} />
                        <div>
                          <div className="rank-name">@{r.instagram} {closed && r.starter && <Star size={14} />}</div>
                          <div className="rank-meta">{roleById(r.role)?.label}</div>
                        </div>
                        <span className="rank-pts">{r.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : dbError ? (
        <div className="alert">La base de datos todavía no está configurada.</div>
      ) : rows.length === 0 ? (
        <p className="lead">Todavía no hay jugadores en esta vista.</p>
      ) : (
        <div className="rank-list">
          {rows.map((r) => (
            <div key={r.id} className={`rank-row ${r.id === session?.user?.id ? "me" : ""} ${closed ? (r.starter ? "t" : "") : r.qualified ? "q" : ""}`}>
              <span className="rank-pos">{r.pos}</span>
              <Avatar id={r.icon} size={40} />
              <div>
                <div className="rank-name">@{r.instagram}</div>
                <div className="rank-meta">
                  <Crest slug={r.team} size={12} /> {teamBySlug(r.team)?.short} · {roleById(r.role)?.label}
                  {closed ? r.starter && <span className="badge-t">TITULAR</span> : r.qualified && <span className="badge-q">EN CUPO</span>}
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
