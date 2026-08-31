import "server-only";
import { getSetting } from "@/lib/db/db";
import {
  OpenAICompatibleSttProvider,
  WhisperHttpProvider,
  type SpeechConfig,
  type SpeechToTextProvider,
} from "./providers";

export type { SpeechConfig, SpeechToTextProvider };

export function getSpeechConfig(): SpeechConfig {
  const stored = getSetting<Partial<SpeechConfig>>("speech_config");
  return {
    sttProvider: stored?.sttProvider || "",
    sttApiKey: stored?.sttApiKey || process.env.STT_API_KEY || "",
    sttBaseUrl:
      stored?.sttBaseUrl || process.env.STT_BASE_URL || "http://localhost:9000",
    sttModel: stored?.sttModel || process.env.STT_MODEL || "whisper-1",
    ttsProvider: stored?.ttsProvider || "",
    ttsVoice: stored?.ttsVoice || "",
    pronunciationProvider: stored?.pronunciationProvider || "",
    pronunciationApiKey:
      stored?.pronunciationApiKey || process.env.PRONUNCIATION_API_KEY || "",
  };
}

export function isSttConfigured(): boolean {
  const c = getSpeechConfig();
  return Boolean(c.sttProvider) || Boolean(c.sttApiKey);
}

export function getSttProvider(): SpeechToTextProvider | null {
  const c = getSpeechConfig();
  if (c.sttProvider === "whisper-http" || /^http/.test(c.sttBaseUrl) && c.sttProvider === "whisper-http") {
    return new WhisperHttpProvider(c.sttBaseUrl);
  }
  if (c.sttApiKey) {
    return new OpenAICompatibleSttProvider(c.sttBaseUrl, c.sttApiKey, c.sttModel);
  }
  return null;
}
