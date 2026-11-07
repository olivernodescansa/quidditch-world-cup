import Link from "next/link";
import { auth } from "@/lib/auth";
import { leaderboard } from "@/lib/players";
import { TEAMS, fixtures, teamBySlug, roleById } from "@/lib/teams";
import Crest from "@/components/Crest";
import Avatar from "@/components/Avatar";
import SignInButton from "@/components/SignInButton";
import AdSlot from "@/components/AdSlot";
import StepIcon from "@/components/StepIcons";

export const dynamic = "force-dynamic";

const STEPS = [
  ["Entrá con Google", "Un solo toque. Solo se permite una cuenta por conexión para que la tabla sea justa.", "google"],
  ["Armá tu ficha", "Tu @ de Instagram, un ícono, el equipo al que te postulás y tu posición.", "ficha"],
  ["Volá y sumá puntos", "Esquivá bludgers bajando y torres del castillo subiendo. Cada vez va más rápido.", "volar"],
  ["Ganate tu lugar", "Los mejores puntajes de cada posición clasifican a su equipo para el Mundial.", "trofeo"],
];

export default async function Home() {
  const session = await auth();

  let top = [];
  try {
    top = await leaderboard({ limit: 5 });
  } catch {
    // base de datos todavia sin configurar: la landing sigue funcionando
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-tag">
            <i />
            EDICIÓN I · 4 EQUIPOS
            <i />
          </div>
          <h1 className="hero-title">
            <span className="t1">El Mundial de</span>
            <span className="t2">Quidditch</span>
            <svg className="swoosh" viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 12 C110 2 290 0 398 6 C300 7 140 10 2 12 Z" fill="#e9b93f" />
            </svg>
          </h1>
          <p className="hero-sub">
            Cuatro equipos legendarios, una tabla de puntos global y una escoba para ganarte tu lugar en la cancha.
          </p>
          <div className="hero-cta">
            {session?.user ? (
              <Link href="/jugar" className="btn btn-gold">Ir a jugar ›</Link>
            ) : (
              <SignInButton label="Entrar con Google" className="btn btn-gold" />
            )}
            <Link href="/ranking" className="btn btn-ghost">Ver ranking</Link>
          </div>
        </div>
      </section>

      {/* FONDO DE ESTADIO: finalistas + cómo se juega */}
      <div className="stadium">
        <div className="wrap">
          <div className="matchup">
            <h3>LOS CUATRO FINALISTAS</h3>
            <div className="crest-row">
              {TEAMS.map((t) => (
                <div key={t.slug}>
                  <Crest slug={t.slug} size={62} />
                  {t.short}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CÓMO FUNCIONA */}
        <section className="section">
          <div className="wrap">
            <p className="eyebrow tab-eyebrow">Cómo se juega</p>
            <h2 className="h2 h2-metal">Del suelo a la cancha en 4 pasos</h2>
            <div className="steps">
              {STEPS.map(([title, text, icon], i) => (
                <div className="step" key={title}>
                  <div className="step-n">{i + 1}</div>
                  <div className="step-body">
                    <StepIcon name={icon} />
                    <div>
                      <b>{title}</b>
                      <p>{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="stadium-foot" aria-hidden="true">
          <i />
          <svg width="54" height="54" viewBox="0 0 64 64">
            <g stroke="#e9b93f" strokeWidth="4" strokeLinecap="round">
              <line x1="10" y1="54" x2="50" y2="10" />
              <line x1="54" y1="54" x2="14" y2="10" />
            </g>
            <g stroke="#b8841c" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="58" x2="12" y2="50" />
              <line x1="58" y1="58" x2="52" y2="50" />
            </g>
          </svg>
          <i />
        </div>
      </div>

      {/* EQUIPOS */}
      <section className="section light" id="equipos">
        <div className="wrap">
          <p className="eyebrow">Los equipos</p>
          <h2 className="h2">Elegí tu camiseta</h2>
          <div className="teams">
            {TEAMS.map((t) => (
              <article className="team-card" key={t.slug}>
                <div className="banner" style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}>
                  <Crest slug={t.slug} size={74} />
                </div>
                <div className="team-body">
                  <h3>{t.name}</h3>
                  <p className="motto">{t.motto}</p>
                  <p>{t.bio}</p>
                  <div className="facts">
                    <span>Desde {t.founded}</span>
                    <span>{t.home}</span>
                    <span>{t.colorsText}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TOP 5 */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Tabla global</p>
          <h2 className="h2">Los mejores del momento</h2>
          {top.length ? (
            <div className="rank-list">
              {top.map((r) => (
                <div className="rank-row" key={r.id}>
                  <span className="rank-pos">{r.pos}</span>
                  <Avatar id={r.icon} size={40} />
                  <div>
                    <div className="rank-name">@{r.instagram}</div>
                    <div className="rank-meta">
                      <Crest slug={r.team} size={12} /> {teamBySlug(r.team)?.short} · {roleById(r.role)?.label}
                    </div>
                  </div>
                  <span className="rank-pts">{r.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="lead">Todavía no hay jugadores. ¡Sé el primero en la tabla!</p>
          )}
          <p style={{ marginTop: 16 }}>
            <Link href="/ranking" className="btn btn-ghost btn-sm">Ver tabla completa</Link>
          </p>
        </div>
      </section>

      <div className="wrap">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />
      </div>

      {/* PARTIDOS */}
      <section className="section" id="partidos">
        <div className="wrap">
          <p className="eyebrow">Partidos</p>
          <div className="soon">
            <span className="soon-badge">Próximamente</span>
            <p>
              Todos contra todos, solo ida. En cada partido se plantean juegos y gana el equipo que acumule más puntos.
              Las fechas se anuncian más adelante.
            </p>
            <div className="fixtures">
              {fixtures().map(([a, b]) => (
                <div className="fixture" key={a.slug + b.slug}>
                  <span>{a.short}</span>
                  <em>VS</em>
                  <span>{b.short}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOST */}
      <section className="section" id="host">
        <div className="wrap">
          <div className="host">
            <span className="host-label">HOST DEL MUNDIAL</span>
            <span className="host-handle">@Wood_no_descansa</span>
            <p className="muted">
              Quien organiza, arbitra y mantiene en pie el torneo. Seguilo para enterarte de las fechas, los resultados y las novedades.
            </p>
            <a className="btn btn-gold btn-sm" href="https://instagram.com/wood_no_descansa" target="_blank" rel="noopener noreferrer">
              Seguir en Instagram
            </a>
          </div>
        </div>
      </section>

      <footer className="site">
        <p>
          Proyecto de fans sin fines oficiales. Harry Potter y sus marcas pertenecen a sus respectivos titulares. No estamos afiliados.
        </p>
        <p style={{ marginTop: 6 }}>
          <Link href="/privacidad">Privacidad y cookies</Link>
        </p>
      </footer>
    </>
  );
}
