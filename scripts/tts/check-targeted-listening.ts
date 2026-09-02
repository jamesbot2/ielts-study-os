// Validation-only check: verifies scripts/tts/generated/targeted-listening.json
// matches the canonical audio.script data WITHOUT modifying anything.
// Run with: npm run tts:check   (exits non-zero on drift)

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTtsJobs } from "../../src/lib/content/practice/targeted/listening/tts-export";

const here = dirname(fileURLToPath(import.meta.url));
const committedPath = resolve(here, "generated/targeted-listening.json");

const canonical = buildTtsJobs();
const committed = JSON.parse(readFileSync(committedPath, "utf8"));

if (JSON.stringify(committed) !== JSON.stringify(canonical)) {
  console.error("TTS export drift detected: scripts/tts/generated/targeted-listening.json does not match canonical audio.script data.");
  console.error("Run `npm run tts:export` to regenerate it.");
  process.exit(1);
}
console.log(`tts:check OK — ${canonical.sets.length} jobs match canonical content.`);
