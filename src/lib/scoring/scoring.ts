// Deterministic IELTS scoring engine.
// Objective (Listening/Reading) scoring NEVER uses an LLM.
//
// Band conversion tables are the publicly documented approximate tables.
// Official IELTS notes that exact raw-score thresholds may vary slightly
// between test versions, so these are honest approximations, not guarantees.

import type {
  Question,
  RawBandTable,
  Skill,
  WritingCriterion,
  SpeakingCriterion,
} from "@/types/ielts";

// --- Answer normalization (conservative) -----------------------------------
//
// We deliberately DO NOT strip apostrophes, hyphens, decimals, commas,
// slashes or other meaningful punctuation. "book's" and "books" are different
// answers; "mother-in-law" is not "mother in law"; "3.5" is not "35".

export function normalizeAnswer(answer: string): string {
  let s = answer
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en")
    // collapse repeated whitespace (incl. newlines/tabs) to a single space
    .replace(/\s+/g, " ")
    .trim();

  // For purely numeric answers (no letters), ignore thousands separators so
  // "50,000", "50 000" and "50000" match. "10:30", "3.5" and "£50" are kept.
  if (/\d/.test(s) && !/[a-z]/i.test(s)) {
    s = s.replace(/[, ]+/g, "");
  }
  return s;
}

export function normalizeAnswers(answers: string[]): string[] {
  return answers.map(normalizeAnswer);
}

// --- Word-count / instruction enforcement ----------------------------------

export interface AnswerInstruction {
  // Maximum number of words permitted (e.g. 1 for "ONE WORD ONLY").
  maxWords: number;
  // Whether a single number is additionally allowed (AND/OR A NUMBER).
  allowNumber: boolean;
}

export function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function isNumberToken(token: string): boolean {
  return /\d/.test(token) && !/[a-z]/i.test(token);
}

function isWordToken(token: string): boolean {
  return /[a-z]/i.test(token);
}

export interface InstructionCheck {
  words: string[];
  numbers: string[];
  compliant: boolean;
  reason?: "too_many_words" | "number_not_allowed" | "too_many_numbers";
}

// Enforce explicit answer instructions such as:
//   ONE WORD ONLY
//   NO MORE THAN TWO WORDS
//   NO MORE THAN TWO WORDS AND/OR A NUMBER
//   ONE WORD AND/OR A NUMBER
// A violation makes the answer incorrect.
export function checkInstruction(
  answer: string,
  instruction: AnswerInstruction | undefined,
): InstructionCheck {
  const tokens = tokenize(answer);
  const words = tokens.filter(isWordToken);
  const numbers = tokens.filter(isNumberToken);
  const check: InstructionCheck = { words, numbers, compliant: true };

  if (!instruction) return check;

  if (words.length > instruction.maxWords) {
    check.compliant = false;
    check.reason = "too_many_words";
  } else if (numbers.length > 1) {
    check.compliant = false;
    check.reason = "too_many_numbers";
  } else if (numbers.length === 1 && !instruction.allowNumber) {
    check.compliant = false;
    check.reason = "number_not_allowed";
  }
  return check;
}

// Parse a human instruction string into structured metadata (used by content
// authors and the coverage validator).
export function parseInstruction(text: string): AnswerInstruction {
  const t = text.toLowerCase();
  const allowNumber = /and\/or a number|and\/or number|a number/.test(t);
  const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 };
  const m1 = t.match(/(?:no more than|up to|maximum of|max|only)\s+(one|two|three|four|five|1|2|3|4|5)/);
  const m2 = t.match(/^(one|two|three|four|five|1|2|3|4|5)\s+word/);
  const match = m1 ?? m2;
  const maxWords = match ? (wordToNum[match[1]] ?? 2) : 2;
  return { maxWords, allowNumber };
}

// Backward-compatible helper: does a raw answer exceed a simple word limit?
export function exceedsWordLimit(text: string, limit: number | undefined): boolean {
  if (!limit) return false;
  return wordCount(text) > limit;
}

// --- Objective answer checking ---------------------------------------------

export interface AnswerCheckResult {
  correct: boolean;
  normalizedUser: string;
  normalizedExpected: string[];
  instructionViolation: boolean;
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

  const instruction: AnswerInstruction | undefined = question.wordLimit
    ? { maxWords: question.wordLimit, allowNumber: question.allowNumber ?? false }
    : undefined;
  const instr = checkInstruction(raw, instruction);
  const instructionViolation = !instr.compliant;

  const correct =
    normalizedUser !== "" &&
    expected.includes(normalizedUser) &&
    !instructionViolation;

  return { correct, normalizedUser, normalizedExpected: expected, instructionViolation };
}

export function checkChoiceAnswer(
  userAnswer: string[] | undefined,
  question: Extract<Question, { answerType: "single_choice" | "multiple_choice" }>,
): boolean {
  const selected = (userAnswer ?? []).filter(Boolean);
  if (selected.length === 0) return false;
  if (question.answerType === "single_choice") {
    return selected.length === 1 && question.correctAnswers.includes(selected[0]);
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

export function checkQuestion(question: Question, userAnswer: unknown): boolean {
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

// --- Canonical scored-unit model -------------------------------------------
//
// A SCORED UNIT is one objective IELTS mark:
// - text question:       1 unit
// - single choice:       1 unit
// - multiple answer:     1 unit (one numbered question)
// - matching/headings:   EACH item is 1 unit (a 7-item group = 7 marks)
//
// This is the single source of truth shared by scoring, submission,
// persistence, analytics and the Coach. Composite IDs for matching items are
// deterministic: `${question.id}::${item.id}`.

export interface ScoredUnitResult {
  id: string;
  parentQuestionId: string;
  itemId?: string;
  questionType: Question["type"];
  correct: boolean;
  userAnswer: string | string[] | null;
  correctAnswer: string;
  prompt: string;
  explanation: string;
}

export function scoredUnitId(questionId: string, itemId?: string): string {
  return itemId ? `${questionId}::${itemId}` : questionId;
}

export function scoreQuestionUnits(question: Question, userAnswer: unknown): ScoredUnitResult[] {
  if (question.answerType === "text" || question.answerType === "number") {
    const q = question as Extract<Question, { answerType: "text" | "number" }>;
    const result = checkTextAnswer(typeof userAnswer === "string" ? userAnswer : undefined, q);
    return [
      {
        id: q.id,
        parentQuestionId: q.id,
        questionType: q.type,
        correct: result.correct,
        userAnswer: typeof userAnswer === "string" ? userAnswer : null,
        correctAnswer: q.correctAnswer,
        prompt: q.prompt,
        explanation: q.explanation,
      },
    ];
  }
  if (question.answerType === "single_choice" || question.answerType === "multiple_choice") {
    const q = question as Extract<Question, { answerType: "single_choice" | "multiple_choice" }>;
    const selected = Array.isArray(userAnswer) ? userAnswer.filter(Boolean) : null;
    if (q.answerType === "multiple_choice" && q.selectCount && q.selectCount > 1) {
      // Multiple-answer: each expected correct choice is one scored unit.
      // Partial credit: 2/2 or 1/2, never 0/1 for the whole group.
      const optionIds = new Set(q.options.map((o) => o.id));
      const raw = (selected ?? []).filter((id) => optionIds.has(id));
      const chosen = new Set(raw);
      // Defensive rule: over-selection (> selectCount unique valid choices)
      // is an invalid response — no credit for any unit in the group.
      const invalid = chosen.size > q.selectCount;
      return q.correctAnswers.map((expected) => ({
        id: scoredUnitId(q.id, `choice:${expected}`),
        parentQuestionId: q.id,
        itemId: `choice:${expected}`,
        questionType: q.type,
        correct: !invalid && chosen.has(expected),
        userAnswer: selected,
        correctAnswer: expected,
        prompt: q.prompt,
        explanation: q.explanation,
      }));
    }
    return [
      {
        id: q.id,
        parentQuestionId: q.id,
        questionType: q.type,
        correct: checkChoiceAnswer(selected ?? undefined, q),
        userAnswer: selected,
        correctAnswer: q.correctAnswers.join(", "),
        prompt: q.prompt,
        explanation: q.explanation,
      },
    ];
  }
  // matching / heading_matching: one unit per item
  const q = question as Extract<Question, { answerType: "matching" | "heading_matching" }>;
  const answers = (userAnswer && typeof userAnswer === "object" ? userAnswer : {}) as Record<string, string>;
  return q.items.map((item) => ({
    id: scoredUnitId(q.id, item.id),
    parentQuestionId: q.id,
    itemId: item.id,
    questionType: q.type,
    correct: answers[item.id] === item.correctOptionId,
    userAnswer: answers[item.id] ?? null,
    correctAnswer: item.correctOptionId,
    prompt: item.text,
    explanation: q.explanation,
  }));
}

export function scorePracticeUnits(questions: Question[], answers: Record<string, unknown>): ScoredUnitResult[] {
  const units: ScoredUnitResult[] = [];
  for (const q of questions) {
    units.push(...scoreQuestionUnits(q, answers[q.id]));
  }
  return units;
}

// --- Raw-to-band tables (public approximate values) ------------------------

export const LISTENING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [39, 9.0], [37, 8.5], [35, 8.0], [32, 7.5], [30, 7.0], [26, 6.5],
    [23, 6.0], [18, 5.5], [16, 5.0], [13, 4.5], [11, 4.0], [8, 3.5],
    [6, 3.0], [4, 2.5], [2, 2.0], [1, 1.0], [0, 0.0],
  ],
};

export const ACADEMIC_READING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0], [27, 6.5],
    [23, 6.0], [19, 5.5], [15, 5.0], [13, 4.5], [10, 4.0], [8, 3.5],
    [6, 3.0], [4, 2.5], [2, 2.0], [1, 1.0], [0, 0.0],
  ],
};

export const GENERAL_READING_BAND_TABLE: RawBandTable = {
  thresholds: [
    [40, 9.0], [39, 8.5], [38, 8.0], [36, 7.5], [34, 7.0], [32, 6.5],
    [30, 6.0], [27, 5.5], [23, 5.0], [19, 4.5], [15, 4.0], [12, 3.5],
    [9, 3.0], [6, 2.5], [4, 2.0], [2, 1.0], [0, 0.0],
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

// --- Band rounding & aggregation -------------------------------------------

// IELTS rounds to the nearest half band. For quarter-band averages:
//   x.00 -> x.0, x.125 -> x.0, x.25 -> x.5, x.375 -> x.5,
//   x.50 -> x.5, x.625 -> x.5, x.75 -> x+1.0, x.875 -> x+1.0
// Math.round(value * 2) / 2 reproduces this exactly for these values; we keep
// the formula but verify with explicit boundary tests.
export function roundBand(value: number): number {
  return Math.round(value * 2) / 2;
}

export interface SectionBands {
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
}

// OFFICIAL overall band: only valid when all four skills are present.
export function calculateOfficialOverallBand(sections: SectionBands): number | null {
  const { listening, reading, writing, speaking } = sections;
  if (
    listening == null ||
    reading == null ||
    writing == null ||
    speaking == null
  ) {
    return null;
  }
  const avg = (listening + reading + writing + speaking) / 4;
  return roundBand(avg);
}

// Learning-analytics average of however many skills are available.
// The UI MUST label this "Average of completed skills", never "Overall IELTS Band".
export function calculateCompletedSkillsAverage(sections: SectionBands): number | null {
  const values = [sections.listening, sections.reading, sections.writing, sections.speaking]
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (values.length === 0) return null;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return roundBand(avg);
}

// --- Writing aggregation ---------------------------------------------------

// Task 2 carries twice the weight of Task 1.
export function writingBandFromTasks(task1: number, task2: number): number {
  return roundBand((task1 + task2 * 2) / 3);
}

export const WRITING_CRITERIA: WritingCriterion[] = [
  "taskAchievement",
  "taskResponse",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRange",
];

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
  const shared = criteria.filter(
    (c) => c.criterion !== "taskAchievement" && c.criterion !== "taskResponse",
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

export function rawScoreForBand(table: RawBandTable, targetBand: number): number {
  for (let s = 0; s <= 40; s++) {
    if (bandForRawScore(s, table) >= targetBand) return s;
  }
  return 40;
}
