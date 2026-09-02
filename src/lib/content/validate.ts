// Aggregate content validation: practice sets + duplicate detection.
// Per-set structural rules live in practice-validation.ts (one canonical copy).

import { allPracticeSets } from "./practice";
import { writingPrompts } from "./practice/writing-prompts";
import { speakingTopics } from "./practice/speaking-topics";
import { grammarExercises } from "./practice/grammar-exercises";
import { getPracticeSetIssues } from "./practice-validation";
import { READING_QUESTION_TYPES, LISTENING_QUESTION_TYPES } from "./question-types";

export { getPracticeSetIssues, isStructurallyValidTargetedSet, isPublishedTargetedSet } from "./practice-validation";
export type { ValidationIssue } from "./practice-validation";

export interface ValidationReport {
  issues: import("./practice-validation").ValidationIssue[];
  valid: boolean;
}

export function validateSets(sets: import("@/types/ielts").PracticeSet[]): ValidationReport {
  const issues = [];
  const seenQuestionIds = new Set<string>();
  const seenSetIds = new Set<string>();

  for (const set of sets) {
    if (seenSetIds.has(set.meta.id)) {
      issues.push({ setId: set.meta.id, message: `duplicate practice set id "${set.meta.id}"` });
    }
    seenSetIds.add(set.meta.id);
    issues.push(...getPracticeSetIssues(set, seenQuestionIds));
  }

  return { issues, valid: issues.length === 0 };
}

export function validateAllContent(): ValidationReport {
  return validateSets(allPracticeSets);
}

export function questionTypeCoverage(): { missingReading: string[]; missingListening: string[] } {
  const present = new Set(allPracticeSets.flatMap((s) => s.questions.map((q) => q.type)));
  return {
    missingReading: READING_QUESTION_TYPES.filter((t) => !present.has(t)),
    missingListening: LISTENING_QUESTION_TYPES.filter((t) => !present.has(t)),
  };
}

// ---- Duplicate detection (normalized token overlap, no embeddings) ----

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenOverlap(a: string, b: string): number {
  const ta = new Set(normalizeText(a).split(" ").filter(Boolean));
  const tb = new Set(normalizeText(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common += 1;
  return common / Math.min(ta.size, tb.size);
}

export interface DuplicatePair {
  kind: string;
  idA: string;
  idB: string;
  similarity: number;
}

export function detectDuplicates(threshold = 0.85): DuplicatePair[] {
  const out: DuplicatePair[] = [];

  for (let i = 0; i < writingPrompts.length; i++) {
    for (let j = i + 1; j < writingPrompts.length; j++) {
      const s = tokenOverlap(writingPrompts[i].prompt, writingPrompts[j].prompt);
      if (s >= threshold) out.push({ kind: "writing", idA: writingPrompts[i].id, idB: writingPrompts[j].id, similarity: s });
    }
  }

  const cues: [string, string][] = speakingTopics.flatMap((t) => t.part2CueCards.map((c) => [c.id, c.prompt] as [string, string]));
  for (let i = 0; i < cues.length; i++) {
    for (let j = i + 1; j < cues.length; j++) {
      const s = tokenOverlap(cues[i][1], cues[j][1]);
      if (s >= threshold) out.push({ kind: "speaking", idA: cues[i][0], idB: cues[j][0], similarity: s });
    }
  }

  const ex = grammarExercises.map((e) => [e.id, e.sentence] as [string, string]);
  for (let i = 0; i < ex.length; i++) {
    for (let j = i + 1; j < ex.length; j++) {
      const s = tokenOverlap(ex[i][1], ex[j][1]);
      if (s >= threshold) out.push({ kind: "grammar", idA: ex[i][0], idB: ex[j][0], similarity: s });
    }
  }

  return out;
}
