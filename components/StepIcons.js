/** Íconos de la sección "Cómo se juega" (ilustraciones originales). */
export default function StepIcon({ name, size = 64 }) {
  const common = { width: size, height: size, viewBox: "0 0 64 64", "aria-hidden": true, className: "step-icon" };

  if (name === "google")
    return (
      <svg {...common} viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
        <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg>
    );

  if (name === "ficha")
    return (
      <svg {...common}>
        <path d="M32 4 56 12v20c0 14-10 23-24 29C18 55 8 46 8 32V12z" fill="rgba(130,145,185,.22)" stroke="#9aa6c8" strokeWidth="2.5" />
        <circle cx="32" cy="27" r="8" fill="none" stroke="#9aa6c8" strokeWidth="2.5" />
        <path d="M17 49c3-11 27-11 30 0" fill="none" stroke="#9aa6c8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );

  if (name === "volar")
    return (
      <svg {...common}>
        <g fill="none" stroke="#aeb7d6" strokeWidth="2.4">
          <circle cx="20" cy="30" r="11" />
          <line x1="20" y1="41" x2="20" y2="60" />
          <circle cx="42" cy="38" r="8" />
          <line x1="42" y1="46" x2="42" y2="60" />
        </g>
        <circle cx="48" cy="14" r="6" fill="#1b1d2c" stroke="#ff6b6b" strokeWidth="1.8" />
        <path d="M54 12c4-3 7-3 9-2M42 12c-3-3-6-3-8-2" stroke="#e9b93f" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );

  // trofeo
  return (
    <svg {...common}>
      <g fill="none" stroke="#b8923a" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 22c-4 12 2 26 16 32" />
        <path d="M52 22c4 12-2 26-16 32" />
      </g>
      <g fill="#e9b93f">
        <path d="M20 10h24v14c0 9-6 14-12 14S20 33 20 24z" />
        <rect x="29" y="38" width="6" height="9" />
        <rect x="22" y="47" width="20" height="6" rx="2" />
      </g>
      <path d="M20 14h-6c0 8 3 11 7 11M44 14h6c0 8-3 11-7 11" fill="none" stroke="#e9b93f" strokeWidth="2.4" />
      <path d="M32 15l2 5 5 .5-4 3.5 1.2 5-4.2-2.7-4.2 2.7 1.2-5-4-3.5 5-.5z" fill="#14100a" />
    </svg>
  );
}
