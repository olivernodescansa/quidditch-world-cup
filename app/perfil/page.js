import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPlayer, getRankInfo, totalOf } from "@/lib/players";
import { computeStats } from "@/lib/stats";
import { teamBySlug, roleById } from "@/lib/teams";
import Avatar from "@/components/Avatar";
import Crest from "@/components/Crest";

export const dynamic = "force-dynamic";
export const metadata = { title: "Perfil · Mundial de Quidditch" };

function Ring({ value, label }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="#3fae6a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          transform="rotate(-90 42 42)"
        />
        <text x="42" y="49" textAnchor="middle">{value}</text>
      </svg>
      {label}
    </div>
  );
}

export default async function Perfil() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const p = await getPlayer(session.user.id);
  if (!p) redirect("/registro");

  const total = totalOf(p);
  const { rank, n } = await getRankInfo(total);
  const s = computeStats(p, rank, n);
  const team = teamBySlug(p.team);

  return (
    <div className="wrap page">
      <div className="profile-hero">
        <Avatar id={p.icon} size={72} ring="#f5c451" />
        <div style={{ flex: 1 }}>
          <small>{team?.name} · {roleById(p.role)?.label}</small>
          <h1>@{p.instagram}</h1>
          <small>Puesto global #{rank} de {n}</small>
        </div>
        <Crest slug={p.team} size={44} />
      </div>

      <div className="rings">
        <Ring value={s.velocidad} label="Velocidad" />
        <Ring value={s.asertividad} label="Asertividad" />
        <Ring value={Math.min(100, Math.round((s.altura / 80) * 100))} label="Altura" />
      </div>

      <div className="kpis">
        <div className="kpi"><b>{total}</b><span>Puntos totales</span></div>
        <div className="kpi"><b>{s.altura} m</b><span>Altura máxima</span></div>
        <div className="kpi"><b>{p.best_score}</b><span>Mejor puntaje</span></div>
        <div className="kpi"><b>{p.games_played}</b><span>Partidas</span></div>
      </div>

      <p className="eyebrow">Skills</p>
      <p className="lead">Tus stats y skills mejoran a medida que escalás en la tabla global.</p>
      <div className="skills">
        {s.skills.map((k) => (
          <div key={k.id} className={`skill ${k.unlocked ? "" : "locked"}`}>
            <span className="dot" />
            <div>
              <b>{k.name}</b>
              <small>{k.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
