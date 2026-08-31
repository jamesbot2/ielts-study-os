import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAiConfigured, generateStructured, AiError } from "@/lib/ai";
import { createImportedMaterial } from "@/lib/db/store";

const GeneratedQuestion = z.object({
  type: z.enum([
    "multiple_choice",
    "true_false_not_given",
    "sentence_completion",
    "short_answer",
    "matching_headings",
  ]),
  prompt: z.string(),
  correctAnswer: z.string(),
  explanation: z.string(),
  evidence: z.string(),
  options: z.array(z.string()).optional(),
});

const GeneratedReading = z.object({
  title: z.string(),
  passage: z.string().min(100),
  difficulty: z.number().int().min(1).max(5),
  questions: z.array(GeneratedQuestion).min(3).max(10),
});

const Body = z.object({
  topic: z.string().min(2),
  testType: z.enum(["academic", "general"]),
  questionCount: z.number().int().min(3).max(10).optional(),
});

export async function POST(req: NextRequest) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI is not configured. Add an API key in Settings." },
      { status: 503 },
    );
  }
  const body = Body.parse(await req.json());

  try {
    const generated = await generateStructured(GeneratedReading, {
      system: `You create ORIGINAL IELTS-style reading practice material. The passage must be your own original writing, not copied from any source. All answers MUST be directly supported by the passage text, and the evidence field must quote the exact supporting sentence. Question types must follow IELTS rules.`,
      messages: [
        {
          role: "user",
          content: `Create an original ${body.testType} IELTS reading passage and ${body.questionCount ?? 5} questions about: ${body.topic}. Return JSON only.`,
        },
      ],
      temperature: 0.6,
      maxTokens: 3000,
    });

    // Answer-consistency check: every text answer must appear in the passage.
    const inconsistencies = generated.questions
      .filter(
        (q) =>
          !q.type.startsWith("multiple_choice") &&
          !generated.passage.toLowerCase().includes(q.correctAnswer.toLowerCase()),
      )
      .map((q) => q.correctAnswer);

    const material = createImportedMaterial({
      title: `${generated.title} (AI-generated)`,
      skill: "reading",
      testType: body.testType,
      sourceType: "AI_GENERATED",
      sourceName: "IELTS Study OS generator",
      license: "Original AI-generated content",
      copyrightStatus: "AI-generated, not an official IELTS question",
      format: "json",
      content: JSON.stringify({ ...generated, answerConsistency: inconsistencies.length === 0 }),
    });

    return NextResponse.json({
      materialId: material.id,
      generated,
      answerConsistencyIssues: inconsistencies,
      label: "AI-generated practice material — not an official IELTS question.",
    });
  } catch (err) {
    const message = err instanceof AiError ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
