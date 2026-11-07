import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import SignInButton from "@/components/SignInButton";
import TopNav from "@/components/TopNav";

export default async function TopBar() {
  const session = await auth();
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <svg width="62" height="26" viewBox="0 0 120 40" aria-hidden="true">
          <g fill="#e9b93f">
            <path d="M52 21 C40 9 22 6 3 11 C15 13 23 17 28 24 C36 22 45 23 52 21 Z" />
            <path d="M68 21 C80 9 98 6 117 11 C105 13 97 17 92 24 C84 22 75 23 68 21 Z" />
          </g>
          <g stroke="#070b1c" strokeWidth="1.6" strokeLinecap="round" fill="none">
            <path d="M12 12 C24 15 32 19 38 23" />
            <path d="M108 12 C96 15 88 19 82 23" />
          </g>
          <circle cx="60" cy="23" r="9" fill="#e9b93f" />
          <circle cx="57" cy="20" r="2.6" fill="#fff6cf" />
        </svg>
        <span className="brand-sep" />
        <span>
          Mundial <b>Quidditch</b>
        </span>
      </Link>

      <TopNav />

      {session?.user ? (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn btn-ghost btn-sm">
            Salir
          </button>
        </form>
      ) : (
        <SignInButton label="Entrar" className="btn btn-gold btn-sm" />
      )}
    </header>
  );
}
