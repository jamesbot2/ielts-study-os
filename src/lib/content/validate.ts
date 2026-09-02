// Structural content validators. Fail loudly when malformed content is added.

import type { PracticeSet, Question } from "@/types/ielts";
import { normalizeAnswer } from "@/lib/scoring/scoring";
import { allPracticeSets } from "./practice";
import { writingPrompts } from "./practice/writing-prompts";
import { speakingTopics } from "./practice/speaking-topics";
import { grammarExercises } from "./practice/grammar-exercises";
import { READING_QUESTION_TYPES, LISTENING_QUESTION_TYPES } from "./coverage";

function stripSurrounding(s: string): string {
  return s.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

export interface ValidationIssue {
  setId: string;
  questionId?: string;
  message: string;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  valid: boolean;
}

// ---- Pure per-set structural validation (unit-testable without global state) ----

export function getPracticeSetIssues(set: PracticeSet, seenQuestionIds: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const id = set.meta.id;

  if (!id) issues.push({ setId: "(unknown)", message: "set missing meta.id" });
  if (!set.meta.sourceType) issues.push({ setId: id, message: "set missing sourceType" });
  if (!set.meta.license) issues.push({ setId: id, message: "set missing license" });

  // Passage IDs unique within the set.
  const passageIds = new Set<string>();
  for (const p of set.passages) {
    if (passageIds.has(p.id)) issues.push({ setId: id, message: `duplicate passage id "${p.id}"` });
    passageIds.add(p.id);
  }

  const passageIdSet = new Set(set.passages.map((p) => p.id));

  for (const q of set.questions) {
    if (seenQuestionIds.has(q.id)) {
      issues.push({ setId: id, questionId: q.id, message: `duplicate question id "${q.id}"` });
    }
    seenQuestionIds.add(q.id);

    if (!q.explanation || q.explanation.trim().length === 0) {
      issues.push({ setId: id, questionId: q.id, message: "missing explanation" });
    }
    if (q.difficulty < 1 || q.difficulty > 5) {
      issues.push({ setId: id, questionId: q.id, message: "difficulty out of range" });
    }
    // Passage reference must exist in this set.
    if (q.passageId && !passageIdSet.has(q.passageId)) {
      issues.push({ setId: id, questionId: q.id, message: `passageId "${q.passageId}" not found in set` });
    }

    if (q.answerType === "text" || q.answerType === "number") {
      if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
        issues.push({ setId: id, questionId: q.id, message: "text question missing correctAnswer" });
      }
      const isJudgeType = q.type === "true_false_not_given" || q.type === "yes_no_not_given";
      if (q.wordLimit == null && !isJudgeType) {
        issues.push({ setId: id, questionId: q.id, message: "text question missing wordLimit metadata" });
      }
      if (set.kind === "reading" && !q.type.endsWith("not_given")) {
        const haystack = set.passages
          .map((p) => p.body)
          .join(" ")
          .toLowerCase()
          .replace(/(\d),(\d)/g, "$1$2");
        const variants = [q.correctAnswer, ...(q.acceptableAnswers ?? [])];
        const anyVariantGrounded = variants.some((v) => {
          const stripped = stripSurrounding(normalizeAnswer(v));
          return stripped.length > 0 && haystack.includes(stripped.toLowerCase());
        });
        if (!anyVariantGrounded) {
          issues.push({
            setId: id,
            questionId: q.id,
            message: `answer "${q.correctAnswer}" not grounded in passage (answer-consistency)`,
          });
        }
      }
    }

    if (q.answerType === "single_choice" || q.answerType === "multiple_choice") {
      if (!q.correctAnswers || q.correctAnswers.length === 0) {
        issues.push({ setId: id, questionId: q.id, message: "choice question missing correctAnswers" });
      } else {
        const optionIds = new Set(q.options.map((o) => o.id));
        if (optionIds.size !== q.options.length) {
          issues.push({ setId: id, questionId: q.id, message: "duplicate option ids" });
        }
        for (const cid of q.correctAnswers) {
          if (!optionIds.has(cid)) {
            issues.push({ setId: id, questionId: q.id, message: `correctAnswer "${cid}" not in options` });
          }
        }
        if (q.answerType === "multiple_choice") {
          if (!q.selectCount || q.selectCount <= 0) {
            issues.push({ setId: id, questionId: q.id, message: "multiple_choice missing valid selectCount" });
          } else if (q.selectCount !== q.correctAnswers.length) {
            issues.push({ setId: id, questionId: q.id, message: `selectCount ${q.selectCount} != correctAnswers ${q.correctAnswers.length}` });
          }
          if (q.selectCount && q.selectCount > q.options.length) {
            issues.push({ setId: id, questionId: q.id, message: "selectCount exceeds option count" });
          }
        }
      }
    }

    if (q.answerType === "matching" || q.answerType === "heading_matching") {
      if (!q.items || q.items.length === 0) {
        issues.push({ setId: id, questionId: q.id, message: "matching question missing items" });
      } else {
        const optionIds = new Set(q.options.map((o) => o.id));
        if (optionIds.size !== q.options.length) {
          issues.push({ setId: id, questionId: q.id, message: "duplicate matching option ids" });
        }
        const itemIds = new Set<string>();
        for (const item of q.items) {
          if (itemIds.has(item.id)) issues.push({ setId: id, questionId: q.id, message: `duplicate item id "${item.id}"` });
          itemIds.add(item.id);
          if (!optionIds.has(item.correctOptionId)) {
            issues.push({ setId: id, questionId: q.id, message: `item "${item.id}" correctOptionId "${item.correctOptionId}" not in options` });
          }
        }
      }
    }
  }

  // Mode-aware question-count + targeted contract.
  const mode = set.practiceMode ?? "full";
  if (mode === "full") {
    if (set.questions.length !== 40) {
      issues.push({ setId: id, message: `full set expected 40 questions, found ${set.questions.length}` });
    }
    if (set.targetQuestionType) {
      issues.push({ setId: id, message: "full set must not set targetQuestionType" });
    }
  } else if (mode === "targeted") {
    if (!set.targetQuestionType) {
      issues.push({ setId: id, message: "targeted set missing targetQuestionType" });
    }
    if (set.questions.length < 6 || set.questions.length > 15) {
      issues.push({ setId: id, message: `targeted set should have 6–15 questions, found ${set.questions.length}` });
    }
    if (set.targetQuestionType) {
      const mismatch = set.questions.filter((q) => q.type !== set.targetQuestionType).length;
      if (mismatch > 0) {
        issues.push({ setId: id, message: `targeted set has ${mismatch} questions not matching ${set.targetQuestionType}` });
      }
    }
  }

  return issues;
}

export function isValidTargetedSet(set: PracticeSet): boolean {
  if (set.practiceMode !== "targeted" || !set.targetQuestionType) return false;
  if (set.questions.length < 6 || set.questions.length > 15) return false;
  return set.questions.every((q) => q.type === set.targetQuestionType);
}

export function validateAllContent(): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenQuestionIds = new Set<string>();
  const seenSetIds = new Set<string>();

  for (const set of allPracticeSets) {
    if (seenSetIds.has(set.meta.id)) {
      issues.push({ setId: set.meta.id, message: `duplicate practice set id "${set.meta.id}"` });
    }
    seenSetIds.add(set.meta.id);
    issues.push(...getPracticeSetIssues(set, seenQuestionIds));
  }

  return { issues, valid: issues.length === 0 };
}

export function questionTypeCoverage(): { missingReading: string[]; missingListening: string[] } {
  const present = new Set(allPracticeSets.flatMap((s) => s.questions.map((q) => q.type)));
  return {
    missingReading: READING_QUESTION_TYPES.filter((t) => !present.has(t)),
    missingListening: LISTENING_QUESTION_TYPES.filter((t) => !present.has(t)),
  };
}

export type { Question };

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
