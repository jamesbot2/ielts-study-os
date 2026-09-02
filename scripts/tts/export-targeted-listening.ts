// CLI wrapper: writes the TTS job JSON. Run with: npm run tts:export
//
// Canonical source of truth = PracticeSet audio.script (see tts-export.ts).
// Do not hand-edit the generated JSON.

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTtsJobs } from "../../src/lib/content/practice/targeted/listening/tts-export";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "generated");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "targeted-listening.json");

const jobs = buildTtsJobs();
writeFileSync(outPath, JSON.stringify(jobs, null, 2) + "\n", "utf8");

// Verify the written file matches what we just built (round-trip guard).
const onDisk = JSON.parse(readFileSync(outPath, "utf8"));
if (JSON.stringify(onDisk) !== JSON.stringify(jobs)) {
  throw new Error("TTS export round-trip mismatch");
}
console.log(`Wrote ${jobs.sets.length} listening TTS jobs → ${outPath}`);
