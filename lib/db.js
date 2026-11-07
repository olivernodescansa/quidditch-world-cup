import { neon } from "@neondatabase/serverless";

let _sql;

/** Cliente SQL (HTTP, ideal para serverless). Se crea recien al usarse. */
export function db() {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error("Falta DATABASE_URL");
    _sql = neon(url);
  }
  return _sql;
}
