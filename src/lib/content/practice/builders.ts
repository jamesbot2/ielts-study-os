import type {
  BaseQuestion,
  ChoiceQuestion,
  MatchingQuestion,
  Question,
  QuestionOption,
  QuestionType,
  TextQuestion,
} from "@/types/ielts";

let counter = 0;
export function nextId(prefix = "q"): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

interface BaseArgs {
  id?: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  evidence?: string;
  skillTags?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  bandRange?: { min: number; max: number };
  passageId?: string;
  markerId?: string;
}

function base(args: BaseArgs): BaseQuestion {
  return {
    id: args.id ?? nextId(),
    type: args.type,
    answerType: "text",
    prompt: args.prompt,
    explanation: args.explanation,
    evidence: args.evidence,
    skillTags: args.skillTags ?? [],
    markerId: args.markerId,
    difficulty: args.difficulty ?? 3,
    bandRange: args.bandRange ?? { min: 5, max: 8 },
    passageId: args.passageId,
  };
}

export function textQ(
  args: BaseArgs & { correctAnswer: string; acceptableAnswers?: string[]; wordLimit?: number; number?: boolean; allowNumber?: boolean },
): TextQuestion {
  return {
    ...base(args),
    answerType: args.number ? "number" : "text",
    correctAnswer: args.correctAnswer,
    acceptableAnswers: args.acceptableAnswers,
    wordLimit: args.wordLimit,
    allowNumber: args.allowNumber,
  };
}

export function choiceQ(
  args: BaseArgs & {
    options: [string, string][]; // [label, text]
    correct: string[];
    multiple?: boolean;
    selectCount?: number;
  },
): ChoiceQuestion {
  const options: QuestionOption[] = args.options.map(([label, text]) => ({
    id: label,
    label,
    text,
  }));
  return {
    ...base(args),
    answerType: args.multiple ? "multiple_choice" : "single_choice",
    options,
    correctAnswers: args.correct,
    selectCount: args.selectCount,
  };
}

export function matchingQ(
  args: BaseArgs & {
    options: [string, string][]; // [label, text]
    items: [string, string, string][]; // [itemId, itemText, correctOptionId]
    heading?: boolean;
  },
): MatchingQuestion {
  const options: QuestionOption[] = args.options.map(([label, text]) => ({
    id: label,
    label,
    text,
  }));
  return {
    ...base(args),
    answerType: args.heading ? "heading_matching" : "matching",
    options,
    items: args.items.map(([id, text, correctOptionId]) => ({
      id,
      text,
      correctOptionId,
    })),
  };
}

// Build a full practice set wrapper.
export function buildSet<T extends Question>(
  questions: T[],
): T[] {
  return questions;
}

export type { Question };
