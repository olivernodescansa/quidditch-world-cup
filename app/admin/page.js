import { notFound } from "next/navigation";
import { auth, isAdminEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminActions from "@/components/AdminActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Mundial de Quidditch" };

export default async function Admin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) notFound();

  const sql = db();
  const [blocked, allowed, stats] = await Promise.all([
    sql`select ip_hash, count(*)::int as intentos, max(created_at) as ultimo, array_agg(distinct email) as emails
        from blocked_attempts group by ip_hash order by max(created_at) desc limit 50`,
    sql`select ip_hash, note from ip_whitelist order by created_at desc`,
    sql`select (select count(*)::int from players) as jugadores, (select count(*)::int from blocked_attempts) as bloqueos`,
  ]);
  const allowedSet = new Set(allowed.map((a) => a.ip_hash));

  return (
    <div className="wrap page">
      <p className="eyebrow">Panel del host</p>
      <h1>Anti-trampas</h1>
      <p className="lead">
        {stats[0].jugadores} jugadores · {stats[0].bloqueos} intentos bloqueados. Las IP se guardan hasheadas: acá ves un identificador, no la IP real.
      </p>

      <h2 className="h2" style={{ fontSize: "1.2rem" }}>Intentos bloqueados</h2>
      <div className="table">
        {blocked.length === 0 && <p className="muted">Sin bloqueos todavía.</p>}
        {blocked.map((b) => (
          <div className="trow" key={b.ip_hash}>
            <div>
              <b>{b.ip_hash.slice(0, 10)}…</b> · {b.intentos} intento(s)
              <br />
              <span className="muted">{(b.emails || []).join(", ")}</span>
            </div>
            {allowedSet.has(b.ip_hash) ? (
              <AdminActions ipHash={b.ip_hash} action="revoke" label="Quitar de lista blanca" />
            ) : (
              <AdminActions ipHash={b.ip_hash} action="allow" label="Liberar IP" />
            )}
          </div>
        ))}
      </div>

      <h2 className="h2" style={{ fontSize: "1.2rem", marginTop: 26 }}>Lista blanca</h2>
      <div className="table">
        {allowed.length === 0 && <p className="muted">Ninguna IP liberada.</p>}
        {allowed.map((a) => (
          <div className="trow" key={a.ip_hash}>
            <span>{a.ip_hash.slice(0, 10)}…</span>
            <AdminActions ipHash={a.ip_hash} action="revoke" label="Quitar" />
          </div>
        ))}
      </div>
    </div>
  );
}
