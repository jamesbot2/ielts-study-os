import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerPlugin, listPlugins, getPlugin, findPluginsByCapability, findPluginsByKind, resetRegistry } from "./registry";
import { normalizeProviderError, ProviderNetworkError } from "./errors";
import { builtinVocabularyProvider } from "./vocabulary/builtin-provider";
import { BaicizhanVocabularyProvider } from "./vocabulary/baicizhan-provider";
import type { IeltsPlugin } from "./types";

beforeEach(() => resetRegistry());

function makePlugin(id: string, kind: IeltsPlugin["kind"], capabilities: IeltsPlugin["capabilities"]): IeltsPlugin {
  return { id, name: id, description: "", version: "1.0.0", kind, source: {}, capabilities };
}

describe("plugin registry", () => {
  it("registers and lists plugins", () => {
    registerPlugin(makePlugin("a", "vocabulary", ["VOCABULARY_BOOKS"]));
    registerPlugin(makePlugin("b", "practice", ["PRACTICE_LIST_SETS"]));
    expect(listPlugins().length).toBe(2);
    expect(getPlugin("a")?.id).toBe("a");
  });

  it("duplicate registration is idempotent", () => {
    registerPlugin(makePlugin("a", "vocabulary", []));
    registerPlugin(makePlugin("a", "vocabulary", []));
    expect(listPlugins().length).toBe(1);
  });

  it("finds by capability", () => {
    registerPlugin(makePlugin("a", "vocabulary", ["VOCABULARY_BOOKS"]));
    registerPlugin(makePlugin("b", "vocabulary", ["VOCABULARY_LOOKUP"]));
    expect(findPluginsByCapability("VOCABULARY_BOOKS").map((p) => p.id)).toEqual(["a"]);
  });

  it("finds by kind", () => {
    registerPlugin(makePlugin("a", "vocabulary", []));
    registerPlugin(makePlugin("b", "practice", []));
    expect(findPluginsByKind("practice").map((p) => p.id)).toEqual(["b"]);
  });
});

describe("provider errors", () => {
  it("normalizes unknown errors", () => {
    const err = normalizeProviderError(new Error("boom"), "p");
    expect(err.kind).toBe("unknown");
    expect(err.message).toBe("boom");
  });
  it("passes through typed errors", () => {
    const err = normalizeProviderError(new ProviderNetworkError("HTTP 500", "p"), "p");
    expect(err.kind).toBe("network");
  });
});

describe("builtin vocabulary provider", () => {
  it("lists books", async () => {
    const books = await builtinVocabularyProvider.listBooks();
    expect(books.length).toBeGreaterThanOrEqual(10);
    expect(books[0].wordCount).toBeGreaterThan(0);
  });
  it("lists entries with canonical fields", async () => {
    const books = await builtinVocabularyProvider.listBooks();
    const page = await builtinVocabularyProvider.listEntries(books[0].id, { limit: 5 });
    expect(page.entries.length).toBeGreaterThan(0);
    const e = page.entries[0];
    expect(e.word).toBeTruthy();
    expect(e.source.rawSourceType).toBe("builtin");
  });
});

describe("baicizhan provider", () => {
  function stubFetch(json: unknown, ok = true) {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok,
      json: async () => json,
    }));
  }

  it("normalizes a word response into canonical form", async () => {
    stubFetch({ total: 2, list: ["average", "test"] });
    const provider = new BaicizhanVocabularyProvider();
    const books = await provider.listBooks();
    expect(books[0].wordCount).toBe(2);

    stubFetch({
      word: "average",
      accent: "/ˈævərɪdʒ/",
      mean_cn: "n.平均数",
      mean_en: "the result of adding amounts and dividing",
      sentence: "His height equals the average.",
      sentence_trans: "他的身高等于平均值。",
      sentence_phrase: "the average of",
      word_etyma: "",
    });
    const entry = await provider.getEntry("average");
    expect(entry).toBeTruthy();
    expect(entry!.word).toBe("average");
    expect(entry!.ipa).toBe("/ˈævərɪdʒ/");
    expect(entry!.meaningZh).toBe("n.平均数");
    expect(entry!.definitionEn).toContain("adding amounts");
    expect(entry!.examples[0]).toBe("His height equals the average.");
    expect(entry!.collocations).toContain("the average of");
    expect(entry!.source.rawSourceType).toBe("provider");
    expect(entry!.partOfSpeech).toBe("n");
  });

  it("returns null for a malformed word response", async () => {
    stubFetch({ wrong: "shape" });
    const provider = new BaicizhanVocabularyProvider();
    const entry = await provider.getEntry("bad");
    expect(entry).toBeNull();
  });

  it("normalizes a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const provider = new BaicizhanVocabularyProvider();
    await expect(provider.listBooks()).rejects.toMatchObject({ kind: "network" });
  });

  it("reports unavailable health on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const provider = new BaicizhanVocabularyProvider();
    const health = await provider.healthCheck();
    expect(health.status).toBe("unavailable");
  });
});
