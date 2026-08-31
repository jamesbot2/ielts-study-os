import "server-only";
import { z } from "zod";
import { generateStructured } from "@/lib/ai";
import { writingBandFromCriteria, roundBand } from "@/lib/scoring/scoring";
import type { WritingEvaluation } from "@/types/ielts";

const CriterionScoreSchema = z.object({
  criterion: z.enum([
    "taskAchievement",
    "taskResponse",
    "coherenceCohesion",
    "lexicalResource",
    "grammaticalRange",
  ]),
  band: z.number().min(0).max(9),
  rationale: z.string(),
});

const WritingEvaluationSchema = z.object({
  criterionScores: z.array(CriterionScoreSchema).min(4).max(5),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  sentenceLevelIssues: z.array(
    z.object({
      sentence: z.string(),
      issue: z.string(),
      correction: z.string().optional(),
    }),
  ),
  grammarIssues: z.array(z.string()),
  lexicalIssues: z.array(z.string()),
  coherenceIssues: z.array(z.string()),
  taskResponseIssues: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  suggestedCorrections: z.array(z.string()),
  improvedSentences: z.array(
    z.object({ original: z.string(), improved: z.string(), reason: z.string() }),
  ),
  vocabularySuggestions: z.array(
    z.object({ word: z.string(), suggestion: z.string(), reason: z.string() }),
  ),
  nextPracticeTargets: z.array(z.string()),
  examinerStyleSummary: z.string(),
  bandGapAnalysis: z.string(),
});

export interface WritingEvaluationInput {
  testType: "academic" | "general";
  task: 1 | 2;
  prompt: string;
  visualDescription?: string;
  dataTable?: { columns: string[]; rows: string[][] };
  answer: string;
  wordCount: number;
  timeUsedSeconds?: number;
}

function buildSystemPrompt(input: WritingEvaluationInput): string {
  const task1Criterion =
    input.testType === "academic" ? "Task Achievement" : "Task Achievement";
  const taskCriterion = input.task === 1 ? task1Criterion : "Task Response";
  const taskLabel = `Writing Task ${input.task} (${input.testType === "academic" ? "Academic" : "General Training"})`;

  return `You are a highly experienced IELTS Writing examiner. You evaluate student writing strictly against the OFFICIAL public IELTS band descriptors. You never invent your own criteria.

${taskLabel}
Primary task criterion: ${taskCriterion}
The four official criteria are:
1. ${taskCriterion}
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

The prompt is provided in the user message, together with the student's answer.

IMPORTANT RULES:
- Anchor every band judgement in the official public band descriptors (0-9) for each criterion.
- Return band scores as whole numbers or half bands (e.g. 6.0, 6.5, 7.0).
- Be specific and constructive. Quote the student's own sentences where relevant.
- The bandGapAnalysis field must explain concretely what separates this response from the NEXT HALF BAND up (e.g. Band 6 -> Band 6.5).
- "estimatedOverallBand" is computed separately by deterministic code; you only return criterionScores.
- Do not claim the score is an official IELTS score.
- All free-text fields should be written in a professional examiner tone.

Return ONLY valid JSON with exactly these fields:
{
  "criterionScores": [{"criterion": "...", "band": number, "rationale": "..."}],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "sentenceLevelIssues": [{"sentence": "...", "issue": "...", "correction": "..."}],
  "grammarIssues": ["..."],
  "lexicalIssues": ["..."],
  "coherenceIssues": ["..."],
  "taskResponseIssues": ["..."],
  "missingRequirements": ["..."],
  "suggestedCorrections": ["..."],
  "improvedSentences": [{"original": "...", "improved": "...", "reason": "..."}],
  "vocabularySuggestions": [{"word": "...", "suggestion": "...", "reason": "..."}],
  "nextPracticeTargets": ["..."],
  "examinerStyleSummary": "...",
  "bandGapAnalysis": "..."
}`;
}

function buildUserPrompt(input: WritingEvaluationInput): string {
  const visual = input.visualDescription
    ? `\nTask 1 visual description:\n${input.visualDescription}`
    : "";
  const table = input.dataTable
    ? `\nTask 1 data table:\n${JSON.stringify(input.dataTable)}`
    : "";
  return `PROMPT (${input.task === 1 ? "Task 1" : "Task 2"}):
${input.prompt}
${visual}${table}

STUDENT ANSWER (${input.wordCount} words):
${input.answer}

Evaluate this answer.`;
}

export async function evaluateWriting(
  input: WritingEvaluationInput,
): Promise<WritingEvaluation> {
  const result = await generateStructured(WritingEvaluationSchema, {
    system: buildSystemPrompt(input),
    messages: [{ role: "user", content: buildUserPrompt(input) }],
    temperature: 0.2,
    maxTokens: 3000,
  });

  // Deterministic combination: criterion bands -> single band via the
  // official equal-weight rule (Task 1: TA+CC+LR+GRA; Task 2: TR+CC+LR+GRA).
  const overallBand = writingBandFromCriteria(result.criterionScores, input.task);

  return {
    id: crypto.randomUUID(),
    estimatedOverallBand: overallBand,
    criterionScores: result.criterionScores.map((c) => ({
      criterion: c.criterion,
      band: c.band,
      rationale: c.rationale,
    })),
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    sentenceLevelIssues: result.sentenceLevelIssues,
    grammarIssues: result.grammarIssues,
    lexicalIssues: result.lexicalIssues,
    coherenceIssues: result.coherenceIssues,
    taskResponseIssues: result.taskResponseIssues,
    missingRequirements: result.missingRequirements,
    suggestedCorrections: result.suggestedCorrections,
    improvedSentences: result.improvedSentences,
    vocabularySuggestions: result.vocabularySuggestions,
    nextPracticeTargets: result.nextPracticeTargets,
    examinerStyleSummary: result.examinerStyleSummary,
    bandGapAnalysis: result.bandGapAnalysis,
    generatedBy: "ai",
  };
}

// Estimated band helper exposed for UI hints (deterministic, no AI).
export function estimateWritingBandFromCriteria(
  criteria: { criterion: string; band: number }[],
  task: 1 | 2,
): number {
  return writingBandFromCriteria(criteria as never, task);
}

export { roundBand };
