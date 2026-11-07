import { teamBySlug } from "@/lib/teams";

const SHIELD = "M10 8 H90 V70 C90 90 60 104 50 110 C40 104 10 90 10 70 Z";

/** Escudos ORIGINALES (inspirados en los colores de cada equipo, no son los logos oficiales). */
export default function Crest({ slug, size = 72 }) {
  const t = teamBySlug(slug);
  if (!t) return null;
  const [c1, c2] = t.colors;
  const id = `clip-${slug}`;

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" role="img" aria-label={`Escudo de ${t.name}`}>
      <defs>
        <clipPath id={id}>
          <path d={SHIELD} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {slug === "puddlemere" && (
          <>
            <rect width="100" height="120" fill={c1} />
            <g stroke={c2} strokeWidth="4" strokeLinecap="round" fill={c2}>
              <line x1="28" y1="30" x2="72" y2="92" />
              <line x1="72" y1="30" x2="28" y2="92" />
              <ellipse cx="28" cy="30" rx="6" ry="11" transform="rotate(-35 28 30)" />
              <ellipse cx="72" cy="30" rx="6" ry="11" transform="rotate(35 72 30)" />
            </g>
          </>
        )}
        {slug === "wimbourne" && (
          <>
            <rect width="100" height="120" fill={c1} />
            {[24, 52, 80].map((y) => (
              <rect key={y} x="0" y={y} width="100" height="14" fill={c2} />
            ))}
            <ellipse cx="50" cy="55" rx="13" ry="9" fill={c2} stroke={c1} strokeWidth="2" />
            <ellipse cx="42" cy="42" rx="9" ry="5" fill="#fff" opacity=".85" transform="rotate(-25 42 42)" />
            <ellipse cx="58" cy="42" rx="9" ry="5" fill="#fff" opacity=".85" transform="rotate(25 58 42)" />
          </>
        )}
        {slug === "chudley" && (
          <>
            <rect width="100" height="120" fill={c1} />
            <circle cx="50" cy="66" r="17" fill={c2} />
            <circle cx="44" cy="60" r="4" fill="#ffffff" opacity=".35" />
            <path d="M32 28 A14 14 0 1 0 32 52" stroke={c2} strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M68 28 A14 14 0 1 1 68 52" stroke={c2} strokeWidth="7" fill="none" strokeLinecap="round" transform="rotate(0)" />
          </>
        )}
        {slug === "caerphilly" && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={i * 20} y="0" width="20" height="120" fill={i % 2 ? c2 : c1} />
            ))}
            <g stroke="#10142e" strokeWidth="5" strokeLinecap="round" fill="none">
              <line x1="30" y1="86" x2="62" y2="46" />
              <line x1="34" y1="92" x2="76" y2="92" />
              <line x1="48" y1="88" x2="48" y2="70" />
            </g>
            <circle cx="66" cy="40" r="7" fill="#10142e" />
          </>
        )}
      </g>
      <path d={SHIELD} fill="none" stroke="#fff" strokeWidth="4" />
    </svg>
  );
}
