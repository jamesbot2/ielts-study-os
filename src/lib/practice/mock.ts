// Client-side mock exam completion: deterministic section scoring.

import type { PracticeSet } from "@/types/ielts";
import { checkQuestion, listeningBand, readingBand } from "@/lib/scoring/scoring";
import {
  completeMockAttempt,
  createMockAttempt,
  updateMockState,
} from "@/lib/storage/repository";
import type { AnswerValue } from "@/lib/storage/types";

export interface MockSectionResult {
  rawScore?: number;
  total?: number;
  band?: number;
}

export interface MockCompleteInput {
  listening?: { answers: Record<string, AnswerValue>; timeSpentSeconds?: number };
  reading?: { answers: Record<string, AnswerValue>; timeSpentSeconds?: number };
  writing?: { band?: number };
}
export async function startMock(kind: string, testType: "academic" | "general"): Promise<string> {
  return createMockAttempt(kind, testType);
}

export async function saveMockState(id: string, state: Record<string, unknown>): Promise<void> {
  await updateMockState(id, state);
}

export async function finishMock(
  attemptId: string,
  testType: "academic" | "general",
  listeningSet: PracticeSet | null,
  readingSet: PracticeSet | null,
  input: MockCompleteInput,
): Promise<{ gradedAverage: number; sections: Record<string, MockSectionResult> }> {
  const sections: Record<string, MockSectionResult> = {};

  if (input.listening && listeningSet) {
    const r = scoreSet(listeningSet, input.listening.answers);
    sections.listening = { rawScore: r.raw, total: r.total, band: listeningBand(r.raw) };
  }

  if (input.reading && readingSet) {
    const r = scoreSet(readingSet, input.reading.answers);
    sections.reading = { rawScore: r.raw, total: r.total, band: readingBand(r.raw, testType) };
  }

  if (input.writing && typeof input.writing.band === "number") {
    sections.writing = { band: input.writing.band };
  }

  // Objective (Listening/Reading) graded average. This is NOT an official
  // Overall IELTS Band (which requires Writing + Speaking too).
  const objectiveBands = [sections.listening?.band, sections.reading?.band]
    .filter((b): b is number => typeof b === "number" && b >= 0);
  const gradedAverage = objectiveBands.length
    ? Math.round((objectiveBands.reduce((a, b) => a + b, 0) / objectiveBands.length) * 2) / 2
    : 0;

  await completeMockAttempt(attemptId, gradedAverage);
  return { gradedAverage, sections };
}

function scoreSet(set: PracticeSet, answers: Record<string, AnswerValue>) {
  let raw = 0;
  for (const q of set.questions) {
    if (checkQuestion(q, answers[q.id])) raw += 1;
  }
  return { raw, total: set.questions.length };
}
