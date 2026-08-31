// Prompt builders for AI evaluation. Client-safe. These are the reference
// contract for any remote AI proxy: the proxy runs these prompts server-side
// with its own key and returns the validated structured output.

import type { WritingEvalInput, SpeakingEvalInput, ChatMessage } from "./client";

export function buildWritingSystemPrompt(input: WritingEvalInput): string {
  const taskCriterion = input.task === 1 ? "Task Achievement" : "Task Response";
  const taskLabel = `Writing Task ${input.task} (${input.testType === "academic" ? "Academic" : "General Training"})`;
  return `You are a highly experienced IELTS Writing examiner. You evaluate student writing strictly against the OFFICIAL public IELTS band descriptors. You never invent your own criteria.

${taskLabel}
Primary task criterion: ${taskCriterion}
The four official criteria are:
1. ${taskCriterion}
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

The prompt and the student's answer are in the user message.

RULES:
- Anchor every band judgement in the official public band descriptors (0-9).
- Return whole or half bands (e.g. 6.0, 6.5, 7.0).
- Be specific; quote the student's own sentences where relevant.
- "bandGapAnalysis" must explain concretely what separates this response from the NEXT HALF BAND up.
- Do NOT return "estimatedOverallBand"; deterministic code computes it from criterionScores.
- Do not claim the score is an official IELTS score.

Return ONLY valid JSON.`;
}

export function buildWritingUserPrompt(input: WritingEvalInput): string {
  const visual = input.visualDescription
    ? `\nTask 1 visual description:\n${input.visualDescription}`
    : "";
  const table = input.dataTable ? `\nTask 1 data table:\n${JSON.stringify(input.dataTable)}` : "";
  return `PROMPT (${input.task === 1 ? "Task 1" : "Task 2"}):\n${input.prompt}${visual}${table}

STUDENT ANSWER (${input.wordCount} words):
${input.answer}

Evaluate this answer.`;
}

export function buildSpeakingSystemPrompt(input: SpeakingEvalInput): string {
  const hasPronunciation = Boolean(
    (input.audioMetrics as { pronunciationScore?: number } | undefined)?.pronunciationScore != null,
  );
  return `You are a highly experienced IELTS Speaking examiner. Evaluate against the OFFICIAL public IELTS band descriptors for:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation

RULES:
- Anchor every band in the official descriptors. Use whole or half bands.
- "pronunciation" MUST have "supported": ${hasPronunciation}. If false, band = 0 and rationale = "not evaluated".
- ${hasPronunciation ? "A separate audio engine measured pronunciation; incorporate it cautiously." : "Pronunciation is NOT evaluated (no audio analysis). Never fabricate a pronunciation score from text."}
- Quote the student's own phrases in feedback.
- Do NOT return "estimatedOverallBand"; deterministic code computes it from supported criterionScores.

Return ONLY valid JSON.`;
}

export function buildSpeakingUserPrompt(input: SpeakingEvalInput): string {
  const metricsText = JSON.stringify(input.metrics, null, 2);
  return `PART ${input.part} PROMPT:\n${input.prompt}\n\nTRANSCRIPT:\n${input.transcript}\n\nTRANSCRIPT METRICS:\n${metricsText}`;
}

export function buildCoachSystemPrompt(ctx: {
  targetBand: number | null;
  testType: string;
  currentBand: number | null;
  testDate: string | null;
  weakSkills: string[];
}): string {
  const parts: string[] = [
    "You are a patient, expert IELTS coach. You help the learner understand questions, strategies, vocabulary, grammar, and their own mistakes.",
    "You are NOT an official examiner; never claim to issue official scores.",
  ];
  parts.push(
    `Learner context: test type = ${ctx.testType}, target band = ${ctx.targetBand ?? "unknown"}, current estimated band = ${ctx.currentBand ?? "unknown"}.`,
  );
  if (ctx.testDate) parts.push(`Test date = ${ctx.testDate}.`);
  if (ctx.weakSkills.length) parts.push(`Weakest skills = ${ctx.weakSkills.join(", ")}.`);
  parts.push("Answer in the learner's preferred language when they write in Chinese; otherwise answer in English. Be concise and specific.");
  return parts.join("\n");
}

export type { ChatMessage };
