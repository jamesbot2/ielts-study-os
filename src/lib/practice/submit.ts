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
  // null for targeted drills: a 6–15 question drill is NOT equivalent to a
  // complete 40-question IELTS Reading/Listening test.
  band: number | null;
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
  // Full 40-question tests map to the normal IELTS-style band table.
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
