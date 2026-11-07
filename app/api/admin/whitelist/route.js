import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Libera (o vuelve a bloquear) una IP hasheada. Solo para admins. */
export async function POST(req) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { ipHash, action } = await req.json().catch(() => ({}));
  if (typeof ipHash !== "string" || !/^[0-9a-f]{64}$/.test(ipHash))
    return NextResponse.json({ error: "Hash inválido." }, { status: 400 });

  const sql = db();
  if (action === "allow") {
    await sql`insert into ip_whitelist (ip_hash, note) values (${ipHash}, 'liberada desde /admin') on conflict do nothing`;
  } else if (action === "revoke") {
    await sql`delete from ip_whitelist where ip_hash = ${ipHash}`;
  } else {
    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
