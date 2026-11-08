import { NextResponse } from "next/server";

/**
 * Vista previa del cierre (29/11): entrá a cualquier página con ?preview para activarla
 * y con ?preview=0 para salir. Guarda una cookie y limpia la URL.
 */
export function middleware(req) {
  const { searchParams } = req.nextUrl;
  if (!searchParams.has("preview")) return NextResponse.next();
  const off = searchParams.get("preview") === "0";
  const url = req.nextUrl.clone();
  url.searchParams.delete("preview");
  const res = NextResponse.redirect(url);
  if (off) res.cookies.delete("preview");
  else res.cookies.set("preview", "1", { path: "/", maxAge: 60 * 60 * 6, sameSite: "lax" });
  return res;
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
