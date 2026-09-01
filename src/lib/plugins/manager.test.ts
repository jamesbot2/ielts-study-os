import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerPlugin, resetRegistry } from "./registry";
import { healthCheck, createProviderCache, setConfig } from "./manager";
import { registerAllPlugins } from "./register";
import { listEnabledVocabularyProviders, resolveVocabularyProvider } from "./vocabulary";
import { ProviderSchemaError } from "./errors";
import { resetDb } from "@/lib/storage/db";
import { getProviderConfig } from "@/lib/storage/repository";
import type { VocabularyProvider } from "./vocabulary/types";

beforeEach(async () => {
  resetRegistry();
  await resetDb();
  vi.unstubAllGlobals();
});

describe("runtime health check (no false positive)", () => {
  it("reports unavailable when the configured endpoint fails", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const health = await healthCheck("baicizhan");
    expect(health.status).not.toBe("healthy");
    expect(health.status).toBe("unavailable");
  });

  it("reports healthy when the configured endpoint responds", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ total: 2, list: ["a", "b"] }) }));
    const health = await healthCheck("baicizhan");
    expect(health.status).toBe("healthy");
  });

  it("updates lastHealthCheckedAt, not lastSyncAt", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ total: 0, list: [] }) }));
    await healthCheck("baicizhan");
    const cfg = await getProviderConfig("baicizhan");
    expect(cfg?.lastHealthCheckedAt).toBeTruthy();
    expect(cfg?.lastSyncAt).toBeNull();
  });
});

describe("provider cache namespacing", () => {
  it("does not collide across providers", async () => {
    const a = createProviderCache("a");
    const b = createProviderCache("b");
    await a.set("list", "A");
    expect(await a.get("list")).toBe("A");
    expect(await b.get("list")).toBeUndefined();
  });

  it("expires after TTL", async () => {
    const a = createProviderCache("a");
    await a.set("k", "v", 30); // 30ms TTL
    expect(await a.get("k")).toBe("v");
    await new Promise((r) => setTimeout(r, 60));
    expect(await a.get("k")).toBeUndefined();
  });
});

describe("fake provider architecture test", () => {
  it("a registered fake provider appears without editing core UI", async () => {
    registerAllPlugins();
    const fake: VocabularyProvider = {
      id: "fake",
      kind: "vocabulary",
      name: "Fake Provider",
      description: "Test provider",
      version: "1.0.0",
      source: { provider: "fake" },
      capabilities: ["VOCABULARY_BOOKS"],
      async listBooks() { return [{ id: "fake:1", providerId: "fake", externalId: "1", title: "Fake Book", language: "en", tags: [], source: {} }]; },
      async getBook(id) { return (await this.listBooks()).find((b) => b.id === id) ?? null; },
      async listEntries() { return { entries: [], total: 0, offset: 0, limit: 50 }; },
      async getEntry() { return null; },
      async healthCheck() { return { status: "healthy", checkedAt: new Date().toISOString() }; },
    };
    registerPlugin({
      id: "fake",
      name: "Fake Provider",
      description: "Test provider",
      version: "1.0.0",
      kind: "vocabulary",
      source: { provider: "fake" },
      capabilities: ["VOCABULARY_BOOKS"],
      async createRuntime() { return fake; },
    });
    await setConfig("fake", { enabled: true });

    const providers = await listEnabledVocabularyProviders();
    expect(providers.some((p) => p.id === "fake")).toBe(true);
  });
});

describe("health check must never false-positive on cache", () => {
  it("reports degraded (not healthy) when remote fails but cache exists", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    const cache = createProviderCache("baicizhan");
    await cache.set("list", { total: 2, list: ["a", "b"] });

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const health = await healthCheck("baicizhan");
    expect(health.status).toBe("degraded");
    expect(health.status).not.toBe("healthy");
    expect(health.message).toMatch(/cached data available/i);
  });

  it("reports healthy on remote success even when cache exists", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    await createProviderCache("baicizhan").set("list", { total: 1, list: ["a"] });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ total: 3, list: ["a", "b", "c"] }) }));
    const health = await healthCheck("baicizhan");
    expect(health.status).toBe("healthy");
  });
});

describe("schema error classification", () => {
  it("throws ProviderSchemaError for malformed list payload (not network error)", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ bad: "shape" }) }));
    const provider = await resolveVocabularyProvider("baicizhan");
    expect(provider).toBeTruthy();
    await expect(provider!.listBooks()).rejects.toBeInstanceOf(ProviderSchemaError);
  });
});

describe("config sanitization on persistence", () => {
  it("drops secret config fields before storing", async () => {
    registerAllPlugins();
    registerPlugin({
      id: "secret-test",
      name: "Secret Test",
      description: "Test",
      kind: "vocabulary",
      version: "1.0.0",
      source: { provider: "test" },
      capabilities: [],
      configFields: [
        { key: "token", label: "Token", type: "text", secret: true },
        { key: "baseUrl", label: "URL", type: "url" },
      ],
    });
    await setConfig("secret-test", { enabled: true, config: { token: "shhh", baseUrl: "https://x" } });
    const cfg = await getProviderConfig("secret-test");
    expect(cfg?.config.token).toBeUndefined();
    expect(cfg?.config.baseUrl).toBe("https://x");
  });
});

describe("search pagination total", () => {
  it("reports filtered total when a query is present", async () => {
    registerAllPlugins();
    await setConfig("baicizhan", { enabled: true });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ total: 3, list: ["apple", "application", "banana"] }) }));
    const provider = await resolveVocabularyProvider("baicizhan");
    const page = await provider!.listEntries("baicizhan:all", { query: "app", offset: 0, limit: 50 });
    expect(page.entries.length).toBe(2);
    expect(page.total).toBe(2);
  });
});
