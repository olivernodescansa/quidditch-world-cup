// Crea las tablas en tu base Neon. Uso:  DATABASE_URL="..." npm run db:init
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Falta DATABASE_URL (o POSTGRES_URL).");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL("../schema.sql", import.meta.url), "utf8");
const statements = schema
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
}
console.log(`OK: ${statements.length} sentencias ejecutadas.`);
