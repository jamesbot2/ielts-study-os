import "server-only";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { SCHEMA_SQL, SCHEMA_VERSION } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.IELTS_DB_PATH || path.join(DATA_DIR, "ielts.db");

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  return db;
}

export function migrate(database: DatabaseSync): void {
  database.exec(SCHEMA_SQL);
  const row = database
    .prepare("SELECT value FROM settings WHERE key = 'schema_version'")
    .get() as { value?: string } | undefined;
  const current = row ? Number(row.value) : 0;
  if (current < SCHEMA_VERSION) {
    database
      .prepare(
        "INSERT INTO settings(key, value) VALUES('schema_version', ?) " +
          "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      )
      .run(String(SCHEMA_VERSION));
  }
}

export function getSetting<T = string>(key: string): T | null {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return row.value as unknown as T;
  }
}

export function setSetting(key: string, value: unknown): void {
  getDb()
    .prepare(
      "INSERT INTO settings(key, value) VALUES(?, ?) " +
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, JSON.stringify(value));
}

export function deleteSetting(key: string): void {
  getDb().prepare("DELETE FROM settings WHERE key = ?").run(key);
}

// Minimal migration escape hatch for tests / reset.
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDatabase(): void {
  closeDb();
  if (fs.existsSync(/* turbopackIgnore: true */ DB_PATH)) fs.unlinkSync(DB_PATH);
  getDb();
}
