"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakingTopics } from "@/lib/content/practice/speaking-topics";
import { useI18n } from "@/components/i18n-provider";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { speakingBandFromCriteria } from "@/lib/scoring/scoring";
import { computeTranscriptMetrics } from "@/lib/speech/metrics";
import {
  addSpeakingRecording,
  createSpeakingSession,
  createSpeakingTurn,
  deleteSpeakingTurn,
  getSettings,
  listSpeakingTurns,
  updateSpeakingTurn,
} from "@/lib/storage/repository";
import type { SpeakingTurn } from "@/lib/storage/types";
import type { SpeakingEvaluation, TranscriptMetrics } from "@/types/ielts";
import { BandBadge, Spinner } from "@/components/ui";
import { Mic, Square, RefreshCw, Trash2 } from "lucide-react";

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder === "undefined") return "";
  for (const c of candidates) if (MediaRecorder.isTypeSupported(c)) return c;
  return "";
}

export function SpeakingPractice() {
  const { t, locale } = useI18n();
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [topicId, setTopicId] = useState(speakingTopics[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [phase, setPhase] = useState<"setup" | "prep" | "recording" | "review">("setup");

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [turnDuration, setTurnDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [metrics, setMetrics] = useState<TranscriptMetrics | null>(null);
  const [sttBusy, setSttBusy] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedState, setSavedState] = useState<"none" | "recordingSaved" | "transcriptSaved" | "evaluationSaved">("none");
  const [history, setHistory] = useState<SpeakingTurn[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartedAt = useRef<number | null>(null);
  const turnIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const topic = speakingTopics.find((x) => x.id === topicId) ?? speakingTopics[0];

  const revokeAudioUrl = useCallback(() => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const pickPrompt = useCallback(
    (p: 1 | 2 | 3) => {
      setPart(p);
      setPhase("setup");
      revokeAudioUrl();
      setAudioBlob(null);
      setTranscript("");
      setMetrics(null);
      setEvaluation(null);
      setError(null);
      setSavedState("none");
      setDurationSeconds(0);
      setTurnDuration(0);
      turnIdRef.current = null;
      sessionIdRef.current = null;
      if (p === 1) {
        setPrompt(topic.part1Questions[Math.floor(Math.random() * topic.part1Questions.length)]);
      } else if (p === 2) {
        const card = topic.part2CueCards[Math.floor(Math.random() * topic.part2CueCards.length)];
        setPrompt(`${card.prompt}\n\nYou should say:\n${card.bullets.map((b) => "• " + b).join("\n")}\n${card.followUp ?? ""}`);
      } else {
        setPrompt(topic.part3Questions[Math.floor(Math.random() * topic.part3Questions.length)]);
      }
    },
    [topic, revokeAudioUrl],
  );

  useEffect(() => {
    pickPrompt(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      revokeAudioUrl();
    };
  }, [revokeAudioUrl]);

  const loadHistory = useCallback(() => {
    listSpeakingTurns().then(setHistory);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function ensureSession(): Promise<string> {
    if (!sessionIdRef.current) sessionIdRef.current = await createSpeakingSession("practice", part, topic.name);
    return sessionIdRef.current;
  }

  function startRecording() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError(locale === "zh" ? "此浏览器不支持录音，你仍然可以手动输入逐字稿。" : "Recording is not supported in this browser. You can still enter a transcript manually.");
      setPhase("review");
      return;
    }
    const mimeType = pickMimeType();
    const capturedPart = part;
    const capturedPrompt = prompt;
    setPhase("recording");
    revokeAudioUrl();
    setAudioBlob(null);
    setDurationSeconds(0);
    setRecording(true);
    recordingStartedAt.current = Date.now();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorder.current = rec;
        chunks.current = [];
        rec.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.current.push(e.data);
        };
        rec.onstop = async () => {
          const realDuration = recordingStartedAt.current ? Math.round((Date.now() - recordingStartedAt.current) / 1000) : 0;
          const type = rec.mimeType || mimeType || "audio/webm";
          const blob = new Blob(chunks.current, { type });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          setTurnDuration(realDuration);
          setRecording(false);
          setPhase("review");
          try {
            const sessionId = await ensureSession();
            const turn = await createSpeakingTurn({ sessionId, part: capturedPart, prompt: capturedPrompt, durationSeconds: realDuration });
            turnIdRef.current = turn.id;
            const recordingId = await addSpeakingRecording({
              sessionId,
              turnId: turn.id,
              part: capturedPart,
              prompt: capturedPrompt,
              audioBlob: blob,
              durationSeconds: realDuration,
              mimeType: type,
              size: blob.size,
            });
            await updateSpeakingTurn(turn.id, { recordingId });
            setSavedState("recordingSaved");
          } catch (e) {
            setError((e as Error).message || "Failed to save recording");
          }
        };
        rec.start();
        timerRef.current = setInterval(() => setDurationSeconds((s) => s + 1), 1000);
      })
      .catch(() => {
        setError(locale === "zh" ? "麦克风权限被拒绝，你可以手动输入逐字稿。" : "Microphone permission denied. You can enter a transcript manually.");
        setRecording(false);
        setPhase("review");
      });
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") mediaRecorder.current.stop();
    mediaRecorder.current?.stream.getTracks().forEach((tr) => tr.stop());
  }

  function computeMetrics() {
    setMetrics(computeTranscriptMetrics(transcript, turnDuration || durationSeconds));
  }

  async function transcribe() {
    if (!audioBlob) return;
    setSttBusy(true);
    setError(null);
    try {
      const settings = await getSettings();
      if (!settings.speech.sttBaseUrl.trim()) {
        setError(locale === "zh" ? "尚未配置语音转文字，请手动输入逐字稿。" : "Speech-to-text is not configured. Type or paste your transcript below.");
        return;
      }
      const form = new FormData();
      form.append("audio", audioBlob, "recording.webm");
      form.append("durationSeconds", String(turnDuration || durationSeconds));
      const res = await fetch(`${settings.speech.sttBaseUrl.replace(/\/$/, "")}/transcribe`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "STT failed");
      const text = data.text ?? data.transcript ?? "";
      setTranscript(text);
      const m = computeTranscriptMetrics(text, turnDuration || durationSeconds);
      setMetrics(m);
      // STT must attach to the SAME turn as the recording.
      if (turnIdRef.current) {
        await updateSpeakingTurn(turnIdRef.current, { transcript: text, transcriptSource: "stt", metrics: m });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSttBusy(false);
    }
  }

  // Save the current response's transcript. If a recording already created a
  // turn, update it (one response = one turn). Otherwise create a text-only turn.
  async function saveTextOnly() {
    setError(null);
    try {
      const transcriptText = transcript.trim();
      const m = metrics ?? (transcriptText ? computeTranscriptMetrics(transcriptText, turnDuration || durationSeconds) : null);
      if (turnIdRef.current) {
        await updateSpeakingTurn(turnIdRef.current, {
          transcript: transcriptText || null,
          transcriptSource: transcriptText ? "manual" : "none",
          metrics: m,
          durationSeconds: turnDuration || undefined,
        });
      } else {
        const sessionId = await ensureSession();
        const turn = await createSpeakingTurn({
          sessionId,
          part,
          prompt,
          transcript: transcriptText || null,
          transcriptSource: transcriptText ? "manual" : "none",
          durationSeconds: turnDuration || null,
          metrics: m,
        });
        turnIdRef.current = turn.id;
      }
      setSavedState("transcriptSaved");
      loadHistory();
    } catch (e) {
      setError((e as Error).message || "Save failed");
    }
  }

  async function evaluate() {
    setEvaluating(true);
    setError(null);
    const m = metrics ?? computeTranscriptMetrics(transcript, turnDuration || durationSeconds);
    setMetrics(m);
    try {
      // Ensure a turn exists (text-only path may not have one yet).
      if (!turnIdRef.current) {
        const sessionId = await ensureSession();
        const turn = await createSpeakingTurn({
          sessionId,
          part,
          prompt,
          transcript: transcript.trim() || null,
          transcriptSource: transcript.trim() ? "manual" : "none",
          durationSeconds: turnDuration || null,
          metrics: m,
        });
        turnIdRef.current = turn.id;
      }
      await updateSpeakingTurn(turnIdRef.current, { transcript: transcript.trim() || null, transcriptSource: transcript.trim() ? "manual" : "none", metrics: m });

      if (!isAiAvailable()) {
        setSavedState("transcriptSaved");
        setError(locale === "zh" ? "转录评估不可用，但你的逐字稿和指标已保存。" : "Transcript-based AI evaluation is unavailable. Your transcript and metrics are saved.");
        return;
      }
      const raw = await getAiClient().evaluateSpeaking({ part, prompt, transcript, metrics: m });
      const supported = raw.criterionScores.filter((c) => c.supported).map((c) => c.band);
      const overall = speakingBandFromCriteria(supported);
      const finalEval: SpeakingEvaluation = { ...raw, estimatedOverallBand: overall };
      setEvaluation(finalEval);
      await updateSpeakingTurn(turnIdRef.current, { evaluation: finalEval });
      setSavedState("evaluationSaved");
      loadHistory();
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
          <button className="btn-secondary w-full" onClick={() => { setShowHistory((s) => !s); loadHistory(); }}>
            {locale === "zh" ? "历史记录" : "History"} ({history.length})
          </button>
        </aside>

        <main className="space-y-4">
          {showHistory && (
            <div className="card card-pad">
              <h2 className="mb-2 text-sm font-semibold">{locale === "zh" ? "历史记录" : "History"}</h2>
              {history.length === 0 ? (
                <p className="text-sm text-muted">{locale === "zh" ? "暂无记录。" : "No saved responses yet."}</p>
              ) : (
                <div className="space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                      <div className="min-w-0 text-sm">
                        <p className="font-medium">Part {h.part} · {h.prompt.slice(0, 60)}{h.prompt.length > 60 ? "…" : ""}</p>
                        {h.transcript && <p className="text-xs text-muted line-clamp-2">{h.transcript}</p>}
                        <p className="text-xs text-muted">
                          {new Date(h.createdAt).toLocaleString()}
                          {h.durationSeconds != null ? ` · ${h.durationSeconds}s` : ""}
                          {h.recordingId ? ` · 🎙` : ""}
                          {h.transcript ? ` · ✎` : ""}
                          {h.evaluation ? ` · ⭐` : ""}
                        </p>
                      </div>
                      <button className="btn-ghost px-2 py-1 text-xs text-muted hover:text-red-600" onClick={async () => { await deleteSpeakingTurn(h.id); loadHistory(); }}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card card-pad">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Part {part} prompt</span>
              <button className="btn-ghost" onClick={() => pickPrompt(part)}>
                <RefreshCw className="h-4 w-4" /> {locale === "zh" ? "换一题" : "New"}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{prompt}</p>
            {part === 2 && phase === "setup" && (
              <button className="btn-primary mt-3" onClick={() => setPhase("prep")}>{t("speaking.preparation")}</button>
            )}
          </div>

          <div className="card card-pad">
            <div className="flex flex-wrap items-center gap-3">
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
              {audioUrl && !recording && <audio ref={audioRef} src={audioUrl} controls className="max-w-xs" />}
            </div>
            {savedState !== "none" && (
              <p className="mt-2 text-xs text-green-600">
                {savedState === "recordingSaved" ? (locale === "zh" ? "✓ 录音已保存" : "✓ Recording saved")
                  : savedState === "transcriptSaved" ? (locale === "zh" ? "✓ 逐字稿已保存" : "✓ Transcript saved")
                  : (locale === "zh" ? "✓ 评估已保存" : "✓ Evaluation saved")}
              </p>
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
                {sttBusy ? <Spinner /> : (locale === "zh" ? "转写" : "Transcribe")}
              </button>
              <button className="btn-secondary" onClick={computeMetrics}>{t("speaking.metrics")}</button>
              <button className="btn-secondary" onClick={saveTextOnly}>{locale === "zh" ? "保存逐字稿" : "Save transcript"}</button>
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
  const { t, locale } = useI18n();
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
      <p className="mt-2 text-sm text-muted">{locale === "zh" ? "1 分钟准备时间" : "1 minute to prepare your notes"}</p>
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
    </div>
  );
}
