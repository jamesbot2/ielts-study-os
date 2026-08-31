import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMockAttempt, listMockAttempts } from "@/lib/db/store";

const CreateSchema = z.object({
  kind: z.string(),
  testType: z.enum(["academic", "general"]),
});

export async function GET() {
  return NextResponse.json({ attempts: listMockAttempts() });
}

export async function POST(req: NextRequest) {
  const body = CreateSchema.parse(await req.json());
  const id = createMockAttempt(body.kind, body.testType);
  return NextResponse.json({ attemptId: id }, { status: 201 });
}
