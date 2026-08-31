import { NextRequest, NextResponse } from "next/server";
import { getLessonProgress, setLessonProgress } from "@/lib/db/store";

export async function GET() {
  return NextResponse.json({ progress: getLessonProgress() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { lessonId: string; status: string };
  setLessonProgress(body.lessonId, body.status);
  return NextResponse.json({ ok: true });
}
