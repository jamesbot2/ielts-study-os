// Derives the TTS job JSON from the canonical PracticeSet audio.script data.
// Run with: npm run tts:export
//
// This guarantees script content and generated audio input never drift: the
// TypeScript content is the single source of truth.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { targetedListeningSets } from "../../src/lib/content/practice/targeted/listening";

const here = dirname(fileURLToPath(import.meta.url));

interface JobPart {
  part: number;
  title: string;
  lines: { speaker: string; voice: string; text: string }[];
}

const sets = targetedListeningSets
  .filter((s) => s.audio?.script && s.audio.script.length > 0)
  .map((set) => {
    const script = set.audio!.script!;
    const parts: JobPart[] = script.map((p) => ({
      part: p.part,
      title: set.meta.title,
      lines: p.lines.map((l) => ({ speaker: l.speaker, voice: l.voice ?? "en_US-lessac-medium", text: l.text })),
    }));
    return { setId: set.meta.id, parts };
  });

const outDir = resolve(here, "generated");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "targeted-listening.json");
writeFileSync(outPath, JSON.stringify({ sets }, null, 2) + "\n", "utf8");
console.log(`Wrote ${sets.length} listening TTS jobs → ${outPath}`);
