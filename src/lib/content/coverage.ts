// Machine-readable content coverage manifest, derived from the actual
// curriculum and practice content (never hand-maintained independently).

import { allLessons, categories, type Category } from "./curriculum";
import { allPracticeSets } from "./practice";
import { writingPrompts } from "./practice/writing-prompts";
import { speakingTopics } from "./practice/speaking-topics";
import { grammarExercises } from "./practice/grammar-exercises";
import { isValidTargetedSet } from "./validate";
import type { QuestionType, Skill } from "@/types/ielts";

export interface SkillCoverage {
  skill: Skill;
  lessonCount: number;
  practiceSetCount: number;
  questionCount: number;
  questionTypes: Record<string, number>;
  academic: boolean;
  general: boolean;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple choice",
  multiple_answer: "Multiple-answer questions",
  matching: "Matching",
  matching_headings: "Matching headings",
  matching_information: "Matching information",
  matching_features: "Matching features",
  matching_sentence_endings: "Matching sentence endings",
  true_false_not_given: "True / False / Not Given",
  yes_no_not_given: "Yes / No / Not Given",
  sentence_completion: "Sentence completion",
  summary_completion: "Summary completion",
  note_completion: "Note completion",
  table_completion: "Table completion",
  flow_chart_completion: "Flow-chart completion",
  diagram_labelling: "Diagram-labelling completion",
  form_completion: "Form completion",
  short_answer: "Short-answer questions",
  plan_labelling: "Plan labelling",
  map_labelling: "Map labelling",
};

export function questionTypeLabel(type: QuestionType): string {
  return QUESTION_TYPE_LABELS[type];
}

export function computeCoverage(): {
  categories: { id: Category; labelEn: string; labelZh: string; lessonCount: number }[];
  lessons: number;
  reading: SkillCoverage;
  listening: SkillCoverage;
  writingPrompts: { academic: number; general: number; task2: number };
  speakingTopics: number;
  speakingParts: { part1: number; part2: number; part3: number };
  grammarLessons: number;
  grammarExercises: number;
  readingFullSets: number;
  readingTargetedSets: number;
  readingTargetedByType: Record<string, number>;
  listeningFullSets: number;
  listeningTargetedSets: number;
  listeningTargetedByType: Record<string, number>;
  listeningPlayableTargetedByType: Record<string, number>;
  allQuestionTypes: Record<string, { label: string; present: boolean; count: number }>;
} {
  const reading = computeSkill("reading", "reading");
  const listening = computeSkill("listening", "listening");
  const readingTargetedByType = targetedByType("reading");
  const listeningTargetedByType = targetedByType("listening");
  const listeningPlayableTargetedByType = playableTargetedByType("listening");
  const readingFullSets = allPracticeSets.filter((s) => s.kind === "reading" && (s.practiceMode ?? "full") === "full").length;
  const listeningFullSets = allPracticeSets.filter((s) => s.kind === "listening" && (s.practiceMode ?? "full") === "full").length;

  const allQuestionTypes = {} as Record<string, { label: string; present: boolean; count: number }>;
  for (const [type, label] of Object.entries(QUESTION_TYPE_LABELS)) {
    const count = [...Object.entries(reading.questionTypes), ...Object.entries(listening.questionTypes)].reduce(
      (sum, [t, n]) => (t === type ? sum + n : sum),
      0,
    );
    allQuestionTypes[type] = { label, present: count > 0, count };
  }

  return {
    categories: categories.map((c) => ({ ...c, lessonCount: allLessons.filter((l) => l.category === c.id).length })),
    lessons: allLessons.length,
    reading,
    listening,
    writingPrompts: {
      academic: writingPrompts.filter((p) => p.testType === "academic" && p.task === 1).length,
      general: writingPrompts.filter((p) => p.testType === "general" && p.task === 1).length,
      task2: writingPrompts.filter((p) => p.task === 2).length,
    },
    speakingTopics: speakingTopics.length,
    speakingParts: {
      part1: speakingTopics.reduce((n, t) => n + t.part1Questions.length, 0),
      part2: speakingTopics.reduce((n, t) => n + t.part2CueCards.length, 0),
      part3: speakingTopics.reduce((n, t) => n + t.part3Questions.length, 0),
    },
    grammarLessons: allLessons.filter((l) => l.category === "grammar").length,
    grammarExercises: grammarExercises.length,
    readingFullSets,
    readingTargetedSets: Object.values(readingTargetedByType).reduce((n, x) => n + x, 0),
    readingTargetedByType,
    listeningFullSets,
    listeningTargetedSets: Object.values(listeningTargetedByType).reduce((n, x) => n + x, 0),
    listeningTargetedByType,
    listeningPlayableTargetedByType,
    allQuestionTypes,
  };
}

function targetedByType(kind: "reading" | "listening"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const set of allPracticeSets) {
    // Only count sets that satisfy the canonical targeted contract.
    if (set.kind !== kind || !isValidTargetedSet(set)) continue;
    const t = set.targetQuestionType ?? "unknown";
    out[t] = (out[t] ?? 0) + 1;
  }
  return out;
}

function playableTargetedByType(kind: "reading" | "listening"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const set of allPracticeSets) {
    if (set.kind !== kind || !isValidTargetedSet(set)) continue;
    const published = set.meta.reviewStatus === "published";
    const hasAudio = Boolean(set.audio && (set.audio.src || (set.audio.parts && set.audio.parts.length > 0)));
    const hasScript = Boolean(set.audio?.script && set.audio.script.length > 0);
    if (!published || !hasAudio || !hasScript) continue;
    const t = set.targetQuestionType ?? "unknown";
    out[t] = (out[t] ?? 0) + 1;
  }
  return out;
}

function computeSkill(skill: Skill, kind: "reading" | "listening"): SkillCoverage {
  const sets = allPracticeSets.filter((s) => s.kind === kind);
  const lessons = allLessons.filter((l) => l.category === kind);
  const questionTypes: Record<string, number> = {};
  let questionCount = 0;
  for (const set of sets) {
    questionCount += set.questions.length;
    for (const q of set.questions) {
      questionTypes[q.type] = (questionTypes[q.type] ?? 0) + 1;
    }
  }
  return {
    skill,
    lessonCount: lessons.length,
    practiceSetCount: sets.length,
    questionCount,
    questionTypes,
    academic: sets.some((s) => s.meta.testType === "academic" || s.meta.testType === "both"),
    general: sets.some((s) => s.meta.testType === "general" || s.meta.testType === "both"),
  };
}

// The complete set of major IELTS Listening question types.
export const LISTENING_QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "multiple_answer",
  "matching",
  "plan_labelling",
  "map_labelling",
  "diagram_labelling",
  "form_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "summary_completion",
  "sentence_completion",
  "short_answer",
];

// The complete set of major IELTS Reading question types.
export const READING_QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_information",
  "matching_headings",
  "matching_features",
  "matching_sentence_endings",
  "sentence_completion",
  "summary_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "diagram_labelling",
  "short_answer",
];
