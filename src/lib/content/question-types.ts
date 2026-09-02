// Canonical question-type definitions. Neutral module: imported by BOTH
// coverage.ts and validate.ts to avoid circular dependencies.

import type { QuestionType } from "@/types/ielts";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
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
