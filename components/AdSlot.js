"use client";

import { useEffect } from "react";

/**
 * Bloque de anuncio de Google AdSense. No muestra nada hasta que cargues
 * NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXX) y el id del bloque (slot) en Vercel.
 * Regla de AdSense: nunca poner anuncios sobre el canvas del juego ni cerca de botones.
 */
export default function AdSlot({ slot, className = "" }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <div className={`ad-wrap ${className}`}>
      <span className="ad-label">Publicidad</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
