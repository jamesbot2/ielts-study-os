// Deterministic transcript-based metrics. These are text features only and
// never imply audio-based pronunciation scoring.

import type { TranscriptMetrics } from "@/types/ielts";

const FILLERS = new Set([
  "um",
  "uh",
  "er",
  "erm",
  "ah",
  "hmm",
  "mmm",
  "like",
  "you know",
  "i mean",
  "well",
  "so",
  "actually",
  "basically",
  "kind of",
  "sort of",
]);

export function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function sentenceCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  const parts = t.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return parts.length || 1;
}

export function computeTranscriptMetrics(
  text: string,
  durationSeconds: number,
): TranscriptMetrics {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCountVal = words.length;
  const minutes = Math.max(durationSeconds / 60, 0.016); // avoid div by zero
  const wordsPerMinute = Math.round(wordCountVal / minutes);

  // fillers
  const lower = words.map((w) => w.toLowerCase().replace(/[^a-z' ]/g, ""));
  const fillerWords = lower.filter((w) => FILLERS.has(w));
  // count multiword fillers
  const joined = text.toLowerCase();
  const multiFillers = ["you know", "i mean", "kind of", "sort of"].filter((f) =>
    joined.includes(f),
  );
  const fillerCount = fillerWords.length + multiFillers.length;

  // repeated content words
  const freq = new Map<string, number>();
  for (const w of lower) {
    if (w.length <= 2) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const repeatedWords = [...freq.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // type-token ratio (vocabulary diversity)
  const unique = new Set(lower.filter((w) => w.length > 0));
  const vocabularyDiversity = wordCountVal
    ? Math.round((unique.size / wordCountVal) * 100) / 100
    : 0;

  const sentenceCountVal = sentenceCount(text);
  const avgSentenceLength = sentenceCountVal
    ? Math.round((wordCountVal / sentenceCountVal) * 10) / 10
    : 0;

  return {
    durationSeconds: Math.max(0, Math.round(durationSeconds)),
    wordCount: wordCountVal,
    wordsPerMinute,
    fillerCount,
    fillerWords: multiFillers,
    repeatedWords,
    vocabularyDiversity,
    sentenceCount: sentenceCountVal,
    avgSentenceLength,
  };
}

// A rough, honest fluency heuristics description from transcript metrics only.
export function transcriptFluencyHint(metrics: TranscriptMetrics): string {
  if (metrics.wordCount === 0) return "No speech detected.";
  const parts: string[] = [];
  if (metrics.wordsPerMinute < 90) parts.push("Speaking pace is slow for IELTS (aim ~120-150 WPM).");
  else if (metrics.wordsPerMinute > 200) parts.push("Speaking pace is very fast; watch clarity.");
  else parts.push("Speaking pace is within a typical IELTS range.");
  if (metrics.fillerCount > 8) parts.push("High filler usage; reduce hesitation fillers.");
  if (metrics.vocabularyDiversity < 0.5) parts.push("Limited lexical variety; paraphrase and avoid repetition.");
  return parts.join(" ");
}
