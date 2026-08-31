import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createStudyTask,
  deleteStudyTask,
  listStudyTasks,
  updateStudyTask,
} from "@/lib/db/store";

export async function GET() {
  return NextResponse.json({ tasks: listStudyTasks() });
}

export async function POST(req: NextRequest) {
  const body = z
    .object({
      title: z.string().min(1),
      category: z.string(),
      scheduledFor: z.string().optional(),
    })
    .parse(await req.json());
  const task = createStudyTask(body.title, body.category, body.scheduledFor);
  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    id: string;
    title?: string;
    category?: string;
    scheduledFor?: string | null;
    completed?: number;
  };
  updateStudyTask(body.id, body as never);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) deleteStudyTask(id);
  return NextResponse.json({ ok: true });
}
