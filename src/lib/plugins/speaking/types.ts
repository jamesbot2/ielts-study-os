// Speaking / speech provider interfaces (foundation only).
// No full Speaking Examiner or speech implementation is built in V0.5.

import type { PluginHealth } from "../types";

export interface SpeechToTextProvider {
  id: string;
  name: string;
  transcribe(audio: Blob, options?: { language?: string }): Promise<{ transcript: string; language?: string }>;
}

export interface TextToSpeechProvider {
  id: string;
  name: string;
  synthesize(text: string, options?: { voice?: string }): Promise<ArrayBuffer>;
}

export interface PronunciationProvider {
  id: string;
  name: string;
  assess(audio: Blob, referenceText: string): Promise<{ overall: number }>;
}

export interface SpeakingEvaluationProvider {
  id: string;
  name: string;
  evaluate(input: { part: number; prompt: string; transcript: string }): Promise<unknown>;
  healthCheck(): Promise<PluginHealth>;
}

export interface SpeakingPromptProvider {
  id: string;
  name: string;
  listPrompts(part: 1 | 2 | 3): Promise<{ prompt: string }[]>;
}
