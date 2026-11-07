-- Mundial de Quidditch: esquema de base de datos (Postgres / Neon)

CREATE TABLE IF NOT EXISTS players (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  instagram text NOT NULL UNIQUE,
  icon smallint NOT NULL CHECK (icon BETWEEN 1 AND 8),
  team text NOT NULL,
  role text NOT NULL,
  best_score integer NOT NULL DEFAULT 0,
  best_speed integer NOT NULL DEFAULT 0,
  best_dodges integer NOT NULL DEFAULT 0,
  max_altitude integer NOT NULL DEFAULT 0,
  games_played integer NOT NULL DEFAULT 0,
  bonus_points integer NOT NULL DEFAULT 0,
  last_bonus_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS players_total_idx ON players ((best_score + bonus_points) DESC);
CREATE INDEX IF NOT EXISTS players_team_role_idx ON players (team, role);

-- Una IP (hasheada) = una cuenta. Las IP en lista blanca no pasan por esta tabla.
CREATE TABLE IF NOT EXISTS ip_registry (
  ip_hash text PRIMARY KEY,
  player_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ip_whitelist (
  ip_hash text PRIMARY KEY,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blocked_attempts (
  id serial PRIMARY KEY,
  ip_hash text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blocked_attempts_ip_idx ON blocked_attempts (ip_hash);

-- Cada partida se abre en el servidor; el puntaje solo se acepta contra una sesion abierta.
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS game_sessions_player_idx ON game_sessions (player_id, started_at DESC);
