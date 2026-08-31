import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/db";

const TABLES = [
  "settings",
  "lesson_progress",
  "vocabulary_cards",
  "vocabulary_reviews",
  "practice_attempts",
  "question_attempts",
  "mistakes",
  "writing_submissions",
  "writing_evaluations",
  "speaking_sessions",
  "speaking_recordings",
  "speaking_transcripts",
  "speaking_evaluations",
  "mock_attempts",
  "mock_sections",
  "ai_conversations",
  "ai_messages",
  "study_tasks",
  "imported_materials",
];

export async function GET() {
  const db = getDb();
  const dump: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    try {
      dump[table] = db.prepare(`SELECT * FROM ${table}`).all() as unknown[];
    } catch {
      dump[table] = [];
    }
  }
  return new NextResponse(JSON.stringify(dump, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="ielts-study-os-export.json"',
    },
  });
}
