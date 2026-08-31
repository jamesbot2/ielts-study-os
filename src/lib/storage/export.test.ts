import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "./db";
import {
  collectAllData,
  importBackup,
  parseBackupFile,
  BACKUP_FORMAT,
} from "./export";
import { saveProfile, createVocabCard } from "./repository";
import { DEFAULT_PROFILE } from "./types";

beforeEach(async () => {
  await resetDb();
});

describe("backup export / import", () => {
  it("collects all data with the correct format", async () => {
    await saveProfile({ ...DEFAULT_PROFILE, targetBand: 7 });
    const backup = await collectAllData();
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(backup.version).toBeGreaterThanOrEqual(1);
    expect(backup.data.profile.length).toBe(1);
  });

  it("round-trips data through replace import", async () => {
    await saveProfile({ ...DEFAULT_PROFILE, targetBand: 8 });
    await createVocabCard({ word: "resilient" });
    const backup = await collectAllData();

    // clear, then import with replace
    await resetDb();
    const file = new File([JSON.stringify(backup)], "backup.json", { type: "application/json" });
    const result = await importBackup(file, "replace");
    expect(result.ok).toBe(true);

    const { getProfile, listVocabCards } = await import("./repository");
    const p = await getProfile();
    expect(p.targetBand).toBe(8);
    const cards = await listVocabCards();
    expect(cards.length).toBe(1);
  });

  it("rejects a newer backup version", async () => {
    const backup = await collectAllData();
    const newer = { ...backup, version: 999 };
    const file = new File([JSON.stringify(newer)], "backup.json", { type: "application/json" });
    const result = await importBackup(file, "replace");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/newer/i);
  });

  it("parseBackupFile validates the format", async () => {
    const backup = await collectAllData();
    const parsed = await parseBackupFile(new File([JSON.stringify(backup)], "b.json", { type: "application/json" }));
    expect(parsed.format).toBe(BACKUP_FORMAT);
  });

  it("parseBackupFile rejects malformed data", async () => {
    const file = new File([JSON.stringify({ format: "wrong" })], "b.json", { type: "application/json" });
    await expect(parseBackupFile(file)).rejects.toThrow();
  });
});
