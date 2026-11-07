// Constantes del juego. Las usan el cliente (para jugar) y el servidor (para validar puntajes).

export const SPEED0 = 240; // velocidad inicial (px/s)
export const ACC = 10; // aceleracion (px/s por segundo)
export const SPEEDMAX = 820; // tope de velocidad
export const SCORE_DIV = 16; // 1 punto cada 16 px recorridos
export const MAX_ALTITUDE = 80; // metros, tope fisico del juego
export const DAILY_BONUS = 50;

export function speedAt(t) {
  return Math.min(SPEED0 + ACC * t, SPEEDMAX);
}

export function distanceAt(t) {
  const tc = (SPEEDMAX - SPEED0) / ACC;
  if (t <= tc) return SPEED0 * t + (ACC * t * t) / 2;
  return SPEED0 * tc + (ACC * tc * tc) / 2 + SPEEDMAX * (t - tc);
}

/** Puntaje maximo posible tras t segundos de juego. */
export function maxScoreAt(t) {
  return distanceAt(t) / SCORE_DIV;
}
