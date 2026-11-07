import { neon } from "@neondatabase/serverless";

let _sql;

function findUrl() {
  const direct = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (direct) return direct;
  // Por si Vercel agregó un prefijo (ej: STORAGE_DATABASE_URL)
  const key = Object.keys(process.env).find(
    (k) => /(DATABASE|POSTGRES)_URL$/.test(k) && !/UNPOOLED|NON_POOLING/.test(k),
  );
  return key ? process.env[key] : undefined;
}

/** Cliente SQL (HTTP, ideal para serverless). Se crea recien al usarse. */
export function db() {
  if (!_sql) {
    const url = findUrl();
    if (!url) throw new Error("Falta DATABASE_URL");
    _sql = neon(url);
  }
  return _sql;
}
