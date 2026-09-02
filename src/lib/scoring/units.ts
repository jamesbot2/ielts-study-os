// Canonical scored-unit model — the SINGLE definition of how many objective
// marks a question is worth, shared by scoring, validation, coverage and all
// runners. Do not re-implement this logic anywhere else.
//
// Rules:
//   text / number                 -> 1 unit
//   single_choice                 -> 1 unit
//   multiple_choice (selectCount>1) -> selectCount units (partial credit)
//   matching / heading_matching   -> items.length units (one per item)

import type { PracticeSet, Question } from "@/types/ielts";
import type { AnswerValue } from "@/lib/storage/types";

export function scoredUnitCount(question: Question): number {
  if (question.answerType === "matching" || question.answerType === "heading_matching") {
    return question.items.length;
  }
  if (question.answerType === "multiple_choice" && question.selectCount && question.selectCount > 1) {
    return question.selectCount;
  }
  return 1;
}

export function scoredUnitCountForQuestions(questions: Question[]): number {
  return questions.reduce((n, q) => n + scoredUnitCount(q), 0);
}

export function scoredUnitCountForSet(set: PracticeSet): number {
  return scoredUnitCountForQuestions(set.questions);
}

// 1-based range of numbered questions a visual question group occupies.
export function scoredUnitRange(questions: Question[], questionIndex: number): { start: number; end: number } {
  let n = 0;
  for (let i = 0; i < questionIndex; i++) n += scoredUnitCount(questions[i]);
  const units = questionIndex >= 0 && questionIndex < questions.length ? scoredUnitCount(questions[questionIndex]) : 0;
  return { start: n + 1, end: n + units };
}

// How many scored units the learner has answered for a question group.
export function answeredScoredUnitCount(question: Question, answer: AnswerValue | undefined): number {
  if (question.answerType === "matching" || question.answerType === "heading_matching") {
    const map = (answer && typeof answer === "object" ? answer : {}) as Record<string, string>;
    return question.items.filter((i) => typeof map[i.id] === "string" && map[i.id] !== "").length;
  }
  if (question.answerType === "multiple_choice" && question.selectCount && question.selectCount > 1) {
    if (!Array.isArray(answer)) return 0;
    const optionIds = new Set(question.options.map((o) => o.id));
    const valid = answer.filter((id) => optionIds.has(id));
    const unique = new Set(valid);
    return Math.min(unique.size, question.selectCount);
  }
  if (question.answerType === "single_choice") {
    return Array.isArray(answer) && answer.length > 0 ? 1 : 0;
  }
  // text / number
  return typeof answer === "string" && answer.trim() !== "" ? 1 : 0;
}
