// AI provider abstraction. Server-side only; API keys never reach the browser.

export interface AiConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  // Optional two-pass critic for evaluation agents
  enableCritic: boolean;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}

export interface AiProvider {
  name: string;
  generateText(opts: GenerateOptions): Promise<string>;
}

export class AiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

// OpenAI-compatible chat completions provider. Works with OpenAI, DeepSeek,
// OpenRouter, xAI, Google (via OpenAI-compat), and local endpoints (LM Studio,
// Ollama, vLLM, etc.).
export class OpenAICompatibleProvider implements AiProvider {
  constructor(
    public readonly name: string,
    private readonly config: AiConfig,
  ) {}

  async generateText(opts: GenerateOptions): Promise<string> {
    const url = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs || 60_000,
    );

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: opts.messages,
          temperature: opts.temperature ?? this.config.temperature,
          max_tokens: opts.maxTokens ?? this.config.maxTokens,
          ...(opts.json ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new AiError(
          `Provider ${this.name} returned ${res.status}: ${body.slice(0, 300)}`,
          res.status,
        );
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new AiError(`Provider ${this.name} returned empty content`);
      return content;
    } catch (err) {
      if (err instanceof AiError) throw err;
      if ((err as Error).name === "AbortError") {
        throw new AiError(`Provider ${this.name} timed out`);
      }
      throw new AiError(`Provider ${this.name} request failed: ${(err as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
