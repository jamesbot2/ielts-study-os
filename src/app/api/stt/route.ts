import { NextRequest, NextResponse } from "next/server";
import { getSttProvider } from "@/lib/speech";
import { computeTranscriptMetrics } from "@/lib/speech/metrics";

export async function POST(req: NextRequest) {
  const provider = getSttProvider();
  if (!provider) {
    return NextResponse.json(
      { error: "Speech-to-text is not configured." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart audio upload" }, { status: 400 });
  }

  const audio = form.get("audio");
  const duration = Number(form.get("durationSeconds") ?? 0);
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }

  try {
    const result = await provider.transcribe(audio);
    const metrics = computeTranscriptMetrics(result.transcript, duration);
    return NextResponse.json({
      transcript: result.transcript,
      language: result.language,
      confidence: result.confidence,
      metrics,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Transcription failed: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
