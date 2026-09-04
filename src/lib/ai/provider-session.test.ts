import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/storage/db";
import {
  setProviderSessionKey,
  getProviderSessionKey,
  clearProviderSessionKey,
  clearAllProviderSessionKeys,
  hasProviderSessionKey,
} from "@/lib/ai/provider-session";
import { saveSettings, getSettings } from "@/lib/storage/repository";
import { collectAllData } from "@/lib/storage/export";

beforeEach(async () => {
  await resetDb();
  clearAllProviderSessionKeys();
});

describe("provider session keys", () => {
  it("stores keys in memory only", () => {
    setProviderSessionKey("p1", "sk-secret-123");
    expect(getProviderSessionKey("p1")).toBe("sk-secret-123");
    expect(hasProviderSessionKey("p1")).toBe(true);
  });

  it("clears an individual key", () => {
    setProviderSessionKey("p1", "sk-1");
    setProviderSessionKey("p2", "sk-2");
    clearProviderSessionKey("p1");
    expect(getProviderSessionKey("p1")).toBeUndefined();
    expect(getProviderSessionKey("p2")).toBe("sk-2");
  });

  it("empty key removes the entry", () => {
    setProviderSessionKey("p1", "sk-1");
    setProviderSessionKey("p1", "   ");
    expect(hasProviderSessionKey("p1")).toBe(false);
  });

  it("trims stored keys", () => {
    setProviderSessionKey("p1", "  sk-padded  ");
    expect(getProviderSessionKey("p1")).toBe("sk-padded");
  });
});

async function saveAiPatch(patch: Record<string, unknown>) {
  const current = await getSettings();
  await saveSettings({ ...current, ai: { ...current.ai, ...patch } as typeof current.ai });
}

describe("provider metadata persistence excludes keys", () => {
  it("saves provider metadata but never a key field", async () => {
    await saveAiPatch({
      llmProviders: [{ id: "p1", displayName: "DS", preset: "deepseek", baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat", createdAt: "now" }],
      activeProviderId: "p1",
    });
    const s = await getSettings();
    expect(s.ai.llmProviders[0].baseUrl).toBe("https://api.deepseek.com/v1");
    // The persisted profile shape has no apiKey member at all.
    expect("apiKey" in (s.ai.llmProviders[0] as unknown as Record<string, unknown>)).toBe(false);
  });

  it("backup export never contains an apiKey field anywhere in settings", async () => {
    // Simulate a legacy/defensive row that DID store a key + secret: export
    // must strip them before writing the backup file.
    const current = await getSettings();
    const legacy = current.ai.llmProviders as unknown[];
    legacy.push({
      id: "p1", displayName: "DS", preset: "custom",
      baseUrl: "https://x.example/v1", model: "m",
      createdAt: "now", apiKey: "sk-leak", secret: "also-leak",
    });
    await saveSettings({ ...current, ai: { ...current.ai, llmProviders: legacy } as typeof current.ai });

    const backup = await collectAllData();
    const raw = JSON.stringify(backup);
    expect(raw).not.toContain("sk-leak");
    expect(raw).not.toContain("also-leak");
  });
});
