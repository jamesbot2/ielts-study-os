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
import type { PluginHealth } from "../types";
import { ProviderNetworkError, ProviderSchemaError } from "../errors";

const PROVIDER_ID = "baicizhan";
const DEFAULT_BASE_URL = "https://cdn.jsdelivr.net/gh/lyc8503/baicizhan-word-meaning-API/data";

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
  return word
    .replace(/[/\\:*?"<>|]/g, "_")
    .replace(/\s+/g, "_");
}

export interface BaicizhanConfig {
  baseUrl?: string;
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
  readonly capabilities: Array<"VOCABULARY_BOOKS" | "VOCABULARY_LOOKUP" | "VOCABULARY_SYNC"> = ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"];

  constructor(private readonly config: BaicizhanConfig = {}) {}

  private baseUrl(): string {
    return (this.config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
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

  private async getWordList(): Promise<string[]> {
    const url = `${this.baseUrl()}/list.json`;
    const raw = await this.fetchJson(url);
    const parsed = BaicizhanListSchema.safeParse(raw);
    if (!parsed.success) throw new ProviderSchemaError(parsed.error.message, PROVIDER_ID);
    return parsed.data.list;
  }

  async listBooks(): Promise<VocabularyBook[]> {
    const list = await this.getWordList();
    return [
      {
        id: `${PROVIDER_ID}:all`,
        providerId: PROVIDER_ID,
        externalId: "all",
        title: "Baicizhan Vocabulary",
        description: "Community-hosted word meanings (IELTS/TOEFL and more).",
        language: "en",
        wordCount: list.length,
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
    const list = await this.getWordList();
    const query = options.query?.trim().toLowerCase();
    const filtered = query ? list.filter((w) => w.toLowerCase().includes(query)) : list;
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    const words = filtered.slice(offset, offset + limit);

    // Return a stub page (word only); full details are fetched via getEntry.
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

    return { entries, total: filtered.length, offset, limit };
  }

  async getEntry(externalId: string): Promise<CanonicalVocabularyEntry | null> {
    const word = externalId.trim();
    if (!word) return null;
    const url = `${this.baseUrl()}/words/${escapeWord(word)}.json`;
    let raw: unknown;
    try {
      raw = await this.fetchJson(url);
    } catch (err) {
      // A 404 for a non-existent word is not fatal.
      if (err instanceof ProviderNetworkError && err.message.includes("404")) return null;
      throw err;
    }
    const parsed = BaicizhanWordSchema.safeParse(raw);
    if (!parsed.success) return null; // malformed entry: skip safely
    const w = parsed.data;

    return {
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
  }

  async healthCheck(): Promise<PluginHealth> {
    try {
      await this.getWordList();
      return { status: "healthy", checkedAt: new Date().toISOString() };
    } catch {
      return { status: "unavailable", message: "Could not reach the Baicizhan community API.", checkedAt: new Date().toISOString() };
    }
  }
}

function parsePos(meanCn: string | null | undefined): string | null {
  if (!meanCn) return null;
  const match = meanCn.match(/^([a-z]+)\./i);
  return match ? match[1].toLowerCase() : null;
}
