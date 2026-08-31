import { NextRequest, NextResponse } from "next/server";
import { OpenAICompatibleProvider, AiError } from "@/lib/ai/provider";
import { getAiConfig } from "@/lib/ai";

// Test the configured AI provider without storing anything new.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { apiKey?: string };
  const config = getAiConfig();
  const apiKey = body.apiKey?.trim() || config.apiKey;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "No API key configured" }, { status: 400 });
  }
  try {
    const provider = new OpenAICompatibleProvider(config.provider, { ...config, apiKey });
    const reply = await provider.generateText({
      messages: [
        { role: "system", content: "You are a connectivity test. Reply with exactly: OK" },
        { role: "user", content: "Ping" },
      ],
      temperature: 0,
      maxTokens: 16,
    });
    return NextResponse.json({ ok: true, reply: reply.slice(0, 100) });
  } catch (err) {
    const message = err instanceof AiError ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
