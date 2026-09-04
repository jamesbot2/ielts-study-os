// AI client abstraction for static mode.
//
// The browser NEVER holds application-owner secret API keys. It only knows a
// public remote proxy URL. Default is DisabledAiClient: the whole platform
// works without AI.

import type { WritingEvaluation, SpeakingEvaluation } from "@/types/ielts";
import type { CitationRef, ActionProposal, CoachStreamEvent } from "@/lib/coach/types";

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
  coachAgent(
    request: CoachAgentRequest,
    onEvent: (event: CoachStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<{ text: string; citations: CitationRef[]; actions: ActionProposal[] }>;
}

export interface CoachAgentRequest {
  conversationId?: string;
  message: string;
  learnerContext: unknown;
  pageContext?: unknown;
  locale: "en" | "zh";
  history?: { role: "user" | "assistant"; content: string }[];
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
  async coachAgent(): Promise<never> {
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

  /**
   * Attach the active runtime provider (BYOK) to a request payload. The active
   * provider metadata + session-only key travel with THIS request only; the
   * backend validates and uses it per request and never persists it.
   */
  private async withProvider<T extends object>(body: T): Promise<T & { provider?: unknown }> {
    const { getActiveProviderRequest } = await import("@/lib/ai/active-provider");
    const provider = await getActiveProviderRequest();
    if (!provider) return body;
    // Never send an empty apiKey field; omit when the user has not entered one
    // this session (the backend then uses its server fallback when configured).
    return {
      ...body,
      provider: provider.apiKey
        ? { baseUrl: provider.baseUrl, model: provider.model, apiKey: provider.apiKey, name: provider.name }
        : { baseUrl: provider.baseUrl, model: provider.model, name: provider.name },
    };
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
    const data = await this.post<{ evaluation: WritingEvaluation }>("/api/writing/evaluate", await this.withProvider(input));
    return data.evaluation;
  }

  async evaluateSpeaking(input: SpeakingEvalInput): Promise<SpeakingEvaluation> {
    const data = await this.post<{ evaluation: SpeakingEvaluation }>("/api/speaking/evaluate", await this.withProvider(input));
    return data.evaluation;
  }

  async chat(
    messages: ChatMessage[],
    onDelta: (delta: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const payload = await this.withProvider<{ messages: ChatMessage[] }>({ messages });
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  async coachAgent(
    request: CoachAgentRequest,
    onEvent: (event: CoachStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<{ text: string; citations: CitationRef[]; actions: ActionProposal[] }> {
    const payload = await this.withProvider(request);
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/api/coach/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI proxy returned ${res.status}: ${text.slice(0, 200)}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    const citations: CitationRef[] = [];
    const actions: ActionProposal[] = [];
    const emit = (event: CoachStreamEvent) => {
      onEvent(event);
      if (event.type === "delta") text += event.text;
      if (event.type === "citation") citations.push(event.citation);
      if (event.type === "action_proposal") actions.push(event.action);
    };
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          emit(JSON.parse(trimmed) as CoachStreamEvent);
        } catch {
          // Skip malformed lines; never crash the client.
        }
      }
    }
    if (buffer.trim()) {
      try { emit(JSON.parse(buffer.trim()) as CoachStreamEvent); } catch { /* ignore */ }
    }
    return { text, citations, actions };
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
