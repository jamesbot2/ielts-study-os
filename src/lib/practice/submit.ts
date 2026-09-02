// Client-side practice submission: deterministic scoring + persistence.
// Replaces the old server route /api/practice/submit.

import type { PracticeSet, Question } from "@/types/ielts";
import { checkQuestion, listeningBand, readingBand } from "@/lib/scoring/scoring";
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
  band: number;
  results: {
    questionId: string;
    correct: boolean;
    userAnswer: AnswerValue;
    correctAnswer: string;
    timeSpentSeconds: number;
    flagged: boolean;
  }[];
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

  const results = set.questions.map((q: Question) => {
    const userAnswer = answers[q.id];
    const correct = checkQuestion(q, userAnswer);
    return {
      questionId: q.id,
      correct,
      userAnswer,
      correctAnswer: summarizeCorrect(q),
      timeSpentSeconds: questionTimes[q.id] ?? 0,
      flagged: flags[q.id] ?? false,
    };
  });

  const rawScore = results.filter((r) => r.correct).length;
  const total = set.questions.length;
  // Targeted drills have fewer than 40 questions; scale to the 40-question band
  // table so the estimated band remains meaningful (raw is still shown).
  const scaledRaw = total > 0 ? Math.round((rawScore / total) * 40) : 0;
  const band = set.kind === "listening" ? listeningBand(scaledRaw) : readingBand(scaledRaw, effectiveTestType);

  await completePracticeAttempt(
    attemptId,
    rawScore,
    band,
    answers,
    results.map((r) => ({
      questionId: r.questionId,
      userAnswer: r.userAnswer,
      correct: r.correct ? 1 : 0,
      timeSpentSeconds: r.timeSpentSeconds,
      flagged: r.flagged ? 1 : 0,
    })),
    timeSpentSeconds,
  );

  for (const r of results) {
    if (!r.correct) {
      const q = set.questions.find((x) => x.id === r.questionId);
      if (q) {
        await recordMistake({
          source: set.kind,
          skill: set.kind,
          question: q.prompt.slice(0, 300),
          userAnswer: stringifyAnswer(r.userAnswer),
          correctAnswer: r.correctAnswer,
          mistakeType: q.type,
          explanation: q.explanation,
          questionType: q.type,
        });
      }
    }
  }

  return { attemptId, rawScore, total, band, results };
}

function stringifyAnswer(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function summarizeCorrect(q: Question): string {
  if (q.answerType === "text" || q.answerType === "number") {
    return (q as Extract<Question, { answerType: "text" | "number" }>).correctAnswer;
  }
  if (q.answerType === "single_choice" || q.answerType === "multiple_choice") {
    return (q as Extract<Question, { answerType: "single_choice" | "multiple_choice" }>).correctAnswers.join(", ");
  }
  return (q as Extract<Question, { answerType: "matching" | "heading_matching" }>).items
    .map((i) => `${i.id}:${i.correctOptionId}`)
    .join(", ");
}
