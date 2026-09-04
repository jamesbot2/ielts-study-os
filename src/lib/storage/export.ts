// Data export / import / backup for the static, local-first app.

import { z } from "zod";
import { getDb, DB_NAME } from "./db";

export const BACKUP_FORMAT = "ielts-study-os-backup";
export const BACKUP_VERSION = 1;

const BackupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.number().int().min(1),
  exportedAt: z.string(),
  data: z.record(z.string(), z.array(z.unknown())),
});

export type BackupFile = z.infer<typeof BackupSchema>;

const TABLE_NAMES = [
  "profile",
  "settings",
  "studyTasks",
  "lessonProgress",
  "vocabulary",
  "vocabularyReviews",
  "practiceAttempts",
  "questionAttempts",
  "mistakes",
  "writingDrafts",
  "writingSubmissions",
  "speakingSessions",
  "speakingRecordings",
  "speakingTranscripts",
  "speakingTurns",
  "mockAttempts",
  "aiConversations",
  "aiMessages",
  "importedMaterials",
  "providerConfigs",
] as const;

export async function collectAllData(): Promise<BackupFile> {
  const db = getDb();
  const data: Record<string, unknown[]> = {};
  for (const table of TABLE_NAMES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data[table] = await (db as any)[table].toArray();
  }
  // Privacy guarantee: LLM provider API keys must never leave the device.
  // Keys are session-only by design (never in IndexedDB), but we defensively
  // strip any key-shaped fields from exported AI settings too.
  data.settings = (data.settings ?? []).map((row) => sanitizeSettingsRow(row));
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

/** Remove any secret-shaped field from an exported settings row (recursive). */
function sanitizeSettingsRow(row: unknown): unknown {
  return stripSecretFields(row);
}

const SECRET_FIELD_RE = /api_?key|secret|token/i;

function stripSecretFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => stripSecretFields(v));
  }
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_FIELD_RE.test(key)) continue;
    out[key] = stripSecretFields(val);
  }
  return out;
}

export function downloadBackup(data: BackupFile): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ielts-study-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportAll(): Promise<void> {
  downloadBackup(await collectAllData());
}

export type ImportMode = "merge" | "replace";

export interface ImportResult {
  ok: boolean;
  mode: ImportMode;
  counts: Record<string, number>;
  error?: string;
}

export async function parseBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  return BackupSchema.parse(parsed);
}

export async function importBackup(file: File, mode: ImportMode): Promise<ImportResult> {
  const backup = await parseBackupFile(file);

  if (backup.version > BACKUP_VERSION) {
    return {
      ok: false,
      mode,
      counts: {},
      error: `Backup version ${backup.version} is newer than supported version ${BACKUP_VERSION}. Please update the app.`,
    };
  }

  const db = getDb();
  const counts: Record<string, number> = {};

  if (mode === "replace") {
    // Clear every table, then bulk-insert.
    for (const table of TABLE_NAMES) {
      await db.table(table).clear();
    }
  }

  for (const table of TABLE_NAMES) {
    const rows = backup.data[table] ?? [];
    if (rows.length === 0) continue;
    // Strip Blob-like fields that cannot be serialized back from JSON.
    const clean = rows.map((r) => sanitizeForImport(r));
    if (mode === "replace") {
      await db.table(table).bulkPut(clean);
      counts[table] = clean.length;
    } else {
      // merge: only add rows whose id is not already present
      let added = 0;
      for (const row of clean) {
        const id = (row as { id?: string }).id;
        const key = (row as { lessonId?: string }).lessonId ?? id;
        const existing = key ? await db.table(table).get(key) : undefined;
        if (!existing) {
          await db.table(table).put(row);
          added += 1;
        }
      }
      counts[table] = added;
    }
  }

  return { ok: true, mode, counts };
}

function sanitizeForImport(row: unknown): Record<string, unknown> {
  const obj = row as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    // Blobs are not serializable to JSON; drop them (recordings are re-created).
    if (v instanceof Blob) continue;
    out[k] = v;
  }
  return out;
}

export async function resetAllData(): Promise<void> {
  await getDb().delete();
  // Dexie caches the instance; recreate by reloading is simplest. We force
  // a page reload from the caller after this resolves.
  indexedDB.deleteDatabase(DB_NAME);
}
