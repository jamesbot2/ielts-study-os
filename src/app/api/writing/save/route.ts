import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWritingSubmission } from "@/lib/db/store";
import { getWritingPrompt } from "@/lib/content/practice/writing-prompts";

const Body = z.object({
  promptId: z.string(),
  answer: z.string(),
  timeUsedSeconds: z.number().int().min(0).optional(),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const prompt = getWritingPrompt(body.promptId);
  if (!prompt) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  const wordCount = body.answer.trim() ? body.answer.trim().split(/\s+/).length : 0;
  const submission = createWritingSubmission(
    prompt.id,
    prompt.testType,
    prompt.task,
    body.answer,
    wordCount,
    body.timeUsedSeconds ?? null,
  );
  return NextResponse.json({ submissionId: submission.id }, { status: 201 });
}
