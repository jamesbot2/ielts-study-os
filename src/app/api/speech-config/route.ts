import { NextRequest, NextResponse } from "next/server";
import { setSetting } from "@/lib/db/db";
import { getSpeechConfig } from "@/lib/speech";

export async function GET() {
  const c = getSpeechConfig();
  return NextResponse.json({
    sttProvider: c.sttProvider,
    sttBaseUrl: c.sttBaseUrl,
    sttModel: c.sttModel,
    hasSttKey: c.sttApiKey.length > 0,
    ttsProvider: c.ttsProvider,
    ttsVoice: c.ttsVoice,
    pronunciationProvider: c.pronunciationProvider,
    hasPronunciationKey: c.pronunciationApiKey.length > 0,
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, string | undefined>;
  const existing = getSpeechConfig();
  const next = {
    ...existing,
    sttProvider: body.sttProvider ?? existing.sttProvider,
    sttBaseUrl: body.sttBaseUrl ?? existing.sttBaseUrl,
    sttModel: body.sttModel ?? existing.sttModel,
    sttApiKey:
      body.sttApiKey && body.sttApiKey.trim() ? body.sttApiKey.trim() : existing.sttApiKey,
    ttsProvider: body.ttsProvider ?? existing.ttsProvider,
    ttsVoice: body.ttsVoice ?? existing.ttsVoice,
    pronunciationProvider: body.pronunciationProvider ?? existing.pronunciationProvider,
    pronunciationApiKey:
      body.pronunciationApiKey && body.pronunciationApiKey.trim()
        ? body.pronunciationApiKey.trim()
        : existing.pronunciationApiKey,
  };
  setSetting("speech_config", next);
  return NextResponse.json({ ok: true });
}
