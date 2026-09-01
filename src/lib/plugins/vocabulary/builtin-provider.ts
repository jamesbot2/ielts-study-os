// Built-in vocabulary provider: exposes the bundled IELTS Study OS vocabulary
// library through the same VocabularyProvider contract as external providers.

import { vocabTopics } from "@/lib/content/vocabulary";
import type {
  CanonicalVocabularyEntry,
  VocabularyBook,
  VocabularyPage,
  VocabularyPageOptions,
  VocabularyProvider,
} from "./types";
import type { PluginHealth } from "../types";

const PROVIDER_ID = "ielts-study-os-builtin";

function buildEntries(): CanonicalVocabularyEntry[] {
  const entries: CanonicalVocabularyEntry[] = [];
  for (const topic of vocabTopics) {
    for (const w of topic.words) {
      entries.push({
        id: `${PROVIDER_ID}:${w.word.toLowerCase()}`,
        word: w.word,
        partOfSpeech: w.pos,
        meaningZh: w.meaningZh,
        definitionEn: w.definitionEn,
        examples: w.example ? [w.example] : [],
        collocations: w.collocations,
        synonyms: [],
        antonyms: [],
        wordFamily: [],
        topics: [topic.nameEn],
        skills: w.writingRelevance || w.speakingRelevance ? (["reading", "writing", "speaking", "listening"] as const) : ["reading"],
        tags: [w.band],
        source: {
          providerId: PROVIDER_ID,
          providerName: "IELTS Study OS",
          rawSourceType: "builtin",
        },
      });
    }
  }
  return entries;
}

export const builtinVocabularyProvider: VocabularyProvider = {
  id: PROVIDER_ID,
  kind: "vocabulary",
  name: "IELTS Study OS Core",
  description: "Bundled original IELTS vocabulary, organised by topic.",
  version: "1.0.0",
  source: { provider: "IELTS Study OS", license: "CC0 (original content)" },
  capabilities: ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"],

  async listBooks(): Promise<VocabularyBook[]> {
    return vocabTopics.map((t) => ({
      id: `${PROVIDER_ID}:${t.id}`,
      providerId: PROVIDER_ID,
      externalId: t.id,
      title: t.nameEn,
      description: t.nameZh,
      language: "en",
      wordCount: t.words.length,
      testType: "both",
      tags: [],
      source: { provider: "IELTS Study OS", license: "CC0" },
    }));
  },

  async getBook(bookId: string): Promise<VocabularyBook | null> {
    const books = await this.listBooks();
    return books.find((b) => b.id === bookId) ?? null;
  },

  async listEntries(bookId: string, options: VocabularyPageOptions = {}): Promise<VocabularyPage> {
    const topicId = bookId.split(":").pop() ?? "";
    const topic = vocabTopics.find((t) => t.id === topicId);
    if (!topic) return { entries: [], total: 0, offset: 0, limit: options.limit ?? 50 };

    const all = buildEntries().filter((e) => e.topics.includes(topic.nameEn));
    const query = options.query?.trim().toLowerCase();
    const filtered = query ? all.filter((e) => e.word.toLowerCase().includes(query)) : all;
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    return { entries: filtered.slice(offset, offset + limit), total: filtered.length, offset, limit };
  },

  async getEntry(externalId: string): Promise<CanonicalVocabularyEntry | null> {
    const normalized = externalId.toLowerCase();
    return buildEntries().find((e) => e.word.toLowerCase() === normalized || e.id.endsWith(`:${normalized}`)) ?? null;
  },

  async healthCheck(): Promise<PluginHealth> {
    return { status: "healthy", checkedAt: new Date().toISOString() };
  },
};

export { buildEntries as buildBuiltinEntries };
