import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRankInfo } from "@/lib/players";
import { maxScoreAt, speedAt, MAX_ALTITUDE } from "@/lib/game-config";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Recibe el resultado de una partida. El servidor NO confia en el cliente:
 * - la sesion tiene que existir, ser del jugador y no estar cerrada (un solo uso)
 * - el puntaje, la velocidad y los esquives tienen que ser posibles para el tiempo
 *   REAL transcurrido desde que se abrio la sesion (medido por el servidor).
 */
export async function POST(req) {
  const session = await auth();
  const uid = session?.user?.id;
  if (!uid) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const sessionId = String(b.sessionId || "");
  const score = Math.floor(Number(b.score));
  const maxSpeed = Math.floor(Number(b.maxSpeed));
  const dodges = Math.floor(Number(b.dodges));
  const altitude = Math.floor(Number(b.altitude));

  if (!UUID_RE.test(sessionId) || [score, maxSpeed, dodges, altitude].some((n) => !Number.isFinite(n) || n < 0))
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });

  const sql = db();

  const closed = await sql`
    update game_sessions set finished = true
    where id = ${sessionId}::uuid and player_id = ${uid} and finished = false
    returning extract(epoch from (now() - started_at)) as elapsed`;
  if (!closed.length) return NextResponse.json({ error: "Sesión de juego inválida." }, { status: 400 });

  const T = Number(closed[0].elapsed) + 1.5; // margen por latencia
  const plausible =
    score <= Math.ceil(maxScoreAt(T) * 1.1) + 5 &&
    maxSpeed <= Math.ceil(speedAt(T)) + 5 &&
    dodges <= Math.ceil(T / 0.28) + 2 &&
    altitude <= MAX_ALTITUDE;

  if (!plausible) {
    console.warn("run rechazada", { uid, score, maxSpeed, dodges, altitude, T });
    return NextResponse.json({ error: "Puntaje rechazado por el sistema anti-trampas." }, { status: 422 });
  }

  const prev = await sql`select best_score from players where id = ${uid}`;
  if (!prev.length) return NextResponse.json({ error: "Jugador no encontrado." }, { status: 404 });

  const upd = await sql`
    update players set
      games_played = games_played + 1,
      best_score = greatest(best_score, ${score}),
      best_speed = greatest(best_speed, ${maxSpeed}),
      best_dodges = greatest(best_dodges, ${dodges}),
      max_altitude = greatest(max_altitude, ${altitude})
    where id = ${uid}
    returning best_score, bonus_points`;

  const total = upd[0].best_score + upd[0].bonus_points;
  const { rank, n } = await getRankInfo(total);

  return NextResponse.json({
    ok: true,
    best: upd[0].best_score,
    total,
    record: score > prev[0].best_score,
    rank,
    players: n,
  });
}
