"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/jugar", label: "Jugar", auth: true },
  { href: "/ranking", label: "Ranking" },
  { href: "/#equipos", label: "Equipos" },
  { href: "/perfil", label: "Perfil", auth: true },
];

/** Menú del header (solo se ve en pantallas anchas; en el celular se usa la barra de abajo). */
export default function TopNav({ loggedIn = false }) {
  const path = usePathname();
  return (
    <nav className="topnav" aria-label="Navegación">
      {links.filter((l) => loggedIn || !l.auth).map((l) => {
        const active = l.href === "/" ? path === "/" : !l.href.includes("#") && path.startsWith(l.href);
        return (
          <Link key={l.label} href={l.href} className={active ? "active" : ""}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
