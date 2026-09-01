// Deterministic knowledge export: turns the typed TS curriculum into a
// backend-ingestible JSON document. Run with: npm run knowledge:export
//
// Copyright rule: this exports ONLY IELTS Study OS original content and the
// source/provenance registry (metadata). It never exports copyrighted
// official/Cambridge material.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { allLessons } from "../src/lib/content/curriculum";
import { sources } from "../src/lib/content/sources";

const here = dirname(fileURLToPath(import.meta.url));

function skillFor(category: string): string {
  return ["reading", "listening", "writing", "speaking", "grammar", "vocabulary"].includes(category)
    ? category
    : "all";
}

const lessons = allLessons.map((l) => ({
  id: l.id,
  title: l.title,
  summary: l.summary,
  category: l.category,
  testType: l.testType,
  skill: skillFor(l.category),
  relatedQuestionTypes: l.relatedQuestionTypes ?? [],
  estimatedMinutes: l.estimatedMinutes ?? null,
  difficulty: l.difficulty ?? null,
  sourceIds: l.sourceIds ?? [],
  sections: l.sections.map((s) => ({
    heading: s.heading,
    paragraphs: s.paragraphs ?? [],
    bullets: s.bullets ?? [],
    table: s.table ?? null,
    callouts: (s.callouts ?? []).map((c) => ({
      kind: c.kind,
      title: c.title ?? null,
      text: c.text ?? [],
      items: c.items ?? [],
    })),
  })),
}));

const output = {
  format: "ielts-study-os-knowledge-v1",
  generatedAt: new Date().toISOString(),
  sources: sources.map((s) => ({
    id: s.id,
    provider: s.provider,
    title: s.title,
    url: s.url,
    official: s.official,
    type: s.type,
    lastVerified: s.lastVerified,
    notes: s.notes,
  })),
  lessons,
};

const outDir = resolve(here, "../knowledge/generated");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "ielts-study-os.json");
writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Wrote ${lessons.length} lessons + ${sources.length} sources → ${outPath}`);
