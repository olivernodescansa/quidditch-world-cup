import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import SignInButton from "@/components/SignInButton";

export default async function TopBar() {
  const session = await auth();
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <ellipse cx="12" cy="26" rx="11" ry="4.5" fill="#fff" opacity=".85" transform="rotate(-25 12 26)" />
          <ellipse cx="52" cy="26" rx="11" ry="4.5" fill="#fff" opacity=".85" transform="rotate(25 52 26)" />
          <circle cx="32" cy="34" r="12" fill="#f5c451" />
        </svg>
        <span>
          MUNDIAL <b>QUIDDITCH</b>
        </span>
      </Link>
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
