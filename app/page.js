import Link from "next/link";
import { auth } from "@/lib/auth";
import { leaderboard } from "@/lib/players";
import { seasonState, DEADLINE_MS } from "@/lib/season";
import Star from "@/components/Star";
import Countdown from "@/components/Countdown";
import { TEAMS, fixtures, teamBySlug, roleById } from "@/lib/teams";
import Crest from "@/components/Crest";
import Avatar from "@/components/Avatar";
import SignInButton from "@/components/SignInButton";
import AdSlot from "@/components/AdSlot";
import StepIcon from "@/components/StepIcons";

export const dynamic = "force-dynamic";

// Enlace del botón "Ver detalles" de cada estandarte (wiki de cada equipo)
const WIKI = {
  puddlemere: "https://harrypotter.fandom.com/es/wiki/Puddlemere_United",
  wimbourne: "https://harrypotter.fandom.com/es/wiki/Avispas_de_Wimbourne",
  chudley: "https://harrypotter.fandom.com/es/wiki/Chudley_Cannons",
  caerphilly: "https://harrypotter.fandom.com/es/wiki/Caerphilly_Catapults",
};

const STEPS = [
  ["Entrá con Google", "Un solo toque. Solo se permite una cuenta por conexión para que la tabla sea justa.", "google"],
  ["Armá tu ficha", "Tu @ de Instagram, un ícono, el equipo al que te postulás y tu posición.", "ficha"],
  ["Volá y sumá puntos", "Esquivá bludgers bajando y torres del castillo subiendo. Cada vez va más rápido.", "volar"],
  ["Ganate tu lugar", "Los mejores puntajes de cada posición clasifican a su equipo para el Mundial.", "trofeo"],
];

export default async function Home() {
  const session = await auth();
  const { closed } = await seasonState();

  let top = [];
  try {
    top = await leaderboard({ limit: 5, markStarters: closed });
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
          <div className="hero-deadline">
            {closed ? (
              <span><Star size={16} /> Clasificación cerrada · ya están los titulares</span>
            ) : (
              <>
                <span>Rankeá hasta el 29/11 · 24:00 UTC</span>
                <Countdown to={DEADLINE_MS} />
              </>
            )}
          </div>
          <div className="hero-cta">
            {closed ? (
              <Link href="/ranking?titulares=1" className="btn btn-gold">Ver titulares ›</Link>
            ) : session?.user ? (
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
          <div className="sec-title">
            <p className="kicker">
              <i />
              ◆ Los equipos ◆
              <i />
            </p>
            <h2 className="h2 h2-metal">Elegí tu camiseta</h2>
            <div className="title-ornament" aria-hidden="true">
              <i />
              <svg width="64" height="22" viewBox="0 0 120 40">
                <g fill="#e9b93f">
                  <path d="M52 21 C40 9 22 6 3 11 C15 13 23 17 28 24 C36 22 45 23 52 21 Z" />
                  <path d="M68 21 C80 9 98 6 117 11 C105 13 97 17 92 24 C84 22 75 23 68 21 Z" />
                  <circle cx="60" cy="23" r="9" />
                </g>
              </svg>
              <i />
            </div>
          </div>

          <div className="teams">
            {TEAMS.map((t) => (
              <article className={`banner-wrap std-${t.slug}`} key={t.slug}>
                <div className="standard">
                  <div className="std-face">
                    <Crest slug={t.slug} size={84} />
                    <h3>{t.name}</h3>
                    <p className="motto">{t.motto}</p>
                    <p className="bio">{t.bio}</p>
                    <p className="std-meta">
                      Desde {t.founded} · {t.home}
                    </p>
                    <a className="std-btn" href={WIKI[t.slug]} target="_blank" rel="noopener noreferrer">
                      Ver detalles
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="swipe-hint">Deslizá para ver los 4 equipos ›</p>

          <div className="stadium-foot" aria-hidden="true">
            <i />
            <svg width="90" height="60" viewBox="0 0 90 60">
              <g fill="none" stroke="#e9b93f" strokeWidth="2.4">
                <circle cx="45" cy="16" r="13" />
                <line x1="45" y1="29" x2="45" y2="60" />
                <circle cx="16" cy="30" r="9" />
                <line x1="16" y1="39" x2="16" y2="60" />
                <circle cx="74" cy="30" r="9" />
                <line x1="74" y1="39" x2="74" y2="60" />
              </g>
            </svg>
            <i />
          </div>
        </div>
      </section>

      {/* FONDO DE CASTILLO: tabla global + partidos + host */}
      <div className="castle">
        {/* TOP 5 */}
        <section className="section">
          <div className="wrap">
            <div className="sec-title left">
              <p className="eyebrow">Tabla global</p>
              <h2 className="h2 h2-metal">{closed ? "Así quedó la tabla" : "Los mejores del momento"}</h2>
              <div className="title-ornament wide" aria-hidden="true">
                <i />
                <svg width="64" height="22" viewBox="0 0 120 40">
                  <g fill="#e9b93f">
                    <path d="M52 21 C40 9 22 6 3 11 C15 13 23 17 28 24 C36 22 45 23 52 21 Z" />
                    <path d="M68 21 C80 9 98 6 117 11 C105 13 97 17 92 24 C84 22 75 23 68 21 Z" />
                    <circle cx="60" cy="23" r="9" />
                  </g>
                </svg>
                <i />
              </div>
            </div>

            {top.length ? (
              <div className="rank-list">
                {top.map((r) => (
                  <div className="rank-row" key={r.id}>
                    <span className="rank-pos">{r.pos}</span>
                    <Avatar id={r.icon} size={44} ring="#e9b93f" />
                    <div>
                      <div className="rank-name">@{r.instagram} {closed && r.starter && <Star size={14} />}</div>
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
            <p style={{ marginTop: 18 }}>
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
            <div className="partidos-head">
              <span>Partidos</span>
              <i />
              <svg className="hoops" width="90" height="60" viewBox="0 0 90 60" aria-hidden="true">
                <g fill="none" stroke="#e9b93f" strokeWidth="2.4">
                  <circle cx="45" cy="16" r="13" />
                  <line x1="45" y1="29" x2="45" y2="60" />
                  <circle cx="16" cy="30" r="9" />
                  <line x1="16" y1="39" x2="16" y2="60" />
                  <circle cx="74" cy="30" r="9" />
                  <line x1="74" y1="39" x2="74" y2="60" />
                </g>
              </svg>
            </div>
            <div className="soon">
              <div className="soon-title">
                <i />
                <span className="soon-badge">Próximamente</span>
                <i />
              </div>
              <p>
                Todos contra todos, solo ida. En cada partido se plantean juegos y gana el equipo que acumule más puntos.
                Los partidos se juegan en diciembre; las fechas se anuncian más adelante.
              </p>
              <div className="titulares-note">
                <Star size={18} />
                {closed ? (
                  <p>
                    La clasificación cerró. Los titulares de cada equipo ya están definidos: 3 cazadores, 2 golpeadores, 1 guardián,
                    1 entrenador y 1 buscador.{" "}
                    <Link href="/ranking?titulares=1">Ver titulares</Link>
                  </p>
                ) : (
                  <p>
                    Podés rankear hasta el <b>29 de noviembre de 2026 a las 24:00 UTC</b> (21:00 en Argentina). Los mejores de cada
                    posición pasan a ser titulares de su equipo: 3 cazadores, 2 golpeadores, 1 guardián, 1 entrenador y 1 buscador.
                  </p>
                )}
              </div>
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
      </div>

      {/* HOST: fondo azul liso + card con textura y foto */}
      <section className="host-zone" id="host">
        <div className="wrap">
          <div className="host-card">
            <div className="host-frame" aria-hidden="true" />
            <svg className="host-snitch" width="86" height="30" viewBox="0 0 120 40" aria-hidden="true">
              <g fill="#e9b93f">
                <path d="M52 21 C40 9 22 6 3 11 C15 13 23 17 28 24 C36 22 45 23 52 21 Z" />
                <path d="M68 21 C80 9 98 6 117 11 C105 13 97 17 92 24 C84 22 75 23 68 21 Z" />
                <circle cx="60" cy="23" r="9" />
              </g>
            </svg>
            <div className="host-photo" aria-hidden="true" />
            <div className="host-body">
              <span className="host-label">HOST DEL MUNDIAL</span>
              <span className="host-handle">@Wood_no_descansa</span>
              <p>
                Quien organiza, arbitra y mantiene en pie el torneo. Seguilo para enterarte de las fechas, los resultados y las novedades.
              </p>
              <a className="btn btn-gold btn-sm" href="https://instagram.com/wood_no_descansa" target="_blank" rel="noopener noreferrer">
                Seguir en Instagram
              </a>
            </div>
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
