"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar, { AVATARS } from "@/components/Avatar";
import Crest from "@/components/Crest";
import { TEAMS, POSITIONS } from "@/lib/teams";

export default function RegisterForm({ defaultName }) {
  const router = useRouter();
  const [instagram, setInstagram] = useState("");
  const [icon, setIcon] = useState(1);
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagram, icon, team, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBlocked(Boolean(data.blocked));
        throw new Error(data.error || "No se pudo registrar.");
      }
      router.push("/jugar");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const ready = instagram.trim().length > 0 && team && role;

  return (
    <form onSubmit={submit} className="form">
      <p className="lead">
        ¡Hola{defaultName ? `, ${defaultName.split(" ")[0]}` : ""}! Armá tu ficha de jugador. Después de esto ya podés volar.
      </p>

      <label className="field">
        <span>Tu @ de Instagram</span>
        <div className="ig-input">
          <i>@</i>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
            placeholder="tu_usuario"
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={31}
            required
          />
        </div>
      </label>

      <fieldset className="field">
        <legend>Elegí tu ícono</legend>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a.id}
              className={`avatar-pick ${icon === a.id ? "on" : ""}`}
              onClick={() => setIcon(a.id)}
              aria-pressed={icon === a.id}
              aria-label={a.name}
            >
              <Avatar id={a.id} size={52} ring={icon === a.id ? "#f5c451" : "rgba(255,255,255,.15)"} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>¿A qué equipo te postulás?</legend>
        <div className="team-grid">
          {TEAMS.map((t) => (
            <button
              type="button"
              key={t.slug}
              className={`team-pick ${team === t.slug ? "on" : ""}`}
              onClick={() => setTeam(t.slug)}
              aria-pressed={team === t.slug}
            >
              <Crest slug={t.slug} size={40} />
              <span>{t.short}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>¿En qué posición?</legend>
        <div className="role-grid">
          {POSITIONS.map((p) => (
            <button
              type="button"
              key={p.id}
              className={`role-pick ${role === p.id ? "on" : ""}`}
              onClick={() => setRole(p.id)}
              aria-pressed={role === p.id}
            >
              <b>{p.label}</b>
              <small>{p.blurb}</small>
            </button>
          ))}
        </div>
        <p className="note">
          Tu lugar en el equipo se define por la tabla de puntos: los mejores de cada posición clasifican.
        </p>
      </fieldset>

      {error && <div className={`alert ${blocked ? "alert-block" : ""}`}>{error}</div>}

      <button className="btn btn-gold btn-block" disabled={!ready || loading}>
        {loading ? "Registrando…" : "Confirmar registro"}
      </button>
    </form>
  );
}
