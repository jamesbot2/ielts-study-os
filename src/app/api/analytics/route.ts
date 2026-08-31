import { NextResponse } from "next/server";
import {
  getDueVocabCards,
  listMistakes,
  listMockAttempts,
  listPracticeAttempts,
  listVocabCards,
  listWritingSubmissions,
  getWritingEvaluation,
} from "@/lib/db/store";
import { getProfile } from "@/lib/db/store";

export async function GET() {
  const profile = getProfile();
  const attempts = listPracticeAttempts(500);
  const completed = attempts.filter((a) => a.completed_at);
  const mistakes = listMistakes();
  const mocks = listMockAttempts();
  const cards = listVocabCards();
  const due = getDueVocabCards();
  const writing = listWritingSubmissions(100);

  const bySkill: Record<string, { attempts: number; accuracy: number; avgBand: number }> = {};
  for (const a of completed) {
    const e = bySkill[a.skill] ?? { attempts: 0, accuracy: 0, avgBand: 0 };
    e.attempts += 1;
    e.avgBand = (e.avgBand * (e.attempts - 1) + (a.band_score ?? 0)) / e.attempts;
    bySkill[a.skill] = e;
  }
  // accuracy requires per-question data; compute from raw score over 40 for objective skills
  for (const a of completed) {
    if (a.skill === "reading" || a.skill === "listening") {
      const e = bySkill[a.skill];
      if (e) {
        const acc = (a.raw_score ?? 0) / 40;
        e.accuracy = acc;
      }
    }
  }

  const writingEvaluations = writing
    .map((w) => ({ id: w.id, created: w.created_at, evaluation: getWritingEvaluation(w.id) }))
    .filter((w) => w.evaluation != null);

  return NextResponse.json({
    profile,
    summary: {
      totalPractice: completed.length,
      totalMistakes: mistakes.length,
      totalMocks: mocks.length,
      vocabTotal: cards.length,
      vocabDue: due.length,
      bySkill,
    },
    recentAttempts: completed.slice(0, 20),
    mocks: mocks.slice(0, 20),
    mistakesBySkill: countBy(mistakes, "skill"),
    mistakesByType: countBy(mistakes, "question_type"),
    writingSubmissions: writingEvaluations,
  });
}

function countBy(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = ((r as Record<string, unknown>)[key] as string) ?? "unknown";
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}
