// Machine-readable content coverage manifest, derived from the actual
// curriculum and practice content (never hand-maintained independently).

import { allLessons, categories, type Category } from "./curriculum";
import { allPracticeSets } from "./practice";
import { writingPrompts } from "./practice/writing-prompts";
import { speakingTopics } from "./practice/speaking-topics";
import { grammarExercises } from "./practice/grammar-exercises";
import { isPublishedTargetedSet, isStructurallyValidTargetedSet, effectiveQuestionCount } from "./practice-validation";
import { scoredUnitCount } from "@/lib/scoring/units";
import { QUESTION_TYPE_LABELS } from "./question-types";
export { questionTypeLabel } from "./question-types";
import type { Skill } from "@/types/ielts";

export interface SkillCoverage {
  skill: Skill;
  lessonCount: number;
  practiceSetCount: number;
  questionCount: number;
  questionTypes: Record<string, number>;
  academic: boolean;
  general: boolean;
}

function countByField(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = (r as Record<string, unknown>)[key];
    if (typeof v === "string" && v) out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

export function computeCoverage(): {
  categories: { id: Category; labelEn: string; labelZh: string; lessonCount: number }[];
  lessons: number;
  reading: SkillCoverage;
  listening: SkillCoverage;
  writingPrompts: { academic: number; general: number; task2: number; academicTask1ByCategory: Record<string, number>; generalTask1ByTone: Record<string, number>; task2BySubtype: Record<string, number> };
  speakingTopics: number;
  speakingParts: { part1: number; part2: number; part3: number };
  grammarLessons: number;
  grammarExercises: number;
  grammarExercisesByLesson: Record<string, number>;
  readingFullSets: number;
  readingTargetedSets: number;
  readingTargetedByType: Record<string, number>;
  readingPublishedTargetedSets: number;
  readingPublishedTargetedByType: Record<string, number>;
  listeningFullSets: number;
  listeningTargetedSets: number;
  listeningTargetedByType: Record<string, number>;
  listeningPlayableTargetedByType: Record<string, number>;
  allQuestionTypes: Record<string, { label: string; present: boolean; count: number }>;
} {
  const reading = computeSkill("reading", "reading");
  const listening = computeSkill("listening", "listening");
  const readingTargetedByType = targetedByType("reading", false);
  const readingPublishedTargetedByType = targetedByType("reading", true);
  const listeningTargetedByType = targetedByType("listening", false);
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
      academicTask1ByCategory: countByField(writingPrompts.filter((p) => p.task === 1 && p.testType === "academic"), "academicVisualCategory"),
      generalTask1ByTone: countByField(writingPrompts.filter((p) => p.task === 1 && p.testType === "general"), "letterTone"),
      task2BySubtype: countByField(writingPrompts.filter((p) => p.task === 2), "taskSubtype"),
    },
    speakingTopics: speakingTopics.length,
    speakingParts: {
      part1: speakingTopics.reduce((n, t) => n + t.part1Questions.length, 0),
      part2: speakingTopics.reduce((n, t) => n + t.part2CueCards.length, 0),
      part3: speakingTopics.reduce((n, t) => n + t.part3Questions.length, 0),
    },
    grammarLessons: allLessons.filter((l) => l.category === "grammar").length,
    grammarExercises: grammarExercises.length,
    grammarExercisesByLesson: (() => {
      const out: Record<string, number> = {};
      for (const e of grammarExercises) {
        if (e.lessonId) out[e.lessonId] = (out[e.lessonId] ?? 0) + 1;
      }
      return out;
    })(),
    readingFullSets,
    readingTargetedSets: Object.values(readingTargetedByType).reduce((n, x) => n + x, 0),
    readingTargetedByType,
    readingPublishedTargetedSets: Object.values(readingPublishedTargetedByType).reduce((n, x) => n + x, 0),
    readingPublishedTargetedByType,
    listeningFullSets,
    listeningTargetedSets: Object.values(listeningTargetedByType).reduce((n, x) => n + x, 0),
    listeningTargetedByType,
    listeningPlayableTargetedByType,
    allQuestionTypes,
  };
}

function targetedByType(kind: "reading" | "listening", publishedOnly = true): Record<string, number> {
  const out: Record<string, number> = {};
  for (const set of allPracticeSets) {
    if (set.kind !== kind) continue;
    const valid = publishedOnly ? isPublishedTargetedSet(set) : isStructurallyValidTargetedSet(set);
    if (!valid) continue;
    const t = set.targetQuestionType ?? "unknown";
    out[t] = (out[t] ?? 0) + 1;
  }
  return out;
}

// NOTE: this is a metadata-declared playability signal (published + valid +
// audio parts/script declared). FINAL playable acceptance is the intersection
// of this + asset-existence validation (listening-assets.test.ts) + E2E audio
// load. A path string alone does not prove playback.
function playableTargetedByType(kind: "reading" | "listening"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const set of allPracticeSets) {
    if (set.kind !== kind || !isPublishedTargetedSet(set)) continue;
    const hasAudio = Boolean(set.audio && (set.audio.src || (set.audio.parts && set.audio.parts.length > 0)));
    const hasScript = Boolean(set.audio?.script && set.audio.script.length > 0);
    if (!hasAudio || !hasScript) continue;
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
    // Canonical scored units: matching items each count as one question.
    questionCount += effectiveQuestionCount(set);
    for (const q of set.questions) {
      questionTypes[q.type] = (questionTypes[q.type] ?? 0) + scoredUnitCount(q);
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
