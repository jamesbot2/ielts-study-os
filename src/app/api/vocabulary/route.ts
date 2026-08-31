import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createVocabCard,
  getDueVocabCards,
  getVocabCard,
  listVocabCards,
  recordVocabReview,
  updateVocabCard,
} from "@/lib/db/store";
import { emptyCard, parseCard, scheduleReview, type ReviewRating } from "@/lib/srs/fsrs";

const CardInput = z.object({
  word: z.string().min(1),
  lemma: z.string().optional(),
  partOfSpeech: z.string().optional(),
  chineseMeaning: z.string().optional(),
  englishDefinition: z.string().optional(),
  ipa: z.string().optional(),
  example: z.string().optional(),
  ieltsExample: z.string().optional(),
  collocations: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
  wordFamily: z.array(z.string()).optional(),
  commonMistakes: z.string().optional(),
  sourceContext: z.string().optional(),
  personalNote: z.string().optional(),
  sourceSkill: z.string().optional(),
});

export async function GET() {
  const cards = listVocabCards().map((c) => ({
    ...c,
    collocations: safeParse(c.collocations),
    synonyms: safeParse(c.synonyms),
    antonyms: safeParse(c.antonyms),
    wordFamily: safeParse(c.word_family),
  }));
  return NextResponse.json({ cards, dueCount: getDueVocabCards().length });
}

export async function POST(req: NextRequest) {
  const input = CardInput.parse(await req.json());
  const card = createVocabCard(input, emptyCard(), new Date().toISOString());
  return NextResponse.json({ id: card.id }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as { id: string; patch: z.infer<typeof CardInput> };
  updateVocabCard(body.id, body.patch);
  return NextResponse.json({ ok: true });
}

function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
