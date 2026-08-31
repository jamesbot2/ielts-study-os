// Zod schemas for AI evaluation output. Client-safe; used to validate any
// remote proxy response and as the contract for future proxy servers.

import { z } from "zod";

export const WritingCriterionSchema = z.object({
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

export const WritingEvaluationSchema = z.object({
  criterionScores: z.array(WritingCriterionSchema).min(4).max(5),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  sentenceLevelIssues: z.array(
    z.object({ sentence: z.string(), issue: z.string(), correction: z.string().optional() }),
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

export const SpeakingEvaluationSchema = z.object({
  criterionScores: z.array(
    z.object({
      criterion: z.enum(["fluencyCoherence", "lexicalResource", "grammaticalRange", "pronunciation"]),
      band: z.number().min(0).max(9),
      rationale: z.string(),
      supported: z.boolean(),
    }),
  ),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  grammarIssues: z.array(z.string()),
  betterVocabulary: z.array(z.object({ used: z.string(), suggestion: z.string() })),
  improvedVersions: z.array(z.object({ original: z.string(), improved: z.string() })),
  answerDevelopmentSuggestions: z.array(z.string()),
  weakestCriterion: z.enum(["fluencyCoherence", "lexicalResource", "grammaticalRange", "pronunciation"]),
  nextRecommendedDrills: z.array(z.string()),
});
