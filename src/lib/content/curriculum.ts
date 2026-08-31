import type { Category, Lesson } from "./types";
import { fundamentalsLessons } from "./lessons/fundamentals";
import { listeningLessons } from "./lessons/listening";
import { readingLessons } from "./lessons/reading";
import { writingLessons } from "./lessons/writing";
import { speakingLessons } from "./lessons/speaking";
import { grammarLessons } from "./lessons/grammar";
import { strategiesLessons } from "./lessons/strategies";
import { deepQuestionTypeLessons } from "./lessons/question-types";

export type { Category, Lesson } from "./types";

export const allLessons: Lesson[] = [
  ...fundamentalsLessons,
  ...listeningLessons,
  ...readingLessons,
  ...writingLessons,
  ...speakingLessons,
  ...grammarLessons,
  ...strategiesLessons,
  ...deepQuestionTypeLessons,
];

export const categories: { id: Category; labelEn: string; labelZh: string }[] = [
  { id: "fundamentals", labelEn: "IELTS Fundamentals", labelZh: "雅思基础" },
  { id: "listening", labelEn: "Listening", labelZh: "听力" },
  { id: "reading", labelEn: "Reading", labelZh: "阅读" },
  { id: "writing", labelEn: "Writing", labelZh: "写作" },
  { id: "speaking", labelEn: "Speaking", labelZh: "口语" },
  { id: "vocabulary", labelEn: "Vocabulary", labelZh: "词汇" },
  { id: "grammar", labelEn: "Grammar", labelZh: "语法" },
  { id: "strategies", labelEn: "Strategies", labelZh: "策略" },
];

const CATEGORY_ORDER: Record<Category, number> = Object.fromEntries(
  categories.map((c, i) => [c.id, i]),
) as Record<Category, number>;

// A lesson applies to a learner if it is shared or matches their test type.
function lessonApplies(lesson: Lesson, testType: "academic" | "general"): boolean {
  return lesson.testType === "both" || lesson.testType === testType;
}

export type TestType = "academic" | "general";

// Deterministic curriculum sequence: category order, then lesson order, then id.
export function getOrderedLessons(options?: {
  testType?: TestType;
  category?: Category;
}): Lesson[] {
  return allLessons
    .filter((l) => (options?.category ? l.category === options.category : true))
    .filter((l) => (options?.testType ? lessonApplies(l, options.testType) : true))
    .sort(
      (a, b) =>
        (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99) ||
        a.order - b.order ||
        a.id.localeCompare(b.id),
    );
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getLessonsByCategory(category: Category, testType?: TestType): Lesson[] {
  return getOrderedLessons({ category, testType });
}

// Adjacent lessons within a test-type-aware sequence.
export function getAdjacentLessons(
  id: string,
  testType: TestType,
): { previous: Lesson | undefined; next: Lesson | undefined } {
  const ordered = getOrderedLessons({ testType });
  const idx = ordered.findIndex((l) => l.id === id);
  if (idx < 0) return { previous: undefined, next: undefined };
  return { previous: ordered[idx - 1], next: ordered[idx + 1] };
}

export function lessonCountByCategory(testType?: TestType): Record<Category, number> {
  const out = {} as Record<Category, number>;
  for (const c of categories) out[c.id] = getLessonsByCategory(c.id, testType).length;
  return out;
}
