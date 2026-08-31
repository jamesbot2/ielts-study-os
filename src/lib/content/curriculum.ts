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

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getLessonsByCategory(category: Category): Lesson[] {
  return allLessons
    .filter((l) => l.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getNextLesson(id: string): Lesson | undefined {
  const idx = allLessons.findIndex((l) => l.id === id);
  return idx >= 0 ? allLessons[idx + 1] : undefined;
}

export function getPreviousLesson(id: string): Lesson | undefined {
  const idx = allLessons.findIndex((l) => l.id === id);
  return idx > 0 ? allLessons[idx - 1] : undefined;
}

export function lessonCountByCategory(): Record<Category, number> {
  const out = {} as Record<Category, number>;
  for (const c of categories) out[c.id] = getLessonsByCategory(c.id).length;
  return out;
}
