// Aggregated Writing prompt library (Round 4). Content lives in ./writing/.

import type { WritingPrompt } from "@/types/ielts";
import { academicTask1Prompts } from "./writing/academic-task1";
import { generalTask1Prompts } from "./writing/general-task1";
import { task2Prompts } from "./writing/task2";

export const writingPrompts: WritingPrompt[] = [
  ...academicTask1Prompts,
  ...generalTask1Prompts,
  ...task2Prompts,
];

export function getWritingPrompt(id: string): WritingPrompt | undefined {
  return writingPrompts.find((p) => p.id === id);
}

export function getWritingPrompts(testType?: "academic" | "general", task?: 1 | 2): WritingPrompt[] {
  return writingPrompts.filter(
    (p) => (!testType || p.testType === testType) && (!task || p.task === task),
  );
}
