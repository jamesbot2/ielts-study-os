// Speech provider abstractions. None are required for the app to run.
//
// - SpeechToTextProvider: audio -> transcript
// - PronunciationAssessmentProvider: audio + reference text -> scores
// - TextToSpeechProvider: text -> audio (examiner voice / TTS practice audio)
//
// Implementations may call cloud APIs (Deepgram, AssemblyAI, OpenAI) or a
// local faster-whisper service. The app MUST NOT fabricate pronunciation
// scores from text alone.

export interface SpeechToTextResult {
  transcript: string;
  language?: string;
  confidence?: number;
  words?: { word: string; start: number; end: number; confidence?: number }[];
}

export interface SpeechToTextProvider {
  name: string;
  transcribe(audio: Blob, options?: { language?: string }): Promise<SpeechToTextResult>;
}

export interface PronunciationScore {
  overall: number; // 0-100
  accuracy: number;
  fluency: number;
  completeness: number;
  words?: { word: string; score: number }[];
}

export interface PronunciationAssessmentProvider {
  name: string;
  assess(audio: Blob, referenceText: string): Promise<PronunciationScore>;
}

export interface TextToSpeechProvider {
  name: string;
  synthesize(text: string, options?: { voice?: string }): Promise<ArrayBuffer>;
}

export interface SpeechConfig {
  sttProvider: string;
  sttApiKey: string;
  sttBaseUrl: string;
  sttModel: string;
  ttsProvider: string;
  ttsVoice: string;
  pronunciationProvider: string;
  pronunciationApiKey: string;
}

// Local transcription via a faster-whisper HTTP service (optional).
// The service runs separately (see docs/SPEECH_ARCHITECTURE.md) and is never
// a hard dependency.
export class WhisperHttpProvider implements SpeechToTextProvider {
  name = "whisper-http";
  constructor(private readonly baseUrl: string) {}

  async transcribe(audio: Blob): Promise<SpeechToTextResult> {
    const form = new FormData();
    form.append("audio", audio, "recording.webm");
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/transcribe`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(`Whisper service returned ${res.status}`);
    const data = (await res.json()) as {
      text?: string;
      language?: string;
      segments?: { text: string; start: number; end: number; words?: { word: string; start: number; end: number; confidence?: number }[] }[];
    };
    return {
      transcript: data.text ?? "",
      language: data.language,
      words: data.segments?.flatMap((s) => s.words ?? []),
    };
  }
}

// OpenAI-compatible transcription endpoint (e.g. OpenAI, DeepInfra, Groq).
export class OpenAICompatibleSttProvider implements SpeechToTextProvider {
  name = "openai-compatible-stt";
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async transcribe(audio: Blob): Promise<SpeechToTextResult> {
    const form = new FormData();
    form.append("file", audio, "recording.webm");
    form.append("model", this.model);
    form.append("response_format", "verbose_json");
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form,
    });
    if (!res.ok) throw new Error(`STT returned ${res.status}`);
    const data = (await res.json()) as { text?: string; language?: string };
    return { transcript: data.text ?? "", language: data.language };
  }
}
