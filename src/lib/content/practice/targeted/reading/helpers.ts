// Helpers for building original targeted Reading drills.

import type { ContentMeta, QuestionType, TestType } from "@/types/ielts";

export function targetedMeta(
  id: string,
  title: string,
  testType: TestType | "both",
  questionType: QuestionType,
  difficulty: 1 | 2 | 3 | 4 | 5 = 3,
): ContentMeta {
  return {
    id,
    title,
    skill: "reading",
    testType,
    sourceType: "ORIGINAL",
    sourceName: "IELTS Study OS",
    license: "CC0 (original content)",
    copyrightStatus: "Original content — no third-party material",
    academicOrGeneral: testType,
    questionTypes: [questionType],
    difficulty,
    estimatedBandRange: { min: 5, max: 7.5 },
    createdAt: "2026-09-01",
    generatedByAI: false,
    reviewStatus: "published",
  };
}

export function originalPassage(id: string, title: string, body: string) {
  return { id, title, body, sourceType: "ORIGINAL" as const, license: "CC0 (original content)" };
}

export interface TextQOptions {
  wordLimit?: number;
  evidence?: string;
  acceptableAnswers?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
}

export function textQuestion(
  type: QuestionType,
  id: string,
  prompt: string,
  correctAnswer: string,
  explanation: string,
  passageId: string,
  options: TextQOptions = {},
) {
  return {
    id,
    type,
    answerType: "text" as const,
    prompt,
    correctAnswer,
    acceptableAnswers: options.acceptableAnswers,
    wordLimit: options.wordLimit,
    passageId,
    explanation,
    evidence: options.evidence,
    skillTags: ["reading"],
    difficulty: options.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}
