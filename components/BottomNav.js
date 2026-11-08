"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio", d: "M3 11 12 3l9 8v10h-6v-6H9v6H3z" },
  { href: "/jugar", label: "Jugar", auth: true, d: "M12 2 15 9l7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" },
  { href: "/ranking", label: "Ranking", d: "M4 20V10h4v10zm6 0V4h4v16zm6 0v-7h4v7z" },
  { href: "/perfil", label: "Perfil", auth: true, d: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" },
];

export default function BottomNav({ loggedIn = false }) {
  const path = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.filter((it) => loggedIn || !it.auth).map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={active ? "active" : ""}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d={it.d} fill="currentColor" />
            </svg>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
