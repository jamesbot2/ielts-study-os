import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkQuestion,
  listeningBand,
  readingBand,
} from "@/lib/scoring/scoring";
import { getPracticeSet } from "@/lib/content/practice";
import {
  completePracticeAttempt,
  createPracticeAttempt,
  recordMistake,
} from "@/lib/db/store";
import type { Question } from "@/types/ielts";

const SubmitSchema = z.object({
  setId: z.string(),
  mode: z.enum(["practice", "exam"]),
  answers: z.record(z.string(), z.unknown()),
  timeSpentSeconds: z.number().int().min(0),
  questionTimes: z.record(z.string(), z.number().int().min(0)).optional(),
  flags: z.record(z.string(), z.boolean()).optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof SubmitSchema>;
  try {
    body = SubmitSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request", detail: String(err) }, { status: 400 });
  }

  const set = getPracticeSet(body.setId);
  if (!set) {
    return NextResponse.json({ error: "Practice set not found" }, { status: 404 });
  }

  // Persist attempt start
  const attempt = createPracticeAttempt(
    set.meta.id,
    set.kind,
    set.meta.testType === "both" ? "academic" : set.meta.testType,
    body.mode,
    body.answers,
  );

  const results = set.questions.map((q: Question) => {
    const userAnswer = body.answers[q.id];
    const correct = checkQuestion(q, userAnswer);
    return {
      questionId: q.id,
      correct,
      userAnswer,
      correctAnswer: summarizeCorrect(q),
      timeSpentSeconds: body.questionTimes?.[q.id] ?? 0,
      flagged: body.flags?.[q.id] ?? false,
    };
  });

  const rawScore = results.filter((r) => r.correct).length;
  const total = set.questions.length;
  const testType = set.meta.testType === "both" ? "academic" : set.meta.testType;
  const band = set.kind === "listening" ? listeningBand(rawScore) : readingBand(rawScore, testType);

  completePracticeAttempt(
    attempt.id,
    rawScore,
    band,
    body.answers,
    results.map((r) => ({
      questionId: r.questionId,
      userAnswer: r.userAnswer,
      correct: r.correct,
      timeSpentSeconds: r.timeSpentSeconds,
      flagged: r.flagged,
    })),
    body.timeSpentSeconds,
  );

  // Record mistakes
  for (const r of results) {
    if (!r.correct) {
      const q = set.questions.find((x) => x.id === r.questionId)!;
      recordMistake({
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

  return NextResponse.json({
    attemptId: attempt.id,
    rawScore,
    total,
    band,
    results,
  });
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
