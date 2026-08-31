// AI client abstraction for static mode.
//
// The browser NEVER holds application-owner secret API keys. It only knows a
// public remote proxy URL. Default is DisabledAiClient: the whole platform
// works without AI.

import type { WritingEvaluation, SpeakingEvaluation } from "@/types/ielts";

export interface WritingEvalInput {
  testType: "academic" | "general";
  task: 1 | 2;
  prompt: string;
  visualDescription?: string;
  dataTable?: { columns: string[]; rows: string[][] };
  answer: string;
  wordCount: number;
  timeUsedSeconds?: number;
}

export interface SpeakingEvalInput {
  part: 1 | 2 | 3;
  prompt: string;
  transcript: string;
  metrics: unknown;
  audioMetrics?: unknown;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiClient {
  readonly available: boolean;
  readonly name: string;
  evaluateWriting(input: WritingEvalInput): Promise<WritingEvaluation>;
  evaluateSpeaking(input: SpeakingEvalInput): Promise<SpeakingEvaluation>;
  chat(
    messages: ChatMessage[],
    onDelta: (delta: string) => void,
    signal?: AbortSignal,
  ): Promise<string>;
}

export class AiUnavailableError extends Error {
  constructor() {
    super("AI is not configured. Connect an AI backend in Settings to enable this feature.");
    this.name = "AiUnavailableError";
  }
}

export class DisabledAiClient implements AiClient {
  readonly available = false;
  readonly name = "disabled";
  async evaluateWriting(): Promise<WritingEvaluation> {
    throw new AiUnavailableError();
  }
  async evaluateSpeaking(): Promise<SpeakingEvaluation> {
    throw new AiUnavailableError();
  }
  async chat(): Promise<string> {
    throw new AiUnavailableError();
  }
}

// Calls a trusted remote proxy. The proxy is responsible for holding the
// real provider key server-side and must return already-validated JSON.
export class RemoteAiProxyClient implements AiClient {
  readonly available = true;
  readonly name = "remote-proxy";

  constructor(private readonly baseUrl: string) {
    if (!baseUrl) throw new Error("Remote AI proxy URL is empty");
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI proxy returned ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  }

  async evaluateWriting(input: WritingEvalInput): Promise<WritingEvaluation> {
    const data = await this.post<{ evaluation: WritingEvaluation }>("/api/writing/evaluate", input);
    return data.evaluation;
  }

  async evaluateSpeaking(input: SpeakingEvalInput): Promise<SpeakingEvaluation> {
    const data = await this.post<{ evaluation: SpeakingEvaluation }>("/api/speaking/evaluate", input);
    return data.evaluation;
  }

  async chat(
    messages: ChatMessage[],
    onDelta: (delta: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI proxy returned ${res.status}: ${text.slice(0, 200)}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      acc += chunk;
      onDelta(chunk);
    }
    return acc;
  }
}

let client: AiClient = new DisabledAiClient();

// Minimal subscriber list so UI can react to AI availability changes.
type Listener = () => void;
const listeners = new Set<Listener>();

export function configureAiClient(next: AiClient): void {
  client = next;
  listeners.forEach((l) => l());
}

export function getAiClient(): AiClient {
  return client;
}

export function isAiAvailable(): boolean {
  return client.available;
}

export function subscribeAiClient(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
