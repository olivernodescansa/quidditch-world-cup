"use client";

import { useEffect, useRef, useState } from "react";
import { SPEED0, speedAt, SCORE_DIV } from "@/lib/game-config";

// Coordenadas logicas del juego (el canvas se escala por CSS)
const W = 600;
const H = 400;
const HIGH = 105; // carril alto (se esquivan las torres)
const LOW = 295; // carril bajo (se esquivan las bludgers)
const PX = 110; // posicion horizontal del jugador
const TOWER_TOP = H - 210;
const TOWER_APEX = H - 255;

function circleRect(cx, cy, r, x1, y1, x2, y2) {
  const nx = Math.max(x1, Math.min(cx, x2));
  const ny = Math.max(y1, Math.min(cy, y2));
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
}

function newRun() {
  return {
    state: "idle",
    t: 0,
    dist: 0,
    y: LOW,
    held: false,
    obstacles: [],
    spawnIn: 500,
    lastType: null,
    dodges: 0,
    maxAlt: 0,
    maxSpeed: SPEED0,
  };
}

export default function Game({ initialBest, initialTotal }) {
  const canvasRef = useRef(null);
  const g = useRef(newRun());
  const sessionRef = useRef(null);
  const starsRef = useRef(
    Array.from({ length: 50 }, () => ({ x: Math.random() * W, y: Math.random() * 230, r: Math.random() * 1.4 + 0.3, s: Math.random() * 0.4 + 0.1 })),
  );

  const [ui, setUi] = useState("idle"); // idle | starting | running | over
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(initialBest);
  const [total, setTotal] = useState(initialTotal);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // ---------- controles ----------
  useEffect(() => {
    const down = (e) => {
      if (["ArrowUp", "w", "W", " "].includes(e.key)) {
        g.current.held = true;
        if (e.key === " ") e.preventDefault();
      }
      if (["ArrowDown", "s", "S"].includes(e.key)) g.current.held = false;
    };
    const up = (e) => {
      if (["ArrowUp", "w", "W", " "].includes(e.key)) g.current.held = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ---------- bucle del juego ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf;
    let last = performance.now();

    function spawn(speed) {
      const run = g.current;
      const type = Math.random() < 0.5 ? "bludger" : "tower";
      const base = type === run.lastType ? speed * 0.3 + 110 : speed * 0.55 + 140;
      run.obstacles.push({ type, x: W + 60, w: type === "tower" ? 56 : 44, counted: false, phase: Math.random() * 6 });
      run.lastType = type;
      run.spawnIn = base + Math.random() * speed * 0.45;
    }

    function update(dt) {
      const run = g.current;
      if (run.state !== "running") return;
      const speed = speedAt(run.t);
      run.t += dt;
      run.dist += speed * dt;
      run.maxSpeed = Math.max(run.maxSpeed, speed);

      const target = run.held ? HIGH : LOW;
      run.y += (target - run.y) * Math.min(1, dt * 10);
      run.maxAlt = Math.max(run.maxAlt, Math.round(((H - run.y) / H) * 100));

      run.spawnIn -= speed * dt;
      if (run.spawnIn <= 0) spawn(speed);

      for (const o of run.obstacles) {
        o.x -= speed * dt;
        if (!o.counted && o.x + o.w / 2 < PX - 20) {
          o.counted = true;
          run.dodges += 1;
        }
      }
      run.obstacles = run.obstacles.filter((o) => o.x > -80);

      // colisiones
      const r = 13;
      for (const o of run.obstacles) {
        if (o.type === "bludger") {
          const by = HIGH + Math.sin(run.t * 3 + o.phase) * 22;
          if ((PX - o.x) ** 2 + (run.y - by) ** 2 < (r + 19) ** 2) return crash();
        } else {
          const hitBody = circleRect(PX, run.y, r, o.x - o.w / 2 + 6, TOWER_TOP, o.x + o.w / 2 - 6, H);
          const hitRoof = circleRect(PX, run.y, r, o.x - 11, TOWER_APEX + 8, o.x + 11, TOWER_TOP);
          if (hitBody || hitRoof) return crash();
        }
      }
    }

    function crash() {
      const run = g.current;
      run.state = "over";
      finishRun();
    }

    // ---------- dibujo ----------
    function drawBackground(run) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#080a22");
      grad.addColorStop(0.6, "#2a1a5e");
      grad.addColorStop(1, "#5b2a73");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#fff";
      for (const s of starsRef.current) {
        const x = (((s.x - run.dist * s.s * 0.05) % W) + W) % W;
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(run.t * 2 + s.x);
        ctx.beginPath();
        ctx.arc(x, s.y, s.r, 0, 6.3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // luna
      ctx.fillStyle = "#f6e9c0";
      ctx.beginPath();
      ctx.arc(500, 70, 26, 0, 6.3);
      ctx.fill();

      // castillo lejano (parallax)
      ctx.fillStyle = "#1a1040";
      const off = (run.dist * 0.06) % 300;
      for (let k = -1; k < 4; k++) {
        const bx = k * 300 - off;
        ctx.fillRect(bx + 20, 250, 60, 150);
        ctx.fillRect(bx + 120, 280, 90, 120);
        ctx.fillRect(bx + 230, 235, 40, 165);
        ctx.beginPath();
        ctx.moveTo(bx + 14, 250);
        ctx.lineTo(bx + 50, 205);
        ctx.lineTo(bx + 86, 250);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(bx + 224, 235);
        ctx.lineTo(bx + 250, 190);
        ctx.lineTo(bx + 276, 235);
        ctx.fill();
      }
      // niebla
      const fog = ctx.createLinearGradient(0, 330, 0, H);
      fog.addColorStop(0, "rgba(140,90,170,0)");
      fog.addColorStop(1, "rgba(140,90,170,0.55)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 330, W, 70);
    }

    function drawTower(o) {
      const x = o.x;
      ctx.fillStyle = "#4a4f73";
      ctx.fillRect(x - 28, TOWER_TOP, 56, 210);
      ctx.fillStyle = "#3a3e5e";
      ctx.fillRect(x - 28, TOWER_TOP, 10, 210);
      // almenas
      ctx.fillStyle = "#5d6390";
      ctx.fillRect(x - 32, TOWER_TOP - 6, 64, 8);
      // techo
      ctx.fillStyle = "#8c2f54";
      ctx.beginPath();
      ctx.moveTo(x - 26, TOWER_TOP - 6);
      ctx.lineTo(x, TOWER_APEX);
      ctx.lineTo(x + 26, TOWER_TOP - 6);
      ctx.fill();
      // ventanas
      ctx.fillStyle = "#ffd36b";
      ctx.fillRect(x - 5, TOWER_TOP + 30, 10, 18);
      ctx.fillRect(x - 5, TOWER_TOP + 90, 10, 18);
    }

    function drawBludger(o, t) {
      const y = HIGH + Math.sin(t * 3 + o.phase) * 22;
      const grd = ctx.createRadialGradient(o.x - 6, y - 6, 3, o.x, y, 24);
      grd.addColorStop(0, "#6b6f86");
      grd.addColorStop(1, "#14141f");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(o.x, y, 22, 0, 6.3);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,80,80,.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(o.x, y, 26 + Math.sin(t * 8) * 2, 0, 6.3);
      ctx.stroke();
      ctx.fillStyle = "#ff5252";
      ctx.beginPath();
      ctx.arc(o.x - 7, y - 3, 3, 0, 6.3);
      ctx.arc(o.x + 4, y - 3, 3, 0, 6.3);
      ctx.fill();
    }

    function drawPlayer(run) {
      const target = run.held ? HIGH : LOW;
      const tilt = Math.min(0.35, (Math.abs(run.y - target) / 190) * 0.7);
      ctx.save();
      ctx.translate(PX, run.y);
      ctx.rotate(run.held ? -tilt : tilt); // sube: morro arriba / baja: morro abajo
      // escoba
      ctx.strokeStyle = "#8a5a2b";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-30, 6);
      ctx.lineTo(32, 6);
      ctx.stroke();
      ctx.strokeStyle = "#c9963f";
      ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-30, 6);
        ctx.lineTo(-48, 6 + i * 3 + Math.sin(run.t * 30 + i) * 1.2);
        ctx.stroke();
      }
      // capa
      ctx.fillStyle = "#d1202f";
      ctx.beginPath();
      ctx.moveTo(-2, -12);
      ctx.lineTo(-28, -4 + Math.sin(run.t * 14) * 3);
      ctx.lineTo(-4, 4);
      ctx.fill();
      // cuerpo
      ctx.fillStyle = "#2b2f55";
      ctx.fillRect(-4, -14, 12, 18);
      // cabeza
      ctx.fillStyle = "#f2c9a0";
      ctx.beginPath();
      ctx.arc(5, -20, 7, 0, 6.3);
      ctx.fill();
      ctx.fillStyle = "#f5c451";
      ctx.beginPath();
      ctx.arc(5, -23, 7, Math.PI, 0);
      ctx.fill();
      ctx.restore();
    }

    function drawHud(run) {
      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.font = "700 20px Montserrat, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(String(Math.floor(run.dist / SCORE_DIV)).padStart(5, "0"), 16, 30);
      ctx.font = "600 11px Montserrat, system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,.65)";
      ctx.fillText(`VEL ${Math.round(speedAt(run.t) / 10)}`, 16, 48);
      ctx.textAlign = "right";
      ctx.fillText(`ALTURA ${Math.round(((H - run.y) / H) * 100)} m`, W - 16, 30);
      ctx.fillText(`ESQUIVES ${run.dodges}`, W - 16, 48);
      ctx.textAlign = "left";
    }

    function draw() {
      const run = g.current;
      drawBackground(run);
      for (const o of run.obstacles) (o.type === "tower" ? drawTower(o) : drawBludger(o, run.t));
      drawPlayer(run);
      drawHud(run);
    }

    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (g.current.state === "idle") g.current.t += dt * 0.2; // animacion suave en espera
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- partida ----------
  async function startRun() {
    if (ui === "starting" || ui === "running") return;
    setError("");
    setResult(null);
    setUi("starting");
    try {
      const res = await fetch("/api/game/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar la partida.");
      sessionRef.current = data.sessionId;
      if (data.bonusAwarded) {
        setToast(`+${data.bonus} puntos por tu primera partida de hoy`);
        setTotal((t) => t + data.bonus);
        setTimeout(() => setToast(""), 3500);
      }
      g.current = { ...newRun(), state: "running", held: g.current.held };
      setUi("running");
    } catch (e) {
      setError(e.message);
      setUi("idle");
    }
  }

  async function finishRun() {
    const run = g.current;
    const score = Math.floor(run.dist / SCORE_DIV);
    const sessionId = sessionRef.current;
    sessionRef.current = null;
    setUi("over");
    setResult({ score, saving: true });
    try {
      const res = await fetch("/api/game/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          score,
          maxSpeed: Math.round(run.maxSpeed),
          dodges: run.dodges,
          altitude: run.maxAlt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el puntaje.");
      setBest(data.best);
      setTotal(data.total);
      setResult({ score, record: data.record, rank: data.rank, players: data.players });
    } catch (e) {
      setResult({ score, error: e.message });
    }
  }

  // ---------- punteros ----------
  const press = (e) => {
    e.preventDefault();
    g.current.held = true;
  };
  const release = () => {
    g.current.held = false;
  };

  return (
    <div className="game">
      <div className="game-stats">
        <div>
          <span>Mejor puntaje</span>
          <strong>{best}</strong>
        </div>
        <div>
          <span>Puntos totales</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="game-frame">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          onContextMenu={(e) => e.preventDefault()}
        />

        {toast && <div className="game-toast">{toast}</div>}

        {ui !== "running" && (
          <div className="game-overlay">
            {ui === "over" && result ? (
              <>
                <p className="ov-small">¡Chocaste!</p>
                <p className="ov-score">{result.score}</p>
                {result.saving && <p className="ov-small">Guardando puntaje…</p>}
                {result.record && <p className="ov-record">¡Nuevo récord personal!</p>}
                {result.rank && (
                  <p className="ov-small">
                    Puesto global #{result.rank} de {result.players}
                  </p>
                )}
                {result.error && <p className="ov-error">{result.error}</p>}
              </>
            ) : (
              <>
                <p className="ov-title">Esquivá lo que venga</p>
                <p className="ov-small">
                  Mantené apretado para <b>subir</b> (torres). Soltá para <b>bajar</b> (bludgers).
                </p>
                <p className="ov-small">En PC: ↑ / Espacio sube, ↓ baja.</p>
              </>
            )}
            {error && <p className="ov-error">{error}</p>}
            <button className="btn btn-gold" onClick={startRun} disabled={ui === "starting"}>
              {ui === "starting" ? "Preparando…" : ui === "over" ? "Jugar de nuevo" : "Volar"}
            </button>
          </div>
        )}
      </div>
      <p className="game-hint">Tu mejor puntaje se guarda solo. Cada día, tu primera partida suma +50 puntos.</p>
    </div>
  );
}
