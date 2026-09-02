// Helpers for building original targeted Listening drills.

import type { ContentMeta, QuestionType, TestType, PracticeSet } from "@/types/ielts";

export const TARGETED_AUDIO_ROOT = "/audio/targeted";

export function listeningTargetedMeta(
  id: string,
  title: string,
  testType: TestType | "both",
  questionType: QuestionType,
  difficulty: 1 | 2 | 3 | 4 | 5 = 3,
): ContentMeta {
  return {
    id,
    title,
    skill: "listening",
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
    generatedByAI: true,
    reviewStatus: "published",
  };
}

export interface ScriptLine {
  speaker: string;
  voice?: string;
  text: string;
}

export function listeningAudio(
  setId: string,
  title: string,
  lines: ScriptLine[],
): PracticeSet["audio"] {
  const script = [{ part: 1, lines }];
  const transcript = lines.map((l) => `${l.speaker}: ${l.text}`).join("\n");
  return {
    id: `${setId}-audio`,
    title,
    parts: [{ part: 1, title, src: `${TARGETED_AUDIO_ROOT}/${setId}/part1.mp3` }],
    transcript,
    script,
  };
}

export function textQ(
  type: QuestionType,
  id: string,
  prompt: string,
  correctAnswer: string,
  explanation: string,
  options: { wordLimit?: number; allowNumber?: boolean; evidence?: string; acceptableAnswers?: string[]; difficulty?: 1 | 2 | 3 | 4 | 5; tableCellId?: string; flowNodeId?: string } = {},
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
    tableCellId: options.tableCellId,
    flowNodeId: options.flowNodeId,
    explanation,
    evidence: options.evidence,
    skillTags: ["listening"],
    difficulty: options.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}

export function choiceQ(
  type: QuestionType,
  answerType: "single_choice" | "multiple_choice",
  id: string,
  prompt: string,
  options: { id: string; text: string }[],
  correctAnswers: string[],
  explanation: string,
  options2: { selectCount?: number; evidence?: string; difficulty?: 1 | 2 | 3 | 4 | 5 } = {},
) {
  return {
    id,
    type,
    answerType,
    prompt,
    options: options.map((o) => ({ ...o, label: o.id })),
    correctAnswers,
    selectCount: options2.selectCount,
    explanation,
    evidence: options2.evidence,
    skillTags: ["listening"],
    difficulty: options2.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}

export function matchingQ(
  type: QuestionType,
  id: string,
  prompt: string,
  options: { id: string; text: string }[],
  items: { id: string; text: string; correctOptionId: string }[],
  explanation: string,
  difficulty: 1 | 2 | 3 | 4 | 5 = 3,
) {
  return {
    id,
    type,
    answerType: "matching" as const,
    prompt,
    options: options.map((o) => ({ ...o, label: o.id })),
    items,
    explanation,
    skillTags: ["listening"],
    difficulty,
    bandRange: { min: 5, max: 7.5 },
  };
}

// Spatial labelling question: prompt carries only the blank-marker letter —
// the audio provides the answer. Never leaks the answer text.
export function markerQ(
  type: QuestionType,
  id: string,
  markerId: string,
  markerLabel: string,
  correctAnswer: string,
  explanation: string,
  options: { acceptableAnswers?: string[]; difficulty?: 1 | 2 | 3 | 4 | 5; evidence?: string; wordLimit?: number } = {},
) {
  return {
    id,
    type,
    answerType: "text" as const,
    prompt: `Label the place marked ${markerLabel} on the ${type === "plan_labelling" ? "plan" : type === "map_labelling" ? "map" : "diagram"}.`,
    markerId,
    correctAnswer,
    acceptableAnswers: options.acceptableAnswers,
    wordLimit: options.wordLimit ?? 2,
    explanation,
    evidence: options.evidence,
    skillTags: ["listening"],
    difficulty: options.difficulty ?? 3,
    bandRange: { min: 5, max: 7.5 },
  };
}
