export const AVATARS = [
  { id: 1, name: "Snitch dorada", bg: "#3a2d0a" },
  { id: 2, name: "Quaffle", bg: "#5a1420" },
  { id: 3, name: "Bludger", bg: "#1b1c2a" },
  { id: 4, name: "Escoba", bg: "#2a1c10" },
  { id: 5, name: "Torre", bg: "#232848" },
  { id: 6, name: "Aros", bg: "#0f3b3a" },
  { id: 7, name: "Copa", bg: "#3b2a0a" },
  { id: 8, name: "Silbato", bg: "#2a1a44" },
];

function Glyph({ id }) {
  switch (id) {
    case 1:
      return (
        <g>
          <ellipse cx="14" cy="24" rx="12" ry="5" fill="#fff" opacity=".8" transform="rotate(-25 14 24)" />
          <ellipse cx="50" cy="24" rx="12" ry="5" fill="#fff" opacity=".8" transform="rotate(25 50 24)" />
          <circle cx="32" cy="34" r="12" fill="#f5c451" />
          <circle cx="28" cy="30" r="3" fill="#fff6cf" />
        </g>
      );
    case 2:
      return (
        <g>
          <circle cx="32" cy="32" r="18" fill="#c8283d" />
          <path d="M16 26 Q32 36 48 26" stroke="#7a1022" strokeWidth="2.5" fill="none" />
          <path d="M16 38 Q32 28 48 38" stroke="#7a1022" strokeWidth="2.5" fill="none" />
        </g>
      );
    case 3:
      return (
        <g>
          <circle cx="32" cy="32" r="16" fill="#2a2c40" stroke="#ff5252" strokeWidth="2.5" />
          <circle cx="26" cy="29" r="2.8" fill="#ff5252" />
          <circle cx="37" cy="29" r="2.8" fill="#ff5252" />
          <path d="M24 40 Q32 35 40 40" stroke="#ff5252" strokeWidth="2" fill="none" />
        </g>
      );
    case 4:
      return (
        <g>
          <line x1="10" y1="40" x2="54" y2="24" stroke="#b97a35" strokeWidth="4.5" strokeLinecap="round" />
          <g stroke="#e0b25a" strokeWidth="1.6">
            <line x1="12" y1="40" x2="4" y2="36" />
            <line x1="12" y1="40" x2="3" y2="41" />
            <line x1="12" y1="40" x2="4" y2="46" />
            <line x1="12" y1="40" x2="6" y2="50" />
          </g>
        </g>
      );
    case 5:
      return (
        <g>
          <rect x="22" y="26" width="20" height="30" fill="#7a82b8" />
          <path d="M19 26 L32 8 L45 26 Z" fill="#c24574" />
          <rect x="29" y="34" width="6" height="9" fill="#ffd36b" />
        </g>
      );
    case 6:
      return (
        <g fill="none" stroke="#f5c451" strokeWidth="3.5">
          <circle cx="20" cy="22" r="9" />
          <circle cx="44" cy="22" r="9" />
          <line x1="20" y1="31" x2="20" y2="56" />
          <line x1="44" y1="31" x2="44" y2="56" />
        </g>
      );
    case 7:
      return (
        <g fill="#f5c451">
          <path d="M18 14 H46 V28 C46 38 40 42 32 42 C24 42 18 38 18 28 Z" />
          <rect x="29" y="42" width="6" height="8" />
          <rect x="21" y="50" width="22" height="5" rx="2" />
          <path d="M18 18 H10 C10 28 14 30 19 30 M46 18 H54 C54 28 50 30 45 30" stroke="#f5c451" strokeWidth="3" fill="none" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="12" y="26" width="30" height="14" rx="7" fill="#cfd3ee" />
          <circle cx="46" cy="33" r="9" fill="#cfd3ee" />
          <circle cx="46" cy="33" r="3.5" fill="#2a1a44" />
          <rect x="22" y="18" width="8" height="8" rx="2" fill="#cfd3ee" />
        </g>
      );
  }
}

export default function Avatar({ id = 1, size = 44, ring = "rgba(255,255,255,.2)" }) {
  const a = AVATARS.find((x) => x.id === Number(id)) || AVATARS[0];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={a.name} style={{ flex: "none" }}>
      <circle cx="32" cy="32" r="31" fill={a.bg} stroke={ring} strokeWidth="2" />
      <Glyph id={a.id} />
    </svg>
  );
}
