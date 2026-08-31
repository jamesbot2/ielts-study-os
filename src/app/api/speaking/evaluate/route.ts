import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAiConfigured, AiError } from "@/lib/ai";
import { evaluateSpeaking } from "@/lib/ai/evaluators/speaking";
import { computeTranscriptMetrics } from "@/lib/speech/metrics";
import {
  addSpeakingRecording,
  addSpeakingTranscript,
  createSpeakingSession,
  saveSpeakingEvaluation,
} from "@/lib/db/store";

const Body = z.object({
  part: z.number().int().min(1).max(3),
  prompt: z.string(),
  transcript: z.string(),
  durationSeconds: z.number().min(0),
  audioMetrics: z
    .object({
      pronunciationScore: z.number().optional(),
      confidence: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI is not configured. Add an API key in Settings." },
      { status: 503 },
    );
  }

  const body = Body.parse(await req.json());
  const metrics = computeTranscriptMetrics(body.transcript, body.durationSeconds);

  const sessionId = createSpeakingSession("practice", body.part, null);
  const recordingId = addSpeakingRecording(
    sessionId,
    body.part,
    body.prompt,
    null,
    body.durationSeconds || null,
  );
  addSpeakingTranscript(recordingId, body.transcript, "manual", metrics);

  try {
    const evaluation = await evaluateSpeaking({
      part: body.part as 1 | 2 | 3,
      prompt: body.prompt,
      transcript: body.transcript,
      metrics,
      audioMetrics: body.audioMetrics,
    });
    saveSpeakingEvaluation(sessionId, recordingId, evaluation);
    return NextResponse.json({ sessionId, metrics, evaluation });
  } catch (err) {
    const message = err instanceof AiError ? err.message : "AI evaluation failed";
    return NextResponse.json({ sessionId, metrics, error: message }, { status: 502 });
  }
}
