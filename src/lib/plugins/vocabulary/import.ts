// Domain helper: convert a canonical provider entry into a personal FSRS card.
// React components should not duplicate this logic.

import {
  createVocabCard,
  listVocabCards,
  updateVocabCard,
} from "@/lib/storage/repository";
import type { VocabularyCard } from "@/lib/storage/types";
import type { CanonicalVocabularyEntry } from "./types";

export interface ImportResult {
  cardId: string;
  created: boolean;
  mergedProvenance: boolean;
}

// Deduplicate by normalized word; never reset FSRS state or user notes.
export async function addProviderEntryToPersonalVocabulary(
  entry: CanonicalVocabularyEntry,
): Promise<ImportResult> {
  const norm = entry.word.trim().toLowerCase();
  const existing = (await listVocabCards()).find((c) => c.word.trim().toLowerCase() === norm);

  if (existing) {
    let merged = false;
    // Merge provenance only if the existing card lacks structured source.
    if (!existing.source && entry.source.providerId) {
      await updateVocabCard(existing.id, {
        source: {
          providerId: entry.source.providerId,
          providerName: entry.source.providerName,
          externalId: entry.source.externalId,
          bookId: entry.source.bookId,
          sourceUrl: entry.source.sourceUrl,
          attribution: entry.source.attribution,
          license: entry.source.license,
          importedAt: new Date().toISOString(),
        },
      });
      merged = true;
    }
    return { cardId: existing.id, created: false, mergedProvenance: merged };
  }

  const id = await createVocabCard({
    word: entry.word,
    lemma: entry.lemma ?? undefined,
    partOfSpeech: entry.partOfSpeech ?? undefined,
    chineseMeaning: entry.meaningZh ?? undefined,
    englishDefinition: entry.definitionEn ?? undefined,
    ipa: entry.ipa ?? undefined,
    example: entry.examples[0],
    collocations: entry.collocations,
    synonyms: entry.synonyms,
    antonyms: entry.antonyms,
    wordFamily: entry.wordFamily,
    sourceContext: `${entry.source.providerName} · ${entry.word}`,
    sourceSkill: "vocabulary",
    tags: [...entry.tags, "provider"],
    source: {
      providerId: entry.source.providerId,
      providerName: entry.source.providerName,
      externalId: entry.source.externalId,
      bookId: entry.source.bookId,
      sourceUrl: entry.source.sourceUrl,
      attribution: entry.source.attribution,
      license: entry.source.license,
      importedAt: new Date().toISOString(),
    },
  });

  return { cardId: id, created: true, mergedProvenance: false };
}

export function normalizeWordForDedupe(word: string): string {
  return word.trim().toLowerCase();
}

export type { VocabularyCard };
