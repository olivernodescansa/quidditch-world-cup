"use client";

import { useEffect, useState } from "react";

const EIGHT =
  "M150 90 C190 30 270 30 270 90 C270 150 190 150 150 90 C110 30 30 30 30 90 C30 150 110 150 150 90 Z";

/**
 * Pantalla de carga: la Snitch dorada dibuja un 8 en el aire, se detiene en el centro,
 * estalla en un aro de luz y revela el titulo. Se muestra una vez por sesion.
 */
export default function Loader() {
  const [phase, setPhase] = useState("show"); // show | leaving | gone

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("qwc_loaded") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setPhase("gone");
      return;
    }
    const t1 = setTimeout(() => setPhase("leaving"), 3400);
    const t2 = setTimeout(() => {
      setPhase("gone");
      try {
        sessionStorage.setItem("qwc_loaded", "1");
      } catch {}
    }, 4100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`loader ${phase}`} aria-hidden="true">
      <div className="loader-stage">
        <svg viewBox="0 0 300 180" className="loader-svg">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ball" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#fff6cf" />
              <stop offset="60%" stopColor="#f5c451" />
              <stop offset="100%" stopColor="#b88a1e" />
            </radialGradient>
          </defs>

          <path id="eight" d={EIGHT} className="loader-ghost" />
          <path d={EIGHT} pathLength="100" className="loader-trail" filter="url(#glow)" />
          <circle cx="150" cy="90" r="6" className="loader-ring" />
          <circle cx="150" cy="90" r="6" className="loader-ring r2" />

          <g className="snitch">
            <g className="wing wing-l">
              <ellipse cx="-14" cy="-3" rx="11" ry="4" fill="#fff" opacity=".85" />
            </g>
            <g className="wing wing-r">
              <ellipse cx="14" cy="-3" rx="11" ry="4" fill="#fff" opacity=".85" />
            </g>
            <circle r="7" fill="url(#ball)" filter="url(#glow)" />
            <animateMotion dur="2.4s" begin="0.1s" fill="freeze" calcMode="linear">
              <mpath href="#eight" />
            </animateMotion>
          </g>
        </svg>

        <h1 className="loader-title">
          <span>MUNDIAL DE</span>
          <strong>QUIDDITCH</strong>
        </h1>
        <p className="loader-sub">Preparando el campo…</p>
        <div className="loader-bar">
          <i />
        </div>
      </div>
    </div>
  );
}
