// Localized string for bilingual curriculum content.
export interface Lc {
  en: string;
  zh: string;
}

export function L(en: string, zh: string): Lc {
  return { en, zh };
}

export type Category =
  | "fundamentals"
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "vocabulary"
  | "grammar"
  | "strategies";

export interface LessonTable {
  headers: Lc[];
  rows: Lc[][];
}

export interface LessonSection {
  heading: Lc;
  paragraphs?: Lc[];
  bullets?: Lc[];
  table?: LessonTable;
  code?: string;
}

export interface Lesson {
  id: string;
  category: Category;
  // Which test type the lesson applies to
  testType: "academic" | "general" | "both";
  order: number;
  title: Lc;
  summary: Lc;
  sections: LessonSection[];
  relatedQuestionTypes?: string[];
  estimatedMinutes?: number;
}

export interface VocabTopic {
  id: string;
  name: Lc;
  tags: string[];
  words: {
    word: string;
    pos: string;
    chinese: string;
    definition: string;
    example: string;
  }[];
}

export interface GrammarTopic {
  id: string;
  name: Lc;
  summary: Lc;
  sections: LessonSection[];
  commonErrors: Lc[];
  practiceSentences: { sentence: string; answer: string; explanation: Lc }[];
}

export interface StrategyLesson {
  id: string;
  skill: string;
  title: Lc;
  summary: Lc;
  steps: Lc[];
  commonMistakes: Lc[];
}
