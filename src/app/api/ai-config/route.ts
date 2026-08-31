import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting } from "@/lib/db/db";
import { getAiConfig, isAiConfigured, maskApiKey } from "@/lib/ai";

export async function GET() {
  const config = getAiConfig();
  // Never return the raw key to the client.
  return NextResponse.json({
    provider: config.provider,
    baseUrl: config.baseUrl,
    model: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    enableCritic: config.enableCritic,
    hasKey: config.apiKey.length > 0,
    keyHint: maskApiKey(config.apiKey),
    configured: isAiConfigured(),
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    provider?: string;
    baseUrl?: string;
    apiKey?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    enableCritic?: boolean;
  };
  const existing = getAiConfig();
  const next = {
    ...existing,
    provider: body.provider ?? existing.provider,
    baseUrl: body.baseUrl ?? existing.baseUrl,
    model: body.model ?? existing.model,
    temperature: body.temperature ?? existing.temperature,
    maxTokens: body.maxTokens ?? existing.maxTokens,
    enableCritic: body.enableCritic ?? existing.enableCritic,
    // Only overwrite the key when a non-empty value is provided.
    apiKey: body.apiKey && body.apiKey.trim() ? body.apiKey.trim() : existing.apiKey,
  };
  setSetting("ai_config", next);
  return NextResponse.json({ ok: true, configured: next.apiKey.length > 0 });
}
