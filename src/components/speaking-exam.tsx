"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { speakingTopics } from "@/lib/content/practice/speaking-topics";
import { computeTranscriptMetrics } from "@/lib/speech/metrics";
import {
  addSpeakingRecording,
  addSpeakingTranscript,
  completeSpeakingSession,
  createSpeakingSession,
} from "@/lib/storage/repository";
import { Mic, Square, Timer } from "lucide-react";

type Stage =
  | "intro"
  | "part1"
  | "part2_instructions"
  | "part2_prep"
  | "part2_turn"
  | "part3"
  | "complete";

interface Turn {
  part: number;
  prompt: string;
  transcript: string;
  durationSeconds: number;
}

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder === "undefined") return "";
  for (const c of candidates) if (MediaRecorder.isTypeSupported(c)) return c;
  return "";
}

export function SpeakingExam() {
  const [stage, setStage] = useState<Stage>("intro");
  const [topic, setTopic] = useState(speakingTopics[0]);
  const [part1Index, setPart1Index] = useState(0);
  const [part3Index, setPart3Index] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const part1Questions = topic.part1Questions.slice(0, 3);
  const cueCard = topic.part2CueCards[0];
  const part3Questions = topic.part3Questions.slice(0, 3);

  const currentPrompt = () => {
    if (stage === "part1") return part1Questions[part1Index];
    if (stage === "part2_instructions" || stage === "part2_prep" || stage === "part2_turn") {
      return `${cueCard.prompt}\n\nYou should say:\n${cueCard.bullets.map((b) => "• " + b).join("\n")}\n${cueCard.followUp ?? ""}`;
    }
    if (stage === "part3") return part3Questions[part3Index];
    return "";
  };

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimer();
      mediaRecorder.current?.stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const recordTurn = useCallback(
    (part: number) => {
      setTurns((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { part, prompt: currentPrompt(), transcript, durationSeconds };
        return copy;
      });
      setTranscript("");
      setDurationSeconds(0);
    },
     
    [currentPrompt, transcript, durationSeconds],
  );

  async function startRecording() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording is not supported. Type your answer instead.");
      return;
    }
    const mimeType = pickMimeType();
    setRecording(true);
    setDurationSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorder.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = async () => {
        setRecording(false);
        if (!sessionIdRef.current) sessionIdRef.current = await createSpeakingSession("exam", null, topic.name);
        const blob = new Blob(chunks.current, { type: rec.mimeType || mimeType || "audio/webm" });
        await addSpeakingRecording({
          sessionId: sessionIdRef.current,
          part: stage === "part1" ? 1 : stage === "part3" ? 3 : 2,
          prompt: currentPrompt(),
          audioBlob: blob,
          durationSeconds,
          mimeType: blob.type,
          size: blob.size,
          evaluation: null,
        });
      };
      rec.start();
      timerRef.current = setInterval(() => setDurationSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone permission denied. Type your answer instead.");
      setRecording(false);
    }
  }

  function stopRecording() {
    clearTimer();
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") mediaRecorder.current.stop();
    mediaRecorder.current?.stream?.getTracks().forEach((tr) => tr.stop());
  }

  // Prep timer (60s) and long-turn auto-advance.
  useEffect(() => {
    if (stage === "part2_prep") {
      setPrepSeconds(60);
      const id = setInterval(() => {
        setPrepSeconds((s) => {
          if (s <= 1) {
            clearInterval(id);
            setStage("part2_turn");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [stage]);

  async function saveTranscriptAndNext() {
    const part = stage === "part1" ? 1 : stage === "part3" ? 3 : 2;
    if (transcript.trim()) {
      if (!sessionIdRef.current) sessionIdRef.current = await createSpeakingSession("exam", null, topic.name);
      setTurns((prev) => [...prev, { part, prompt: currentPrompt(), transcript: transcript.trim(), durationSeconds }]);
      await addSpeakingTranscript({
        recordingId: "manual",
        text: transcript.trim(),
        source: "manual",
        metrics: computeTranscriptMetrics(transcript, durationSeconds),
      });
    }
    setTranscript("");
    setDurationSeconds(0);
    advance();
  }

  function advance() {
    if (stage === "part1" && part1Index < part1Questions.length - 1) {
      setPart1Index((i) => i + 1);
    } else if (stage === "part1") {
      setStage("part2_instructions");
    } else if (stage === "part2_instructions") {
      setStage("part2_prep");
    } else if (stage === "part2_turn") {
      setStage("part3");
    } else if (stage === "part3" && part3Index < part3Questions.length - 1) {
      setPart3Index((i) => i + 1);
    } else if (stage === "part3") {
      finish();
    }
  }

  async function finish() {
    if (sessionIdRef.current) await completeSpeakingSession(sessionIdRef.current);
    setSaved(true);
    setStage("complete");
  }

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Speaking Mock</h1>
        <p className="mt-2 text-sm text-muted">A complete Part 1 → Part 2 → Part 3 flow with recording.</p>
        <div className="card card-pad mt-6">
          <h2 className="mb-2 font-semibold">Instructions</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Part 1: three short questions about a familiar topic.</li>
            <li>Part 2: a cue card, 1 minute preparation, then 1–2 minutes speaking.</li>
            <li>Part 3: three deeper discussion questions.</li>
            <li>Record each answer or type a transcript. Your session is saved locally.</li>
          </ul>
          <label className="label mt-4">Topic</label>
          <select className="input" value={topic.id} onChange={(e) => setTopic(speakingTopics.find((x) => x.id === e.target.value) ?? speakingTopics[0])}>
            {speakingTopics.map((tp) => <option key={tp.id} value={tp.id}>{tp.name}</option>)}
          </select>
        </div>
        <button className="btn-primary mt-6" onClick={() => setStage("part1")}>Start speaking test</button>
      </div>
    );
  }

  if (stage === "part2_prep") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Preparation</h1>
        <p className="mt-2 text-sm text-muted">Use this minute to plan your answer.</p>
        <div className="card card-pad mt-4 text-left">
          <p className="whitespace-pre-wrap text-sm">{cueCard.prompt}</p>
          <p className="mt-2 text-sm text-muted">{cueCard.bullets.map((b) => `• ${b}`).join("\n")}</p>
        </div>
        <p className="mt-6 text-6xl font-bold tabular-nums">{prepSeconds}</p>
        <button className="btn-primary mt-8" onClick={() => setStage("part2_turn")}>Start speaking now</button>
      </div>
    );
  }

  if (stage === "complete") {
    const totalWords = turns.reduce((sum, x) => sum + (x.transcript ? x.transcript.trim().split(/\s+/).length : 0), 0);
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Speaking mock complete</h1>
        <p className="mt-2 text-sm text-muted">
          {saved ? "✓ Session saved locally." : ""} {turns.length} answers · {totalWords} words.
        </p>
        <div className="mt-6 space-y-4">
          {turns.map((turn, i) => (
            <div key={i} className="card card-pad">
              <p className="text-xs font-medium uppercase text-muted">Part {turn.part}</p>
              <p className="mt-1 text-sm font-medium">{turn.prompt}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                {turn.transcript || <em>(no transcript)</em>}
              </p>
              {turn.transcript && <TurnMetrics text={turn.transcript} duration={turn.durationSeconds} />}
            </div>
          ))}
        </div>
        <Link href="/mock" className="btn-primary mt-6 inline-flex">Back to mocks</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {stage === "part1" ? `Part 1 · Question ${part1Index + 1} of ${part1Questions.length}` :
           stage === "part2_instructions" ? "Part 2" :
           stage === "part2_turn" ? "Part 2 · Long turn" :
           `Part 3 · Question ${part3Index + 1} of ${part3Questions.length}`}
        </p>
        {recording && <span className="flex items-center gap-1 text-sm font-semibold text-red-600"><Timer className="h-4 w-4" /> {durationSeconds}s</span>}
      </div>

      <div className="card card-pad mb-4">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{currentPrompt()}</p>
      </div>

      <div className="card card-pad mb-4">
        <div className="flex items-center gap-3">
          {!recording ? (
            <button className="btn-primary" onClick={startRecording}><Mic className="h-4 w-4" /> Record</button>
          ) : (
            <button className="btn-danger" onClick={stopRecording}><Square className="h-4 w-4" /> Stop</button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">Or type your answer below.</p>
        <textarea
          className="input mt-2 min-h-[100px]"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type or paste what you said…"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => { recordTurn(stage === "part1" ? 1 : stage === "part3" ? 3 : 2); }}>
          Skip
        </button>
        <button className="btn-primary" onClick={saveTranscriptAndNext}>
          {stage === "part3" && part3Index === part3Questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

function TurnMetrics({ text, duration }: { text: string; duration: number }) {
  const m = computeTranscriptMetrics(text, duration);
  return (
    <p className="mt-2 text-xs text-muted">
      {m.wordsPerMinute} wpm · {m.fillerCount} fillers · {m.vocabularyDiversity.toFixed(2)} diversity
    </p>
  );
}
