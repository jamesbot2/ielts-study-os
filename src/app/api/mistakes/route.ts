import { NextRequest, NextResponse } from "next/server";
import { listMistakes, updateMistake } from "@/lib/db/store";

export async function GET() {
  return NextResponse.json({ mistakes: listMistakes() });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as { id: string; mastery: string };
  updateMistake(body.id, { mastery: body.mastery } as never);
  return NextResponse.json({ ok: true });
}
