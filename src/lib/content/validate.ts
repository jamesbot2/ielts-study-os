// Structural content validators. Fail loudly when malformed content is added.

import type { Question } from "@/types/ielts";
import { normalizeAnswer } from "@/lib/scoring/scoring";
import { allPracticeSets } from "./practice";
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

export function validateAllContent(): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const set of allPracticeSets) {
    if (!set.meta.id) issues.push({ setId: "(unknown)", message: "set missing meta.id" });
    if (!set.meta.sourceType) issues.push({ setId: set.meta.id, message: "set missing sourceType" });
    if (!set.meta.license) issues.push({ setId: set.meta.id, message: "set missing license" });

    for (const q of set.questions) {
      if (seenIds.has(q.id)) {
        issues.push({ setId: set.meta.id, questionId: q.id, message: `duplicate question id "${q.id}"` });
      }
      seenIds.add(q.id);

      if (!q.explanation || q.explanation.trim().length === 0) {
        issues.push({ setId: set.meta.id, questionId: q.id, message: "missing explanation" });
      }
      if (q.difficulty < 1 || q.difficulty > 5) {
        issues.push({ setId: set.meta.id, questionId: q.id, message: "difficulty out of range" });
      }

      if (q.answerType === "text" || q.answerType === "number") {
        if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
          issues.push({ setId: set.meta.id, questionId: q.id, message: "text question missing correctAnswer" });
        }
        const isJudgeType = q.type === "true_false_not_given" || q.type === "yes_no_not_given";
        if (q.wordLimit == null && !isJudgeType) {
          issues.push({ setId: set.meta.id, questionId: q.id, message: "text question missing wordLimit metadata" });
        }
        // Answer-consistency check for reading: the correct answer (or an
        // accepted variant) must be grounded in the passage text.
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
              setId: set.meta.id,
              questionId: q.id,
              message: `answer "${q.correctAnswer}" not grounded in passage (answer-consistency)`,
            });
          }
        }
      }

      if (q.answerType === "single_choice" || q.answerType === "multiple_choice") {
        if (!q.correctAnswers || q.correctAnswers.length === 0) {
          issues.push({ setId: set.meta.id, questionId: q.id, message: "choice question missing correctAnswers" });
        }
      }

      if (q.answerType === "matching" || q.answerType === "heading_matching") {
        if (!q.items || q.items.length === 0) {
          issues.push({ setId: set.meta.id, questionId: q.id, message: "matching question missing items" });
        }
      }
    }
  }

  // Complete test counts: each full test must contain 40 questions.
  for (const set of allPracticeSets) {
    if (set.questions.length !== 40) {
      issues.push({ setId: set.meta.id, message: `expected 40 questions, found ${set.questions.length}` });
    }
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
