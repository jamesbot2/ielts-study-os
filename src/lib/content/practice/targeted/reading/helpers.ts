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
    // AI-assisted generation — honest authorship metadata.
    generatedByAI: true,
    // Marked published after the V0.6.4 manual Reading QA pass (answer keys
    // verified against passages, TFNG/YNNG semantics reviewed, word limits
    // checked, structure validated by getPracticeSetIssues).
    reviewStatus: "published",
  };
}

export function originalPassage(id: string, title: string, body: string) {
  return { id, title, body, sourceType: "ORIGINAL" as const, license: "CC0 (original content)" };
}

export interface TextQOptions {
  wordLimit?: number;
  allowNumber?: boolean;
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
    allowNumber: options.allowNumber,
    passageId,
    explanation,
    evidence: options.evidence,
    skillTags: ["reading"],
    difficulty: options.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}

export function choiceQuestion(
  type: QuestionType,
  id: string,
  prompt: string,
  options: { id: string; text: string }[],
  correctAnswers: string[],
  explanation: string,
  passageId: string,
  options2: { evidence?: string; difficulty?: 1 | 2 | 3 | 4 | 5; selectCount?: number } = {},
) {
  return {
    id,
    type,
    answerType: (options2.selectCount ? "multiple_choice" : "single_choice") as "single_choice" | "multiple_choice",
    prompt,
    options: options.map((o) => ({ ...o, label: o.id })),
    correctAnswers,
    selectCount: options2.selectCount,
    passageId,
    explanation,
    evidence: options2.evidence,
    skillTags: ["reading"],
    difficulty: options2.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}

export function matchingQuestion(
  type: QuestionType,
  answerType: "matching" | "heading_matching",
  id: string,
  prompt: string,
  options: { id: string; text: string }[],
  items: { id: string; text: string; correctOptionId: string }[],
  explanation: string,
  passageId: string,
  difficulty: 1 | 2 | 3 | 4 | 5 = 3,
) {
  return {
    id,
    type,
    answerType,
    prompt,
    options: options.map((o) => ({ ...o, label: o.id })),
    items,
    passageId,
    explanation,
    skillTags: ["reading"],
    difficulty,
    bandRange: { min: 5, max: 7.5 },
  };
}
