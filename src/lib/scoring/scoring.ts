// Deterministic IELTS scoring engine.
// Objective (Listening/Reading) scoring NEVER uses an LLM.
//
// Band conversion tables are the publicly documented approximate tables.
// Official IELTS notes that exact raw-score thresholds may vary slightly
// between test versions, so these are honest approximations, not guarantees.

import type {
  Question,
  RawBandTable,
  SectionBand,
  Skill,
  WritingCriterion,
  SpeakingCriterion,
} from "@/types/ielts";

// --- Answer normalization --------------------------------------------------

export function normalizeAnswer(answer: string): string {
  return answer
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en")
    // strip surrounding/enclosing punctuation that does not change meaning
    .replace(/[“”‘’"'.,!?;:()[\]{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAnswers(answers: string[]): string[] {
  return answers.map(normalizeAnswer);
}

// --- Word-limit enforcement ------------------------------------------------

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function exceedsWordLimit(text: string, limit: number | undefined): boolean {
  if (!limit) return false;
  return wordCount(text) > limit;
}

// --- Objective answer checking ---------------------------------------------

export interface AnswerCheckResult {
  correct: boolean;
  normalizedUser: string;
  normalizedExpected: string[];
  wordLimitExceeded: boolean;
}

export function checkTextAnswer(
  userAnswer: string | undefined,
  question: Extract<Question, { answerType: "text" | "number" }>,
): AnswerCheckResult {
  const raw = userAnswer ?? "";
  const normalizedUser = normalizeAnswer(raw);
  const expected = normalizeAnswers([
    question.correctAnswer,
    ...(question.acceptableAnswers ?? []),
  ]);
  const correct =
    normalizedUser !== "" && expected.includes(normalizedUser);
  return {
    correct,
    normalizedUser,
    normalizedExpected: expected,
    wordLimitExceeded: exceedsWordLimit(raw, question.wordLimit),
  };
}

export function checkChoiceAnswer(
  userAnswer: string[] | undefined,
  question: Extract<Question, { answerType: "single_choice" | "multiple_choice" }>,
): boolean {
  const selected = (userAnswer ?? []).filter(Boolean);
  if (selected.length === 0) return false;
  if (question.answerType === "single_choice") {
    return (
      selected.length === 1 &&
      question.correctAnswers.includes(selected[0])
    );
  }
  // multiple choice: exact set match
  const expected = [...question.correctAnswers].sort();
  const actual = [...selected].sort();
  if (expected.length !== actual.length) return false;
  return expected.every((v, i) => v === actual[i]);
}

export function checkMatchingAnswer(
  userAnswer: Record<string, string> | undefined,
  question: Extract<Question, { answerType: "matching" | "heading_matching" }>,
): boolean {
  const answers = userAnswer ?? {};
  const items = question.items;
  if (items.length === 0) return false;
  for (const item of items) {
    if (answers[item.id] !== item.correctOptionId) return false;
  }
  return true;
}

export function checkQuestion(
  question: Question,
  userAnswer: unknown,
): boolean {
  if (question.answerType === "text" || question.answerType === "number") {
    return checkTextAnswer(
      typeof userAnswer === "string" ? userAnswer : undefined,
      question as Extract<Question, { answerType: "text" | "number" }>,
    ).correct;
  }
  if (
    question.answerType === "single_choice" ||
    question.answerType === "multiple_choice"
  ) {
    return checkChoiceAnswer(
      Array.isArray(userAnswer) ? userAnswer : undefined,
      question as Extract<Question, { answerType: "single_choice" | "multiple_choice" }>,
    );
  }
  return checkMatchingAnswer(
    userAnswer && typeof userAnswer === "object"
      ? (userAnswer as Record<string, string>)
      : undefined,
    question as Extract<Question, { answerType: "matching" | "heading_matching" }>,
  );
}

// --- Raw-to-band tables (public approximate values) ------------------------

// Listening: Academic and General Training share the same table.
export const LISTENING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [39, 9.0],
    [37, 8.5],
    [35, 8.0],
    [32, 7.5],
    [30, 7.0],
    [26, 6.5],
    [23, 6.0],
    [18, 5.5],
    [16, 5.0],
    [13, 4.5],
    [11, 4.0],
    [8, 3.5],
    [6, 3.0],
    [4, 2.5],
    [2, 2.0],
    [1, 1.0],
    [0, 0.0],
  ],
};

// Academic Reading
export const ACADEMIC_READING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [39, 9.0],
    [37, 8.5],
    [35, 8.0],
    [33, 7.5],
    [30, 7.0],
    [27, 6.5],
    [23, 6.0],
    [19, 5.5],
    [15, 5.0],
    [13, 4.5],
    [10, 4.0],
    [8, 3.5],
    [6, 3.0],
    [4, 2.5],
    [2, 2.0],
    [1, 1.0],
    [0, 0.0],
  ],
};

// General Training Reading (higher raw scores needed for the same band)
export const GENERAL_READING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [40, 9.0],
    [39, 8.5],
    [38, 8.0],
    [36, 7.5],
    [34, 7.0],
    [32, 6.5],
    [30, 6.0],
    [27, 5.5],
    [23, 5.0],
    [19, 4.5],
    [15, 4.0],
    [12, 3.5],
    [9, 3.0],
    [6, 2.5],
    [4, 2.0],
    [2, 1.0],
    [0, 0.0],
  ],
};

export function bandForRawScore(rawScore: number, table: RawBandTable): number {
  const c = Math.max(0, Math.min(40, Math.round(rawScore)));
  for (const [threshold, band] of table.thresholds) {
    if (c >= threshold) return band;
  }
  return 0;
}

export function listeningBand(rawScore: number): number {
  return bandForRawScore(rawScore, LISTENING_BAND_TABLE);
}

export function readingBand(rawScore: number, testType: "academic" | "general"): number {
  return bandForRawScore(
    rawScore,
    testType === "general" ? GENERAL_READING_BAND_TABLE : ACADEMIC_READING_BAND_TABLE,
  );
}

export function objectiveBand(skill: Skill, rawScore: number, testType: "academic" | "general"): number {
  if (skill === "listening") return listeningBand(rawScore);
  return readingBand(rawScore, testType);
}

// --- Overall band rounding --------------------------------------------------

// IELTS rounds the average of the four section scores to the nearest half band.
// x.25 -> next half band up; x.75 -> next whole band up.
export function roundBand(value: number): number {
  return Math.round(value * 2) / 2;
}

export function overallBandFromSections(sections: SectionBand[]): number {
  const available = sections.filter(
    (s): s is number => typeof s === "number" && Number.isFinite(s),
  );
  if (available.length === 0) return 0;
  const avg = available.reduce((a, b) => a + b, 0) / available.length;
  return roundBand(avg);
}

// --- Writing aggregation ---------------------------------------------------

// Task 2 carries twice the weight of Task 1.
export function writingBandFromTasks(task1: number, task2: number): number {
  const weighted = (task1 + task2 * 2) / 3;
  return roundBand(weighted);
}

export const WRITING_CRITERIA: WritingCriterion[] = [
  "taskAchievement",
  "taskResponse",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRange",
];

// Speaking: four criteria equally weighted.
export const SPEAKING_CRITERIA: SpeakingCriterion[] = [
  "fluencyCoherence",
  "lexicalResource",
  "grammaticalRange",
  "pronunciation",
];

export function speakingBandFromCriteria(criteria: number[]): number {
  if (criteria.length === 0) return 0;
  const avg = criteria.reduce((a, b) => a + b, 0) / criteria.length;
  return roundBand(avg);
}

export function writingBandFromCriteria(
  criteria: { criterion: WritingCriterion; band: number }[],
  task: 1 | 2,
): number {
  // Task 1 uses Task Achievement; Task 2 uses Task Response; plus 3 shared criteria.
  const shared = criteria.filter(
    (c) =>
      c.criterion !== "taskAchievement" && c.criterion !== "taskResponse",
  );
  const taskCriterion = criteria.find((c) =>
    task === 1 ? c.criterion === "taskAchievement" : c.criterion === "taskResponse",
  );
  if (!taskCriterion || shared.length !== 3) return 0;
  const bands = [taskCriterion.band, ...shared.map((c) => c.band)];
  return roundBand(bands.reduce((a, b) => a + b, 0) / bands.length);
}

// --- Band descriptions -----------------------------------------------------

export function bandDescription(band: number): string {
  if (band >= 9) return "Expert user";
  if (band >= 8) return "Very good user";
  if (band >= 7) return "Good user";
  if (band >= 6) return "Competent user";
  if (band >= 5) return "Modest user";
  if (band >= 4) return "Limited user";
  if (band >= 3) return "Extremely limited user";
  if (band >= 2) return "Intermittent user";
  if (band >= 1) return "Non-user";
  return "Did not attempt the test";
}

// Lowest raw score that reaches each band (for reporting score requirements).
export function rawScoreForBand(table: RawBandTable, targetBand: number): number {
  for (let s = 0; s <= 40; s++) {
    if (bandForRawScore(s, table) >= targetBand) return s;
  }
  return 40;
}
