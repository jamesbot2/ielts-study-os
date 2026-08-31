import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  completeMockAttempt,
  getMockAttempt,
  updateMockState,
} from "@/lib/db/store";
import {
  checkQuestion,
  listeningBand,
  readingBand,
  overallBandFromSections,
} from "@/lib/scoring/scoring";
import {
  academicReadingSet,
  generalReadingSet,
} from "@/lib/content/practice";
import { listeningSet } from "@/lib/content/practice/listening-sets";
import type { PracticeSet } from "@/types/ielts";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const attempt = getMockAttempt(id);
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ attempt });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as { state?: Record<string, unknown> };
  if (body.state) updateMockState(id, body.state);
  return NextResponse.json({ ok: true });
}

const CompleteSchema = z.object({
  sections: z.record(
    z.string(),
    z.object({
      answers: z.record(z.string(), z.unknown()),
      timeSpentSeconds: z.number().int().min(0).optional(),
    }),
  ),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const attempt = getMockAttempt(id);
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = CompleteSchema.parse(await req.json());
  const testType = attempt.test_type as "academic" | "general";

  const sectionResults: Record<
    string,
    { rawScore: number; total: number; band: number }
  > = {};

  const listening = body.sections["listening"];
  if (listening) {
    const r = scoreSet(listeningSet, listening.answers);
    sectionResults["listening"] = {
      rawScore: r.raw,
      total: r.total,
      band: listeningBand(r.raw),
    };
  }

  const reading = body.sections["reading"];
  if (reading) {
    const set = testType === "general" ? generalReadingSet : academicReadingSet;
    const r = scoreSet(set, reading.answers);
    sectionResults["reading"] = {
      rawScore: r.raw,
      total: r.total,
      band: readingBand(r.raw, testType),
    };
  }

  // Writing scores are only produced when AI evaluation is configured and run
  // through the writing module; here we accept an optional already-computed band.
  const writing = body.sections["writing"] as
    | { band?: number; answers?: Record<string, unknown>; timeSpentSeconds?: number }
    | undefined;
  if (writing && typeof writing.band === "number") {
    sectionResults["writing"] = {
      rawScore: 0,
      total: 0,
      band: writing.band,
    };
  }

  const sections = [
    sectionResults["listening"]?.band,
    sectionResults["reading"]?.band,
    sectionResults["writing"]?.band,
  ].filter((b): b is number => typeof b === "number" && b >= 0);

  const overall = overallBandFromSections(sections);
  completeMockAttempt(id, overall);

  return NextResponse.json({
    attemptId: id,
    overallBand: overall,
    sections: sectionResults,
  });
}

function scoreSet(set: PracticeSet, answers: Record<string, unknown>) {
  let raw = 0;
  for (const q of set.questions) {
    if (checkQuestion(q, answers[q.id])) raw += 1;
  }
  return { raw, total: set.questions.length };
}
