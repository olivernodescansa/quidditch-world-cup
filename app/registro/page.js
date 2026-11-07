import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPlayer } from "@/lib/players";
import RegisterForm from "@/components/RegisterForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Registro · Mundial de Quidditch" };

export default async function Registro() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  if (await getPlayer(session.user.id)) redirect("/jugar");

  return (
    <div className="wrap page">
      <p className="eyebrow">Último paso</p>
      <h1>Tu ficha de jugador</h1>
      <RegisterForm defaultName={session.user.name} />
    </div>
  );
}
