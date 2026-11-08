import { cookies } from "next/headers";

// Cierre de la clasificación: 29/11/2026 a las 24:00 UTC (= 30/11 00:00 UTC = 21:00 en Argentina).
// Para cambiar la fecha, tocá solo esta línea.
export const DEADLINE_MS = Date.UTC(2026, 10, 30, 0, 0, 0);

/** ¿Ya cerró de verdad? (lo usa el servidor para bloquear partidas) */
export const isClosedNow = () => Date.now() >= DEADLINE_MS;

/**
 * Estado para mostrar las páginas. Con la cookie de vista previa (se activa con ?preview)
 * la web se ve como si ya hubiera cerrado. Es solo visual: el servidor sigue aceptando
 * partidas hasta la fecha real.
 */
export async function seasonState() {
  const jar = await cookies();
  const preview = jar.get("preview")?.value === "1";
  return { preview, closed: preview || isClosedNow() };
}
