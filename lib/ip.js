import crypto from "node:crypto";

/**
 * IP real del visitante. En Vercel, estos headers los pone la plataforma
 * (el cliente no puede falsificarlos).
 */
export function getClientIp(headers) {
  const direct =
    headers.get("x-vercel-forwarded-for") ||
    headers.get("x-real-ip") ||
    (headers.get("x-forwarded-for") || "").split(",")[0];
  return (direct || "").trim() || "0.0.0.0";
}

function expandV6(ip) {
  ip = ip.split("%")[0];
  const [head, tail] = ip.split("::");
  const h = head ? head.split(":") : [];
  if (tail === undefined) return h.map((x) => x.padStart(4, "0"));
  const t = tail ? tail.split(":") : [];
  const fill = Math.max(0, 8 - h.length - t.length);
  return [...h, ...Array(fill).fill("0"), ...t].map((x) => x.padStart(4, "0"));
}

/**
 * IPv4 se usa completa. IPv6: solo el prefijo /64, porque cada usuario recibe
 * miles de millones de direcciones dentro de su /64 y sino seria trivial evadir el bloqueo.
 */
export function normalizeIp(ip) {
  if (ip.startsWith("::ffff:") && ip.includes(".")) ip = ip.slice(7);
  if (!ip.includes(":")) return ip;
  return expandV6(ip).slice(0, 4).join(":");
}

export function hashIp(ip) {
  const salt = process.env.IP_SALT || "cambiar-este-salt";
  return crypto.createHash("sha256").update(`${normalizeIp(ip)}|${salt}`).digest("hex");
}
