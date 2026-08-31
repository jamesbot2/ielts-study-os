// Analytics computed from real persisted IndexedDB activity.
// No fake/demo data.

import {
  getProfile,
  listPracticeAttempts,
  getQuestionAttempts,
  listMistakes,
  listMockAttempts,
  listVocabCards,
  getDueVocabCards,
} from "@/lib/storage/repository";

export interface AnalyticsSummary {
  totalPractice: number;
  totalMistakes: number;
  totalMocks: number;
  vocabTotal: number;
  vocabDue: number;
  bySkill: Record<string, { attempts: number; accuracy: number; avgBand: number }>;
}

export interface AnalyticsData {
  profile: { targetBand: number | null; currentBand: number | null; testType: string };
  summary: AnalyticsSummary;
  recentAttempts: { id: string; skill: string; band: number | null; rawScore: number | null; startedAt: string }[];
  mocks: { id: string; kind: string; overallBand: number | null; status: string; startedAt: string }[];
  mistakesBySkill: Record<string, number>;
  mistakesByType: Record<string, number>;
}

export async function computeAnalytics(): Promise<AnalyticsData> {
  const profile = await getProfile();
  const attempts = await listPracticeAttempts(500);
  const completed = attempts.filter((a) => a.completedAt);
  const mistakes = await listMistakes();
  const mocks = await listMockAttempts();
  const cards = await listVocabCards();
  const due = await getDueVocabCards();

  const bySkill: Record<string, { attempts: number; accuracy: number; avgBand: number }> = {};
  for (const a of completed) {
    const qas = await getQuestionAttempts(a.id);
    const acc = qas.length ? qas.filter((q) => q.correct === 1).length / qas.length : 0;
    const entry = bySkill[a.skill] ?? { attempts: 0, accuracy: 0, avgBand: 0 };
    entry.attempts += 1;
    entry.accuracy = (entry.accuracy * (entry.attempts - 1) + acc) / entry.attempts;
    entry.avgBand = (entry.avgBand * (entry.attempts - 1) + (a.band ?? 0)) / entry.attempts;
    bySkill[a.skill] = entry;
  }

  return {
    profile: { targetBand: profile.targetBand, currentBand: profile.currentBand, testType: profile.testType },
    summary: {
      totalPractice: completed.length,
      totalMistakes: mistakes.length,
      totalMocks: mocks.length,
      vocabTotal: cards.length,
      vocabDue: due.length,
      bySkill,
    },
    recentAttempts: completed.slice(0, 20).map((a) => ({
      id: a.id,
      skill: a.skill,
      band: a.band,
      rawScore: a.rawScore,
      startedAt: a.startedAt,
    })),
    mocks: mocks.slice(0, 20).map((m) => ({
      id: m.id,
      kind: m.kind,
      overallBand: m.overallBand,
      status: m.status,
      startedAt: m.startedAt,
    })),
    mistakesBySkill: countBy(mistakes, "skill"),
    mistakesByType: countBy(mistakes, "questionType"),
  };
}

function countBy(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = ((r as Record<string, unknown>)[key] as string) ?? "unknown";
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}
