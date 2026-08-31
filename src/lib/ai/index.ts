import "server-only";
import { z, type ZodType } from "zod";
import { getSetting } from "@/lib/db/db";
import {
  AiError,
  OpenAICompatibleProvider,
  type AiConfig,
  type AiProvider,
  type ChatMessage,
  type GenerateOptions,
} from "./provider";

export type { AiConfig, AiProvider, ChatMessage, GenerateOptions };
export { AiError };

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: "openai-compatible",
  baseUrl: process.env.AI_BASE_URL || "https://api.openai.com/v1",
  apiKey: "",
  model: process.env.AI_MODEL || "gpt-4o-mini",
  temperature: 0.4,
  maxTokens: 2048,
  timeoutMs: 60_000,
  enableCritic: false,
};

// Configuration precedence: server-side settings (DB) override env placeholders.
export function getAiConfig(): AiConfig {
  const stored = getSetting<Partial<AiConfig>>("ai_config");
  const envKey = process.env.AI_API_KEY || "";
  const envBase = process.env.AI_BASE_URL;
  const envModel = process.env.AI_MODEL;

  const merged: AiConfig = {
    ...DEFAULT_AI_CONFIG,
    ...(stored ?? {}),
    ...(envBase ? { baseUrl: envBase } : {}),
    ...(envModel ? { model: envModel } : {}),
    // env key only fills in if the stored key is empty
    apiKey: stored?.apiKey || envKey,
  };
  return merged;
}

export function isAiConfigured(): boolean {
  return getAiConfig().apiKey.trim().length > 0;
}

export function getProvider(): AiProvider {
  const config = getAiConfig();
  if (!config.apiKey.trim()) {
    throw new AiError("AI is not configured. Add an API key in Settings.");
  }
  return new OpenAICompatibleProvider(config.provider, config);
}

export async function generateText(opts: GenerateOptions): Promise<string> {
  return getProvider().generateText(opts);
}

export async function generateStructured<T>(
  schema: ZodType<T>,
  opts: GenerateOptions & { system?: string },
  retries = 1,
): Promise<T> {
  const messages: ChatMessage[] = [
    ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
    ...opts.messages,
  ];
  const fullOpts: GenerateOptions = { ...opts, messages, json: true };

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await generateText(fullOpts);
      const parsed = JSON.parse(extractJson(raw));
      return schema.parse(parsed);
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        // append a corrective hint and retry
        fullOpts.messages = [
          ...messages,
          {
            role: "assistant",
            content: "I need to fix my previous JSON output.",
          },
          {
            role: "user",
            content: `Your previous output was invalid: ${
              (err as Error).message
            }. Return ONLY valid JSON matching the requested schema.`,
          },
        ];
      }
    }
  }
  throw new AiError(
    `Structured generation failed after ${retries + 1} attempts: ${(lastError as Error).message}`,
  );
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;
  // strip markdown fences if present
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

// Streaming support (for coach). Returns an async iterable of text deltas.
export async function* streamText(opts: GenerateOptions): AsyncGenerator<string> {
  const config = getAiConfig();
  if (!config.apiKey.trim()) {
    throw new AiError("AI is not configured. Add an API key in Settings.");
  }
  const url = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: opts.messages,
      temperature: opts.temperature ?? config.temperature,
      max_tokens: opts.maxTokens ?? config.maxTokens,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new AiError(`Provider returned ${res.status}: ${body.slice(0, 300)}`, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const parsed = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore malformed keep-alive lines
      }
    }
  }
}

export function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}
