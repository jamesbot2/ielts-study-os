// Vocabulary provider interface + canonical external vocabulary schema.

import type { PluginHealth, PluginSource } from "../types";

export interface VocabularySourceMetadata {
  providerId: string;
  providerName: string;
  externalId?: string;
  bookId?: string;
  sourceUrl?: string;
  license?: string;
  attribution?: string;
  importedAt?: string;
  rawSourceType: "builtin" | "provider" | "user_imported";
}

export interface CanonicalVocabularyEntry {
  id: string; // `${providerId}:${externalId or word}`
  word: string;
  lemma?: string | null;
  partOfSpeech?: string | null;
  ipa?: string | null;
  meaningZh?: string | null;
  definitionEn?: string | null;
  examples: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
  topics: string[];
  skills: Array<"listening" | "reading" | "writing" | "speaking">;
  tags: string[];
  source: VocabularySourceMetadata;
}

export interface VocabularyBook {
  id: string; // `${providerId}:${externalId}`
  providerId: string;
  externalId: string;
  title: string;
  description?: string;
  language: string;
  wordCount?: number;
  testType?: "academic" | "general" | "both";
  tags: string[];
  source: PluginSource;
}

export interface VocabularyPageOptions {
  offset?: number;
  limit?: number;
  query?: string;
}

export interface VocabularyPage {
  entries: CanonicalVocabularyEntry[];
  total: number;
  offset: number;
  limit: number;
}

export interface VocabularyProvider {
  id: string;
  kind: "vocabulary";
  name: string;
  description: string;
  version: string;
  source: PluginSource;
  capabilities: Array<"VOCABULARY_BOOKS" | "VOCABULARY_LOOKUP" | "VOCABULARY_SYNC">;
  listBooks(): Promise<VocabularyBook[]>;
  getBook(bookId: string): Promise<VocabularyBook | null>;
  listEntries(bookId: string, options?: VocabularyPageOptions): Promise<VocabularyPage>;
  getEntry(externalId: string): Promise<CanonicalVocabularyEntry | null>;
  healthCheck(): Promise<PluginHealth>;
}
