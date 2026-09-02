// Pure PracticeSet structural validation. Imported by BOTH validate.ts and
// coverage.ts — one canonical implementation, no circular dependency.

import type { PracticeSet } from "@/types/ielts";
import { normalizeAnswer } from "@/lib/scoring/scoring";

function stripSurrounding(s: string): string {
  return s.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

export interface ValidationIssue {
  setId: string;
  questionId?: string;
  message: string;
}

// ---- Pure per-set structural validation (no global state) ----

// Matching/heading-matching questions score each item as a sub-question.
export function effectiveQuestionCount(set: PracticeSet): number {
  let n = 0;
  for (const q of set.questions) {
    if (q.answerType === "matching" || q.answerType === "heading_matching") {
      n += q.items?.length ?? 0;
    } else {
      n += 1;
    }
  }
  return n;
}

export function getPracticeSetIssues(set: PracticeSet, seenQuestionIds: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const id = set.meta.id;

  if (!id) issues.push({ setId: "(unknown)", message: "set missing meta.id" });
  if (!set.meta.sourceType) issues.push({ setId: id, message: "set missing sourceType" });
  if (!set.meta.license) issues.push({ setId: id, message: "set missing license" });

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
  const effectiveCount = effectiveQuestionCount(set);
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
    if (effectiveCount < 6 || effectiveCount > 15) {
      issues.push({ setId: id, message: `targeted set should have 6–15 questions, found ${effectiveCount}` });
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

// ---- Coverage-safe validity (pure, no global state) ----

export function isStructurallyValidTargetedSet(set: PracticeSet): boolean {
  if (set.practiceMode !== "targeted" || !set.targetQuestionType) return false;
  if (effectiveQuestionCount(set) < 6 || effectiveQuestionCount(set) > 15) return false;
  if (!set.questions.every((q) => q.type === set.targetQuestionType)) return false;
  // A fresh Set checks within-set uniqueness only; global uniqueness is
  // validated separately by validateAllContent.
  return getPracticeSetIssues(set, new Set()).length === 0;
}

export function isPublishedTargetedSet(set: PracticeSet): boolean {
  return isStructurallyValidTargetedSet(set) && set.meta.reviewStatus === "published";
}
