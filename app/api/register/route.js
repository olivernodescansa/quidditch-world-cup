import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, hashIp } from "@/lib/ip";
import { TEAMS, POSITIONS } from "@/lib/teams";

export const dynamic = "force-dynamic";

const IG_RE = /^[a-z0-9._]{1,30}$/;

export async function POST(req) {
  const session = await auth();
  const uid = session?.user?.id;
  const email = session?.user?.email;
  if (!uid || !email) return NextResponse.json({ error: "Iniciá sesión con Google." }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const instagram = String(body.instagram || "").trim().replace(/^@/, "").toLowerCase();
  const icon = Number(body.icon);
  const team = String(body.team || "");
  const role = String(body.role || "");

  if (!IG_RE.test(instagram))
    return NextResponse.json({ error: "Ese @ de Instagram no parece válido." }, { status: 400 });
  if (!Number.isInteger(icon) || icon < 1 || icon > 8)
    return NextResponse.json({ error: "Elegí un ícono de perfil." }, { status: 400 });
  if (!TEAMS.some((t) => t.slug === team))
    return NextResponse.json({ error: "Elegí un equipo." }, { status: 400 });
  if (!POSITIONS.some((p) => p.id === role))
    return NextResponse.json({ error: "Elegí una posición." }, { status: 400 });

  const sql = db();

  const existing = await sql`select id from players where id = ${uid}`;
  if (existing.length) return NextResponse.json({ error: "Ya estás registrado." }, { status: 409 });

  // --- ANTI-CHEAT: una IP = una cuenta (salvo IP en lista blanca) ---
  const ipHash = hashIp(getClientIp(req.headers));
  const wl = await sql`select 1 from ip_whitelist where ip_hash = ${ipHash}`;
  let registryClaimed = false;

  if (!wl.length) {
    // El INSERT con PRIMARY KEY es atomico: si dos registros llegan a la vez, solo uno gana.
    const claim = await sql`
      insert into ip_registry (ip_hash) values (${ipHash})
      on conflict (ip_hash) do nothing
      returning ip_hash`;
    if (!claim.length) {
      await sql`insert into blocked_attempts (ip_hash, email) values (${ipHash}, ${email})`;
      return NextResponse.json(
        {
          error:
            "Ya hay una cuenta registrada desde esta conexión. Solo se permite una cuenta por IP. Si creés que es un error, escribile al host.",
          blocked: true,
        },
        { status: 403 },
      );
    }
    registryClaimed = true;
  }

  try {
    await sql`
      insert into players (id, email, name, instagram, icon, team, role)
      values (${uid}, ${email}, ${session.user.name ?? null}, ${instagram}, ${icon}, ${team}, ${role})`;
  } catch (err) {
    if (registryClaimed) await sql`delete from ip_registry where ip_hash = ${ipHash}`;
    if (err?.code === "23505")
      return NextResponse.json({ error: "Ese @ de Instagram ya está en uso." }, { status: 409 });
    console.error("register error", err);
    return NextResponse.json({ error: "No pudimos completar el registro." }, { status: 500 });
  }

  if (registryClaimed) await sql`update ip_registry set player_id = ${uid} where ip_hash = ${ipHash}`;

  return NextResponse.json({ ok: true });
}
