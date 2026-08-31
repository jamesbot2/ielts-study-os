import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAiConfigured, AiError } from "@/lib/ai";
import { evaluateWriting } from "@/lib/ai/evaluators/writing";
import { getWritingPrompt } from "@/lib/content/practice/writing-prompts";
import {
  createWritingSubmission,
  saveWritingEvaluation,
} from "@/lib/db/store";

const Body = z.object({
  promptId: z.string(),
  answer: z.string(),
  timeUsedSeconds: z.number().int().min(0).optional(),
});

export async function POST(req: NextRequest) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI is not configured. Add an API key in Settings." },
      { status: 503 },
    );
  }

  const body = Body.parse(await req.json());
  const prompt = getWritingPrompt(body.promptId);
  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  const wordCount = body.answer.trim() ? body.answer.trim().split(/\s+/).length : 0;

  const submission = createWritingSubmission(
    prompt.id,
    prompt.testType,
    prompt.task,
    body.answer,
    wordCount,
    body.timeUsedSeconds ?? null,
  );

  try {
    const evaluation = await evaluateWriting({
      testType: prompt.testType,
      task: prompt.task,
      prompt: prompt.prompt,
      visualDescription: prompt.visualDescription,
      dataTable: prompt.dataTable,
      answer: body.answer,
      wordCount,
      timeUsedSeconds: body.timeUsedSeconds,
    });
    saveWritingEvaluation(submission.id, evaluation, evaluation.generatedBy === "ai" ? undefined : undefined);
    return NextResponse.json({ submissionId: submission.id, evaluation });
  } catch (err) {
    const message = err instanceof AiError ? err.message : "AI evaluation failed";
    return NextResponse.json({ submissionId: submission.id, error: message }, { status: 502 });
  }
}
