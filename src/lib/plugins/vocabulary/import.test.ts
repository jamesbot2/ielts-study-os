import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/storage/db";
import { createVocabCard, listVocabCards } from "@/lib/storage/repository";
import { addProviderEntryToPersonalVocabulary } from "./import";
import type { CanonicalVocabularyEntry } from "./types";

function entry(overrides: Partial<CanonicalVocabularyEntry> = {}): CanonicalVocabularyEntry {
  return {
    id: "baicizhan:average",
    word: "average",
    meaningZh: "n.平均数",
    definitionEn: "the result of adding amounts and dividing",
    ipa: "/ˈævərɪdʒ/",
    examples: ["His height equals the average."],
    collocations: ["the average of"],
    synonyms: [],
    antonyms: [],
    wordFamily: [],
    topics: [],
    skills: [],
    tags: ["external"],
    source: { providerId: "baicizhan", providerName: "Baicizhan", externalId: "average", rawSourceType: "provider" },
    ...overrides,
  };
}

beforeEach(async () => {
  await resetDb();
});

describe("provider entry import", () => {
  it("creates a card with structured provenance", async () => {
    const res = await addProviderEntryToPersonalVocabulary(entry());
    expect(res.created).toBe(true);
    const cards = await listVocabCards();
    expect(cards.length).toBe(1);
    expect(cards[0].source?.providerId).toBe("baicizhan");
    expect(cards[0].chineseMeaning).toBe("n.平均数");
    expect(cards[0].ipa).toBe("/ˈævərɪdʒ/");
  });

  it("deduplicates without resetting FSRS state", async () => {
    await createVocabCard({ word: "average", chineseMeaning: "my note", personalNote: "keep me" });
    const first = await listVocabCards();
    const res = await addProviderEntryToPersonalVocabulary(entry());
    expect(res.created).toBe(false);
    const cards = await listVocabCards();
    expect(cards.length).toBe(1);
    expect(cards[0].personalNote).toBe("keep me");
    expect(cards[0].fsrs).toBeTruthy(); // existing FSRS preserved
    expect(cards[0].chineseMeaning).toBe("my note"); // user-edited definition preserved
    // provenance merged in
    expect(cards[0].source?.providerId).toBe("baicizhan");
    expect(first[0].id).toBe(cards[0].id);
  });

  it("preserves an opaque externalId distinct from the display word", async () => {
    const e = entry({
      id: "provider:opaque-123",
      word: "environment",
      source: { providerId: "provider", providerName: "Provider", externalId: "opaque-123", rawSourceType: "provider" },
    });
    await addProviderEntryToPersonalVocabulary(e);
    const cards = await listVocabCards();
    expect(cards[0].word).toBe("environment");
    expect(cards[0].source?.externalId).toBe("opaque-123");
  });

  it("preserves selected book provenance (bookId override)", async () => {
    const e = entry({
      source: { providerId: "provider", providerName: "Provider", externalId: "word", rawSourceType: "provider" },
    });
    await addProviderEntryToPersonalVocabulary(e, { bookId: "book-7" });
    const cards = await listVocabCards();
    expect(cards[0].source?.bookId).toBe("book-7");
    expect(cards[0].source?.providerId).toBe("provider");
  });
});
