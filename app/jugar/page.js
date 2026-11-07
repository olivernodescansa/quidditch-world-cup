import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPlayer, totalOf } from "@/lib/players";
import Game from "@/components/Game";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jugar · Mundial de Quidditch" };

export default async function Jugar() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const player = await getPlayer(session.user.id);
  if (!player) redirect("/registro");

  return (
    <div className="wrap page">
      <p className="eyebrow">Entrenamiento</p>
      <h1>A volar, @{player.instagram}</h1>
      <p className="lead">Esquivá las bludgers y las torres. Cuanto más lejos llegues, más rápido va.</p>
      <Game initialBest={player.best_score} initialTotal={totalOf(player)} />
    </div>
  );
}
