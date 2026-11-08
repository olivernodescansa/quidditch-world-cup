import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todayAR } from "@/lib/players";
import { DAILY_BONUS } from "@/lib/game-config";
import { isClosedNow } from "@/lib/season";

export const dynamic = "force-dynamic";

/** Abre una partida en el servidor y, si es la primera del dia, suma el bono diario. */
export async function POST() {
  const session = await auth();
  const uid = session?.user?.id;
  if (!uid) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  if (isClosedNow())
    return NextResponse.json({ error: "La clasificación ya cerró." }, { status: 403 });

  const sql = db();
  const today = todayAR();

  const bonus = await sql`
    update players
    set bonus_points = bonus_points + ${DAILY_BONUS}, last_bonus_date = ${today}::date
    where id = ${uid} and (last_bonus_date is null or last_bonus_date < ${today}::date)
    returning bonus_points`;

  const me = await sql`select 1 from players where id = ${uid}`;
  if (!me.length) return NextResponse.json({ error: "Completá tu registro primero." }, { status: 403 });

  const s = await sql`insert into game_sessions (player_id) values (${uid}) returning id`;

  return NextResponse.json({
    sessionId: s[0].id,
    bonusAwarded: bonus.length > 0,
    bonus: DAILY_BONUS,
  });
}
