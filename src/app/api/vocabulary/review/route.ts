import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVocabCard, recordVocabReview } from "@/lib/db/store";
import { parseCard, scheduleReview, type ReviewRating } from "@/lib/srs/fsrs";

const ReviewInput = z.object({
  id: z.string(),
  rating: z.enum(["again", "hard", "good", "easy"]),
});

export async function POST(req: NextRequest) {
  const { id, rating } = ReviewInput.parse(await req.json());
  const card = getVocabCard(id);
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const result = scheduleReview(parseCard(card.fsrs_state), rating as ReviewRating);
  recordVocabReview(id, rating, result.card, result.due.toISOString());

  return NextResponse.json({
    ok: true,
    due: result.due.toISOString(),
    stability: Math.round(result.card.stability * 10) / 10,
    difficulty: Math.round(result.card.difficulty * 10) / 10,
    reps: result.card.reps,
  });
}
