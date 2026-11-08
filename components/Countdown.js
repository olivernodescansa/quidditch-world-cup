"use client";

import { useEffect, useState } from "react";

/** Cuenta regresiva hasta el cierre de la clasificación. */
export default function Countdown({ to }) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, to - Date.now()));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [to]);
  if (left === null) return <span className="countdown">&nbsp;</span>;
  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return (
    <span className="countdown">
      {d}d {p(h)}h {p(m)}m {p(sec)}s
    </span>
  );
}
