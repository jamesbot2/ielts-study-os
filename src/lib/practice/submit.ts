// Client-side practice submission: deterministic scoring + persistence.
// Replaces the old server route /api/practice/submit.

import type { PracticeSet } from "@/types/ielts";
import { listeningBand, readingBand, scorePracticeUnits, type ScoredUnitResult } from "@/lib/scoring/scoring";
import {
  createPracticeAttempt,
  completePracticeAttempt,
  recordMistake,
} from "@/lib/storage/repository";
import type { AnswerValue } from "@/lib/storage/types";

export interface PracticeResult {
  attemptId: string;
  rawScore: number;
  total: number;
  // null for targeted drills: a 6–15 question drill is NOT equivalent to a
  // complete 40-question IELTS Reading/Listening test.
  band: number | null;
  // One entry per SCORED UNIT. Matching items use deterministic composite ids
  // `${question.id}::${item.id}`.
  results: ScoredUnitResult[];
}

export async function submitPractice(
  set: PracticeSet,
  mode: "practice" | "exam",
  answers: Record<string, AnswerValue>,
  timeSpentSeconds: number,
  flags: Record<string, boolean> = {},
  questionTimes: Record<string, number> = {},
  learnerTestType: "academic" | "general" = "academic",
): Promise<PracticeResult> {
  const effectiveTestType =
    set.meta.testType === "both" ? learnerTestType : set.meta.testType;
  const attemptId = await createPracticeAttempt(
    set.meta.id,
    set.kind,
    effectiveTestType,
    mode,
    answers,
  );

  // Canonical scored-unit model: matching items each count as one mark.
  const unitResults: ScoredUnitResult[] = scorePracticeUnits(set.questions, answers);

  const rawScore = unitResults.filter((u) => u.correct).length;
  const total = unitResults.length;
  // Full 40-scored-unit tests map to the normal IELTS-style band table.
  // Targeted drills do NOT receive a band: a short single-question-type drill
  // is not equivalent to a complete IELTS Reading/Listening test.
  const isTargeted = set.practiceMode === "targeted";
  const band: number | null = isTargeted
    ? null
    : set.kind === "listening"
      ? listeningBand(rawScore)
      : readingBand(rawScore, effectiveTestType);

  await completePracticeAttempt(
    attemptId,
    rawScore,
    band,
    answers,
    // Persist at scored-unit granularity: a 6/7 matching block becomes
    // 6 correct + 1 incorrect unit attempts (composite ids for items).
    unitResults.map((u) => ({
      questionId: u.id,
      userAnswer: u.userAnswer,
      correct: u.correct ? 1 : 0,
      timeSpentSeconds: questionTimes[u.parentQuestionId] ?? 0,
      flagged: flags[u.parentQuestionId] ? 1 : 0,
    })),
    timeSpentSeconds,
  );

  for (const u of unitResults) {
    if (!u.correct) {
      await recordMistake({
        source: set.kind,
        skill: set.kind,
        question: u.prompt.slice(0, 300),
        userAnswer: stringifyAnswer(u.userAnswer),
        correctAnswer: u.correctAnswer,
        mistakeType: u.questionType,
        explanation: u.explanation,
        questionType: u.questionType,
      });
    }
  }

  return { attemptId, rawScore, total, band, results: unitResults };
}

function stringifyAnswer(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
