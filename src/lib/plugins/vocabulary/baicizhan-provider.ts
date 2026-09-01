// Baicizhan vocabulary provider (community-compatible, unofficial).
//
// The Baicizhan word data is proprietary; this provider is an ADAPTER that
// fetches the community-hosted API at runtime and normalizes it into the
// canonical schema. No Baicizhan content is bundled in this repository.

import { z } from "zod";
import type {
  CanonicalVocabularyEntry,
  VocabularyBook,
  VocabularyPage,
  VocabularyPageOptions,
  VocabularyProvider,
} from "./types";
import type { PluginContext, PluginHealth } from "../types";
import { ProviderNetworkError, ProviderSchemaError } from "../errors";

const PROVIDER_ID = "baicizhan";
const DEFAULT_BASE_URL = "https://cdn.jsdelivr.net/gh/lyc8503/baicizhan-word-meaning-API/data";
const LIST_CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day
const WORD_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

const BaicizhanListSchema = z.object({ total: z.number(), list: z.array(z.string()) });

const BaicizhanWordSchema = z.object({
  word: z.string(),
  accent: z.string().optional().nullable(),
  mean_cn: z.string().optional().nullable(),
  mean_en: z.string().optional().nullable(),
  sentence: z.string().optional().nullable(),
  sentence_trans: z.string().optional().nullable(),
  sentence_phrase: z.string().optional().nullable(),
  word_etyma: z.string().optional().nullable(),
});

function escapeWord(word: string): string {
  return word.replace(/[/\\:*?"<>|]/g, "_").replace(/\s+/g, "_");
}

export interface BaicizhanConfig {
  baseUrl?: string;
  context?: PluginContext;
}

export class BaicizhanVocabularyProvider implements VocabularyProvider {
  readonly id = PROVIDER_ID;
  readonly kind = "vocabulary" as const;
  readonly name = "Baicizhan Vocabulary";
  readonly description = "Community-compatible Baicizhan word meanings (unofficial).";
  readonly version = "1.0.0";
  readonly source = {
    provider: "Baicizhan (community API)",
    repository: "https://github.com/lyc8503/baicizhan-word-meaning-API",
    attribution: "Data parsed from Baicizhan (百词斩); community-hosted, unofficial.",
  };
  readonly capabilities: Array<"VOCABULARY_BOOKS" | "VOCABULARY_LOOKUP"> = ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"];

  constructor(private readonly config: BaicizhanConfig = {}) {}

  private baseUrl(): string {
    const configured = this.config.baseUrl ?? (this.config.context?.config.baseUrl as string | undefined);
    return (configured ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  private cache() {
    return this.config.context?.cache;
  }

  private async fetchJson(url: string): Promise<unknown> {
    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    } catch (err) {
      throw new ProviderNetworkError((err as Error).message, PROVIDER_ID);
    }
    if (!res.ok) throw new ProviderNetworkError(`HTTP ${res.status}`, PROVIDER_ID);
    return res.json();
  }

  // Real remote fetch + validation (bypasses cache). Used by health checks.
  private async fetchRemoteWordList(): Promise<{ total: number; list: string[] }> {
    const url = `${this.baseUrl()}/list.json`;
    const raw = await this.fetchJson(url);
    const parsed = BaicizhanListSchema.safeParse(raw);
    if (!parsed.success) throw new ProviderSchemaError(parsed.error.message, PROVIDER_ID);
    return parsed.data;
  }

  // Cache-first list (for browsing).
  private async getWordList(): Promise<{ total: number; list: string[] }> {
    const cache = this.cache();
    if (cache) {
      const cached = await cache.get<{ total: number; list: string[] }>("list");
      if (cached) return cached;
    }
    const data = await this.fetchRemoteWordList();
    if (cache) await cache.set("list", data, LIST_CACHE_TTL);
    return data;
  }

  async listBooks(): Promise<VocabularyBook[]> {
    const list = await this.getWordList();
    return [
      {
        id: `${PROVIDER_ID}:all`,
        providerId: PROVIDER_ID,
        externalId: "all",
        title: "Baicizhan Vocabulary",
        description: "Community-hosted flat word catalog (unofficial). No verified IELTS-specific book.",
        language: "en",
        wordCount: list.total,
        testType: "both",
        tags: ["external", "community"],
        source: this.source,
      },
    ];
  }

  async getBook(bookId: string): Promise<VocabularyBook | null> {
    const books = await this.listBooks();
    return books.find((b) => b.id === bookId) ?? null;
  }

  async listEntries(bookId: string, options: VocabularyPageOptions = {}): Promise<VocabularyPage> {
    const { list } = await this.getWordList();
    const query = options.query?.trim().toLowerCase();
    const filtered = query ? list.filter((w) => w.toLowerCase().includes(query)) : list;
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    const words = filtered.slice(offset, offset + limit);
    // total reflects the filtered result count when searching.
    const total = filtered.length;

    const entries: CanonicalVocabularyEntry[] = words.map((word) => ({
      id: `${PROVIDER_ID}:${word.toLowerCase()}`,
      word,
      examples: [],
      collocations: [],
      synonyms: [],
      antonyms: [],
      wordFamily: [],
      topics: [],
      skills: [],
      tags: ["external"],
      source: { providerId: PROVIDER_ID, providerName: "Baicizhan", externalId: word, rawSourceType: "provider" },
    }));

    return { entries, total, offset, limit };
  }

  async getEntry(externalId: string): Promise<CanonicalVocabularyEntry | null> {
    const word = externalId.trim();
    if (!word) return null;

    const cache = this.cache();
    const cacheKey = `word:${word.toLowerCase()}`;
    if (cache) {
      const cached = await cache.get<CanonicalVocabularyEntry>(cacheKey);
      if (cached) return cached;
    }

    const url = `${this.baseUrl()}/words/${escapeWord(word)}.json`;
    let raw: unknown;
    try {
      raw = await this.fetchJson(url);
    } catch (err) {
      if (err instanceof ProviderNetworkError && err.message.includes("404")) return null;
      throw err;
    }
    const parsed = BaicizhanWordSchema.safeParse(raw);
    if (!parsed.success) return null;
    const w = parsed.data;

    const entry: CanonicalVocabularyEntry = {
      id: `${PROVIDER_ID}:${w.word.toLowerCase()}`,
      word: w.word,
      partOfSpeech: parsePos(w.mean_cn),
      ipa: w.accent ?? null,
      meaningZh: w.mean_cn ?? null,
      definitionEn: w.mean_en ?? null,
      examples: w.sentence ? [w.sentence] : [],
      collocations: w.sentence_phrase ? [w.sentence_phrase] : [],
      synonyms: [],
      antonyms: [],
      wordFamily: [],
      topics: [],
      skills: [],
      tags: ["external", "baicizhan"],
      source: {
        providerId: PROVIDER_ID,
        providerName: "Baicizhan",
        externalId: w.word,
        sourceUrl: url,
        attribution: this.source.attribution,
        rawSourceType: "provider",
      },
    };
    if (cache) await cache.set(cacheKey, entry, WORD_CACHE_TTL);
    return entry;
  }

  async healthCheck(): Promise<PluginHealth> {
    const cache = this.cache();
    const hasCached = cache ? Boolean(await cache.get("list")) : false;
    try {
      // Health must check the REMOTE endpoint, never the cache.
      await this.fetchRemoteWordList();
      return { status: "healthy", checkedAt: new Date().toISOString() };
    } catch {
      return {
        status: hasCached ? "degraded" : "unavailable",
        message: hasCached ? "Remote unavailable; cached data available." : "Could not reach the Baicizhan community API.",
        checkedAt: new Date().toISOString(),
      };
    }
  }
}

function parsePos(meanCn: string | null | undefined): string | null {
  if (!meanCn) return null;
  const match = meanCn.match(/^([a-z]+)\./i);
  return match ? match[1].toLowerCase() : null;
}
