import { SPEED0, SPEEDMAX } from "@/lib/game-config";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const SKILLS = [
  { id: "novato", name: "Primer vuelo", desc: "Ya estas en el aire.", test: () => true },
  { id: "finta", name: "Finta de Wronski", desc: "Top 50% de la tabla global.", test: (c) => c.pct >= 0.5 },
  { id: "looping", name: "Looping doble", desc: "Top 30% de la tabla global.", test: (c) => c.pct >= 0.7 },
  { id: "pique", name: "Pique de halcon", desc: "Top 15% de la tabla global.", test: (c) => c.pct >= 0.85 },
  { id: "snitch", name: "Ojo de Snitch", desc: "Top 5% de la tabla global.", test: (c) => c.pct >= 0.95 },
  { id: "torres", name: "Cazador de torres", desc: "Esquivaste 50+ obstaculos en una partida.", test: (c) => c.p.best_dodges >= 50 },
  { id: "altura", name: "Cabeza en las nubes", desc: "Superaste los 70 m de altura.", test: (c) => c.p.max_altitude >= 70 },
  { id: "constante", name: "Rutina de entrenamiento", desc: "Jugaste 25 partidas.", test: (c) => c.p.games_played >= 25 },
];

/**
 * Las stats mezclan lo que hiciste (tu mejor partida) con tu puesto en la tabla global:
 * a mayor puesto, mayor es el multiplicador. Todo se puede ajustar aca.
 */
export function computeStats(p, rank, n) {
  const pct = n > 1 ? 1 - (rank - 1) / (n - 1) : 1; // 1 = primero, 0 = ultimo
  const speedPersonal = clamp((p.best_speed - SPEED0) / (SPEEDMAX - SPEED0));
  const dodgePersonal = clamp(p.best_dodges / 120);
  const ctx = { pct, p };
  return {
    velocidad: Math.round(35 + 65 * (0.6 * pct + 0.4 * speedPersonal)),
    asertividad: Math.round(35 + 65 * (0.6 * pct + 0.4 * dodgePersonal)),
    altura: p.max_altitude,
    skills: SKILLS.map((s) => ({ id: s.id, name: s.name, desc: s.desc, unlocked: s.test(ctx) })),
  };
}
