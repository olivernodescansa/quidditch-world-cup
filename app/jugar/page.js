import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { getPlayer, totalOf, starters } from "@/lib/players";
import { seasonState } from "@/lib/season";
import Star from "@/components/Star";
import Game from "@/components/Game";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jugar · Mundial de Quidditch" };

export default async function Jugar() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const player = await getPlayer(session.user.id);
  if (!player) redirect("/registro");

  const { closed } = await seasonState();
  if (closed) {
    let isStarter = false;
    try {
      isStarter = (await starters()).some((s) => s.id === player.id);
    } catch {}
    return (
      <div className="wrap page">
        <div className="closed-card">
          <Star size={34} title="Clasificación cerrada" />
          <h1>Clasificación cerrada</h1>
          <p>
            {isStarter
              ? `¡Sos titular, @${player.instagram}! Te esperamos en los partidos de diciembre.`
              : `Ya no se puede seguir jugando, @${player.instagram}. Los titulares de cada equipo quedaron definidos y juegan en diciembre.`}
          </p>
          <Link href="/ranking?titulares=1" className="btn btn-gold">Ver titulares ›</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <p className="eyebrow">Entrenamiento</p>
      <h1>A volar, @{player.instagram}</h1>
      <p className="lead">Esquivá las bludgers y las torres. Cuanto más lejos llegues, más rápido va.</p>
      <Game initialBest={player.best_score} initialTotal={totalOf(player)} />
    </div>
  );
}
