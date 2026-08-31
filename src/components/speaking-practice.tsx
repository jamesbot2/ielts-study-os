"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakingTopics } from "@/lib/content/practice/speaking-topics";
import { useI18n } from "@/components/i18n-provider";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { speakingBandFromCriteria } from "@/lib/scoring/scoring";
import { computeTranscriptMetrics } from "@/lib/speech/metrics";
import {
  addSpeakingRecording,
  addSpeakingTranscript,
  createSpeakingSession,
  getSettings,
} from "@/lib/storage/repository";
import type { SpeakingEvaluation, TranscriptMetrics } from "@/types/ielts";
import { BandBadge, Spinner } from "@/components/ui";
import { Mic, Square, RefreshCw } from "lucide-react";

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  if (typeof MediaRecorder === "undefined") return "";
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

export function SpeakingPractice() {
  const { t } = useI18n();
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [topicId, setTopicId] = useState(speakingTopics[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [phase, setPhase] = useState<"setup" | "prep" | "recording" | "review">("setup");

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [metrics, setMetrics] = useState<TranscriptMetrics | null>(null);
  const [sttBusy, setSttBusy] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSession, setSavedSession] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const recordingIdRef = useRef<string | null>(null);

  const topic = speakingTopics.find((x) => x.id === topicId) ?? speakingTopics[0];

  const pickPrompt = useCallback(
    (p: 1 | 2 | 3) => {
      setPart(p);
      setPhase("setup");
      setAudioUrl(null);
      setAudioBlob(null);
      setTranscript("");
      setMetrics(null);
      setEvaluation(null);
      setError(null);
      setSavedSession(false);
      setDurationSeconds(0);
      sessionIdRef.current = null;
      recordingIdRef.current = null;
      if (p === 1) {
        setPrompt(topic.part1Questions[Math.floor(Math.random() * topic.part1Questions.length)]);
      } else if (p === 2) {
        const card = topic.part2CueCards[Math.floor(Math.random() * topic.part2CueCards.length)];
        setPrompt(
          `${card.prompt}\n\nYou should say:\n${card.bullets.map((b) => "• " + b).join("\n")}\n${card.followUp ?? ""}`,
        );
      } else {
        setPrompt(topic.part3Questions[Math.floor(Math.random() * topic.part3Questions.length)]);
      }
    },
    [topic],
  );

  useEffect(() => {
    pickPrompt(1);
  }, [topicId, pickPrompt]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function startRecording() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording is not supported in this browser. You can still enter a transcript manually.");
      setPhase("review");
      return;
    }
    const mimeType = pickMimeType();
    setPhase("recording");
    setAudioUrl(null);
    setAudioBlob(null);
    setDurationSeconds(0);
    setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorder.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        const type = rec.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks.current, { type });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
        setPhase("review");
        // persist session + recording metadata
        (async () => {
          const sessionId = await createSpeakingSession("practice", part, topic.name);
          sessionIdRef.current = sessionId;
          const recordingId = await addSpeakingRecording({
            sessionId,
            part,
            prompt,
            audioBlob: blob,
            durationSeconds,
            mimeType: type,
            size: blob.size,
            evaluation: null,
          });
          recordingIdRef.current = recordingId;
        })().catch(() => {});
      };
      rec.start();
      timerRef.current = setInterval(() => setDurationSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone permission denied. You can enter a transcript manually.");
      setRecording(false);
      setPhase("review");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    mediaRecorder.current?.stream.getTracks().forEach((tr) => tr.stop());
  }

  function computeMetrics() {
    setMetrics(computeTranscriptMetrics(transcript, durationSeconds));
  }

  async function transcribe() {
    if (!audioBlob) return;
    setSttBusy(true);
    setError(null);
    try {
      const settings = await getSettings();
      if (!settings.speech.sttBaseUrl.trim()) {
        setError("Speech-to-text is not configured. Type or paste your transcript below.");
        return;
      }
      const form = new FormData();
      form.append("audio", audioBlob, "recording.webm");
      form.append("durationSeconds", String(durationSeconds));
      const res = await fetch(`${settings.speech.sttBaseUrl.replace(/\/$/, "")}/transcribe`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "STT failed");
      setTranscript(data.text ?? data.transcript ?? "");
      setMetrics(computeTranscriptMetrics(data.text ?? data.transcript ?? "", durationSeconds));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSttBusy(false);
    }
  }

  async function evaluate() {
    setEvaluating(true);
    setError(null);
    const m = metrics ?? computeTranscriptMetrics(transcript, durationSeconds);
    setMetrics(m);
    try {
      // Persist transcript first.
      if (recordingIdRef.current) {
        await addSpeakingTranscript({
          recordingId: recordingIdRef.current,
          text: transcript,
          source: "manual",
          metrics: m,
        });
      }
      if (!isAiAvailable()) {
        setError("Transcript-based AI evaluation is unavailable. Your transcript and metrics are saved.");
        return;
      }
      const raw = await getAiClient().evaluateSpeaking({
        part,
        prompt,
        transcript,
        metrics: m,
      });
      const supported = raw.criterionScores.filter((c) => c.supported).map((c) => c.band);
      const overall = speakingBandFromCriteria(supported);
      const finalEval: SpeakingEvaluation = { ...raw, estimatedOverallBand: overall };
      setEvaluation(finalEval);
      setSavedSession(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEvaluating(false);
    }
  }

  if (phase === "prep" && part === 2) {
    return <PrepTimer onDone={() => setPhase("recording")} />;
  }

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">{t("speaking.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("practice.speaking")}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="card card-pad">
            <h2 className="mb-2 text-sm font-semibold">Part</h2>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((p) => (
                <button key={p} onClick={() => pickPrompt(p)} className={`btn ${part === p ? "btn-primary" : "btn-secondary"}`}>
                  Part {p}
                </button>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h2 className="mb-2 text-sm font-semibold">Topic</h2>
            <select className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {speakingTopics.map((tp) => (
                <option key={tp.id} value={tp.id}>{tp.name}</option>
              ))}
            </select>
          </div>
          <div className="card card-pad">
            <h2 className="mb-2 text-sm font-semibold">{t("speaking.examiner")}</h2>
            <p className="text-xs text-muted">{t("speaking.pronunciationNotEvaluated")}</p>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="card card-pad">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Part {part} prompt</span>
              <button className="btn-ghost" onClick={() => pickPrompt(part)}>
                <RefreshCw className="h-4 w-4" /> New
              </button>
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{prompt}</p>
          </div>

          <div className="card card-pad">
            <div className="flex items-center gap-3">
              {!recording ? (
                <button className="btn-primary" onClick={startRecording}>
                  <Mic className="h-4 w-4" /> {t("speaking.record")}
                </button>
              ) : (
                <button className="btn-danger" onClick={stopRecording}>
                  <Square className="h-4 w-4" /> {t("speaking.stop")}
                </button>
              )}
              {recording && <span className="text-sm font-semibold text-red-600">{durationSeconds}s</span>}
              {audioUrl && !recording && (
                <audio ref={audioRef} src={audioUrl} controls className="max-w-xs" />
              )}
            </div>
            {audioUrl && !recording && (
              <p className="mt-2 text-xs text-muted">{t("speaking.noStt")}</p>
            )}
            {savedSession && (
              <p className="mt-2 text-xs text-green-600">✓ Session saved locally</p>
            )}
          </div>

          <div className="card card-pad">
            <h2 className="mb-2 text-sm font-semibold">{t("speaking.transcript")}</h2>
            <textarea
              className="input min-h-[120px]"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={t("speaking.transcriptPlaceholder")}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={transcribe} disabled={sttBusy || !audioBlob}>
                {sttBusy ? <Spinner /> : "Transcribe"}
              </button>
              <button className="btn-secondary" onClick={computeMetrics}>
                {t("speaking.metrics")}
              </button>
              <button className="btn-primary" onClick={evaluate} disabled={evaluating || !transcript.trim()}>
                {evaluating ? <Spinner /> : t("speaking.getFeedback")}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {metrics && <MetricsView metrics={metrics} />}
          {evaluation && <SpeakingEvaluationView evaluation={evaluation} />}
        </main>
      </div>
    </div>
  );
}

function PrepTimer({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          onDone();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onDone]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">{t("speaking.preparation")}</h1>
      <p className="mt-2 text-sm text-muted">1 minute to prepare your notes</p>
      <p className="mt-6 text-6xl font-bold tabular-nums">{seconds}</p>
      <button className="btn-primary mt-8" onClick={onDone}>{t("speaking.startSpeaking")}</button>
    </div>
  );
}

function MetricsView({ metrics }: { metrics: TranscriptMetrics }) {
  const { t } = useI18n();
  const items = [
    [t("speaking.wordsPerMinute"), String(metrics.wordsPerMinute)],
    [t("speaking.duration"), `${metrics.durationSeconds}s`],
    [t("speaking.fillers"), String(metrics.fillerCount)],
    [t("speaking.vocabularyDiversity"), metrics.vocabularyDiversity.toFixed(2)],
    [t("common.words"), String(metrics.wordCount)],
  ] as const;
  return (
    <div className="card card-pad">
      <h2 className="mb-3 text-sm font-semibold">{t("speaking.metrics")}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {items.map(([k, v]) => (
          <div key={k} className="rounded-md bg-gray-50 p-2 text-center">
            <p className="text-lg font-semibold">{v}</p>
            <p className="text-xs text-muted">{k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeakingEvaluationView({ evaluation }: { evaluation: SpeakingEvaluation }) {
  const { t } = useI18n();
  return (
    <div className="card card-pad">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t("speaking.getFeedback")}</h2>
        <BandBadge band={evaluation.estimatedOverallBand} />
      </div>
      <p className="mb-3 text-xs text-muted">{t("common.officialNote")}</p>
      <div className="space-y-3">
        {evaluation.criterionScores.map((c) => (
          <div key={c.criterion} className="flex items-start gap-3">
            {c.supported ? <BandBadge band={c.band} /> : <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-muted">n/a</span>}
            <div>
              <p className="text-sm font-medium">
                {c.criterion === "fluencyCoherence" ? t("speaking.fluencyCoherence")
                  : c.criterion === "lexicalResource" ? t("speaking.lexicalResource")
                  : c.criterion === "grammaticalRange" ? t("speaking.grammaticalRange")
                  : t("speaking.pronunciation")}
                {!c.supported && <span className="ml-2 text-xs text-muted">({t("speaking.pronunciationNotEvaluated")})</span>}
              </p>
              <p className="text-sm text-muted">{c.rationale}</p>
            </div>
          </div>
        ))}
      </div>
      {evaluation.weaknesses.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">{t("writing.weaknesses")}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
      {evaluation.betterVocabulary.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Better vocabulary</p>
          <ul className="space-y-1 text-sm">
            {evaluation.betterVocabulary.map((v, i) => (
              <li key={i}><span className="font-medium">{v.used}</span> → <span className="text-green-700">{v.suggestion}</span></li>
            ))}
          </ul>
        </div>
      )}
      {evaluation.nextRecommendedDrills.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Recommended drills</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {evaluation.nextRecommendedDrills.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
