// Shared helpers for Writing prompt content. All prompts are ORIGINAL
// IELTS-style practice material — never copied from Cambridge/BC/IDP sources.

import type { WritingPrompt, TestType, WritingTaskSubtype } from "@/types/ielts";

export function task2(
  id: string,
  testType: TestType,
  title: string,
  prompt: string,
  taskSubtype: WritingTaskSubtype,
): WritingPrompt {
  return { id, testType, task: 2, title, prompt, wordLimit: 250, suggestedMinutes: 40, sourceType: "ORIGINAL", taskSubtype };
}

export function academicTask1(
  id: string,
  title: string,
  prompt: string,
  stimulus: { visualType: string; visualDescription?: string; dataTable?: { columns: string[]; rows: string[][] } },
  academicVisualCategory: string,
): WritingPrompt {
  return {
    id,
    testType: "academic",
    task: 1,
    title,
    prompt,
    visualType: stimulus.visualType,
    visualDescription: stimulus.visualDescription,
    dataTable: stimulus.dataTable,
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
    academicVisualCategory,
  };
}

export function generalTask1(
  id: string,
  title: string,
  prompt: string,
  letterTone: "formal" | "semi_formal" | "informal",
  letterPurpose: string,
  requirements: [string, string, string],
): WritingPrompt {
  return {
    id,
    testType: "general",
    task: 1,
    title,
    prompt,
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
    letterTone,
    letterPurpose,
    letterRequirements: requirements,
  };
}

export const TASK1_STANDARD_INSTRUCTION =
  "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";

export const TASK1_PROCESS_INSTRUCTION =
  "Summarise the information by selecting and reporting the main features.";
