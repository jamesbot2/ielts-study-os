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

  // Strip shared IELTS instruction boilerplate before comparing writing
  // prompts, so map/process/agree/disagree prompts are not flagged as
  // duplicates merely for sharing the standard task instruction.
  const stripInstruction = (text: string) =>
    text
      .replace(/Summarise the information by selecting and reporting the main features[^.]*\.?/gi, "")
      .replace(/To what extent do you agree or disagree\?/gi, "")
      .replace(/Discuss both views and give your own opinion\./gi, "")
      .replace(/Do the advantages .*? outweigh the disadvantages\?/gi, "")
      .replace(/Is this a positive or negative development\?/gi, "")
      .replace(/Write a letter to [^.]+\. In your letter:/gi, "");
  for (let i = 0; i < writingPrompts.length; i++) {
    for (let j = i + 1; j < writingPrompts.length; j++) {
      const a = stripInstruction(writingPrompts[i].prompt);
      const b = stripInstruction(writingPrompts[j].prompt);
      const s = tokenOverlap(a, b);
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

// ---- Writing prompt validation ----

export function validateWritingPrompts(): ValidationReport {
  const issues = [];
  const ids = new Set<string>();
  for (const p of writingPrompts) {
    if (!p.id) issues.push({ setId: "writing", message: "prompt missing id" });
    if (ids.has(p.id)) issues.push({ setId: "writing", message: `duplicate writing prompt id "${p.id}"` });
    ids.add(p.id);
    if (!p.title || !p.title.trim()) issues.push({ setId: p.id, message: "empty title" });
    if (!p.prompt || !p.prompt.trim()) issues.push({ setId: p.id, message: "empty prompt" });
    if (!p.sourceType) issues.push({ setId: p.id, message: "missing sourceType" });
    if (p.task === 1) {
      if (p.wordLimit !== 150) issues.push({ setId: p.id, message: `Task 1 wordLimit should be 150, got ${p.wordLimit}` });
      if (p.suggestedMinutes !== 20) issues.push({ setId: p.id, message: `Task 1 suggestedMinutes should be 20` });
      if (p.testType === "academic") {
        const hasStimulus = Boolean(p.dataTable || (p.visualDescription && p.visualDescription.trim().length > 20));
        if (!hasStimulus) issues.push({ setId: p.id, message: "Academic Task 1 missing usable data stimulus" });
        if (!p.academicVisualCategory) issues.push({ setId: p.id, message: "Academic Task 1 missing academicVisualCategory" });
        // Data-consistency guardrails (machine-checkable cases only).
        if (p.dataTable) {
          const width = p.dataTable.columns.length;
          for (const row of p.dataTable.rows) {
            if (row.length !== width) issues.push({ setId: p.id, message: `dataTable row width ${row.length} != columns ${width}` });
            for (const cell of row) if (!cell || !String(cell).trim()) issues.push({ setId: p.id, message: "dataTable has an empty cell" });
          }
        }
        if (p.visualType === "pie chart" && p.visualDescription) {
          // Split multi-pie descriptions (e.g. "2000: ... 2020: ..." or
          // "Country A: ... Country B: ...") and check each group separately.
          const groups = p.visualDescription.split(/:\s*/).slice(1);
          const pieces = groups.length > 1 ? groups : [p.visualDescription];
          for (const piece of pieces) {
            const cleaned = piece.replace(/\(sums? to 100%\)/gi, "");
            const pcts = (cleaned.match(/\d+%/g) ?? []).map((x) => Number(x.slice(0, -1)));
            if (pcts.length === 0) continue;
            const sum = pcts.reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 100) > 3) {
              issues.push({ setId: p.id, message: `pie chart percentages sum to ${sum}, expected ~100 (group: "${piece.slice(0, 40)}...")` });
            }
          }
        }
      }
      if (p.testType === "general") {
        if (!p.letterTone) issues.push({ setId: p.id, message: "General Task 1 missing letterTone" });
        if (!p.letterPurpose) issues.push({ setId: p.id, message: "General Task 1 missing letterPurpose" });
        if (!p.letterRequirements || p.letterRequirements.length !== 3) {
          issues.push({ setId: p.id, message: `General Task 1 must have exactly 3 structured requirements, found ${p.letterRequirements?.length ?? 0}` });
        } else {
          for (const r of p.letterRequirements) {
            if (!r || !r.trim()) issues.push({ setId: p.id, message: "General Task 1 has an empty requirement" });
          }
          if (new Set(p.letterRequirements).size !== 3) {
            issues.push({ setId: p.id, message: "General Task 1 requirements are not distinct" });
          }
        }
      }
    }
    if (p.task === 2) {
      if (p.wordLimit !== 250) issues.push({ setId: p.id, message: `Task 2 wordLimit should be 250` });
      if (p.suggestedMinutes !== 40) issues.push({ setId: p.id, message: `Task 2 suggestedMinutes should be 40` });
      if (!p.taskSubtype) issues.push({ setId: p.id, message: "Task 2 missing taskSubtype" });
    }
  }
  return { issues, valid: issues.length === 0 };
}
