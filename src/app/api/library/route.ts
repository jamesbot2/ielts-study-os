import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createImportedMaterial,
  getImportedMaterial,
  listImportedMaterials,
} from "@/lib/db/store";

const ImportInput = z.object({
  title: z.string().min(1),
  skill: z.enum(["listening", "reading", "writing", "speaking", "vocabulary", "grammar"]),
  testType: z.enum(["academic", "general", "both"]),
  sourceType: z.enum(["ORIGINAL", "AI_GENERATED", "OPEN_LICENSED", "USER_IMPORTED"]),
  sourceName: z.string().optional(),
  sourceReference: z.string().optional(),
  license: z.string().optional(),
  copyrightStatus: z.string().optional(),
  format: z.string(),
  content: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ materials: listImportedMaterials() });
}

export async function POST(req: NextRequest) {
  const input = ImportInput.parse(await req.json());
  const material = createImportedMaterial({
    title: input.title,
    skill: input.skill,
    testType: input.testType,
    sourceType: input.sourceType,
    sourceName: input.sourceName,
    sourceReference: input.sourceReference,
    license: input.license,
    copyrightStatus: input.copyrightStatus,
    format: input.format,
    content: input.content,
  });
  return NextResponse.json({ material }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  // Deletion is intentionally limited to imported material (no hard delete of other rows)
  const row = getImportedMaterial(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { getDb } = await import("@/lib/db/db");
  getDb().prepare("DELETE FROM imported_materials WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
