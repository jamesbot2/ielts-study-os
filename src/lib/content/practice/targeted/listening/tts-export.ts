// Pure builder for the TTS job JSON, derived from canonical PracticeSet
// audio.script data. Shared by the CLI script and drift-check tests so the
// generated JSON can never silently drift from the TypeScript content.

import { targetedListeningSets } from "./index";

export interface TtsJobLine {
  speaker: string;
  voice: string;
  text: string;
}

export interface TtsJobPart {
  part: number;
  title: string;
  lines: TtsJobLine[];
}

export interface TtsJob {
  setId: string;
  parts: TtsJobPart[];
}

export function buildTtsJobs(): { sets: TtsJob[] } {
  const sets = targetedListeningSets
    .filter((s) => s.audio?.script && s.audio.script.length > 0)
    .map((set) => {
      const script = set.audio!.script!;
      const parts: TtsJobPart[] = script.map((p) => ({
        part: p.part,
        title: set.meta.title,
        lines: p.lines.map((l) => ({ speaker: l.speaker, voice: l.voice ?? "en_US-lessac-medium", text: l.text })),
      }));
      return { setId: set.meta.id, parts };
    });
  return { sets };
}
