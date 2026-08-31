import "server-only";
import { z } from "zod";
import { generateStructured } from "@/lib/ai";
import { speakingBandFromCriteria } from "@/lib/scoring/scoring";
import type {
  SpeakingEvaluation,
  TranscriptMetrics,
  AudioMetrics,
} from "@/types/ielts";

const SpeakingEvaluationSchema = z.object({
  criterionScores: z.array(
    z.object({
      criterion: z.enum([
        "fluencyCoherence",
        "lexicalResource",
        "grammaticalRange",
        "pronunciation",
      ]),
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
  weakestCriterion: z.enum([
    "fluencyCoherence",
    "lexicalResource",
    "grammaticalRange",
    "pronunciation",
  ]),
  nextRecommendedDrills: z.array(z.string()),
});

export interface SpeakingEvaluationInput {
  part: 1 | 2 | 3;
  prompt: string;
  transcript: string;
  metrics: TranscriptMetrics;
  audioMetrics?: AudioMetrics;
}

export async function evaluateSpeaking(
  input: SpeakingEvaluationInput,
): Promise<SpeakingEvaluation> {
  const hasPronunciation = Boolean(
    input.audioMetrics?.pronunciationScore != null,
  );

  const system = `You are a highly experienced IELTS Speaking examiner. You evaluate against the OFFICIAL public IELTS band descriptors for:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation

RULES:
- Anchor every band in the official descriptors. Use whole or half bands.
- "pronunciation" MUST have "supported": ${hasPronunciation}. If false, set band to 0 and write "not evaluated".
- ${hasPronunciation ? "A separate audio engine measured pronunciation; incorporate it cautiously." : "Pronunciation is NOT evaluated (no audio analysis). Never fabricate a pronunciation score from text."}
- The transcript metrics (WPM, fillers, vocabulary diversity) are provided and may inform Fluency/Coherence and Lexical Resource, but you are the examiner.
- Quote the student's own phrases in feedback.
- "estimatedOverallBand" is computed by deterministic code; you only return criterionScores.
- Do not claim the score is official.

Return ONLY valid JSON with exactly these fields:
{
  "criterionScores": [{"criterion": "...", "band": number, "rationale": "...", "supported": boolean}],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "grammarIssues": ["..."],
  "betterVocabulary": [{"used": "...", "suggestion": "..."}],
  "improvedVersions": [{"original": "...", "improved": "..."}],
  "answerDevelopmentSuggestions": ["..."],
  "weakestCriterion": "fluencyCoherence" | "lexicalResource" | "grammaticalRange" | "pronunciation",
  "nextRecommendedDrills": ["..."]
}`;

  const metricsText = JSON.stringify(input.metrics, null, 2);

  const result = await generateStructured(SpeakingEvaluationSchema, {
    system,
    messages: [
      {
        role: "user",
        content: `PART ${input.part} PROMPT:\n${input.prompt}\n\nTRANSCRIPT:\n${input.transcript}\n\nTRANSCRIPT METRICS:\n${metricsText}`,
      },
    ],
    temperature: 0.2,
    maxTokens: 2500,
  });

  // Deterministic combination of the four equally-weighted criteria.
  const supportedCriteria = result.criterionScores
    .filter((c) => c.supported)
    .map((c) => c.band);
  const overallBand = speakingBandFromCriteria(supportedCriteria);

  return {
    id: crypto.randomUUID(),
    estimatedOverallBand: overallBand,
    criterionScores: result.criterionScores.map((c) => ({
      criterion: c.criterion,
      band: c.band,
      rationale: c.rationale,
      supported: c.supported,
    })),
    transcriptMetrics: input.metrics,
    audioMetrics: input.audioMetrics,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    grammarIssues: result.grammarIssues,
    betterVocabulary: result.betterVocabulary,
    improvedVersions: result.improvedVersions,
    answerDevelopmentSuggestions: result.answerDevelopmentSuggestions,
    weakestCriterion: result.weakestCriterion,
    nextRecommendedDrills: result.nextRecommendedDrills,
    generatedBy: "ai",
  };
}
