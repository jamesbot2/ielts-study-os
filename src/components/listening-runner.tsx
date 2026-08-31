"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeSet, Question } from "@/types/ielts";
import { useI18n } from "@/components/i18n-provider";
import { apiPost } from "@/lib/client/api";
import { QuestionPanel, ResultsView } from "@/components/reading-runner";
import { Play, Pause, RotateCcw, Flag, ChevronLeft, ChevronRight } from "lucide-react";

type Answer = string | string[] | Record<string, string>;
interface Result {
  questionId: string;
  correct: boolean;
  userAnswer: Answer;
  correctAnswer: string;
  timeSpentSeconds: number;
  flagged: boolean;
}

const WORDS_PER_SECOND = 2.5; // ~150 wpm

function estimateDuration(transcript: string): number {
  const words = transcript.trim() ? transcript.split(/\s+/).length : 0;
  return Math.max(30, Math.round(words / WORDS_PER_SECOND));
}

export function ListeningRunner({ set }: { set: PracticeSet }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "submitting" | "results">("intro");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playedCount, setPlayedCount] = useState(0);
  const [results, setResults] = useState<Result[] | null>(null);
  const [rawScore, setRawScore] = useState(0);
  const [band, setBand] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(Date.now());

  const transcript = set.audio?.transcript ?? "";
  const duration = estimateDuration(transcript);
  const questions = set.questions;
  const groups = set.groups ?? [];

  const playAudio = useCallback(() => {
    if (mode === "exam" && playedCount >= 1) return;
    setPlaying(true);
    setProgress(0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const p = Math.round(((Date.now() - start) / 1000) * (100 / duration));
      if (p >= 100) {
        clearInterval(timerRef.current!);
        setProgress(100);
        setPlaying(false);
        setPlayedCount((c) => c + 1);
      } else {
        setProgress(p);
      }
    }, 200);
  }, [duration, mode, playedCount]);

  const pauseAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPlaying(false);
  };

  const canPlay = mode === "practice" || playedCount < 1;

  const submit = useCallback(
    async (finalAnswers: Record<string, Answer>) => {
      setPhase("submitting");
      if (timerRef.current) clearInterval(timerRef.current);
      const timeSpent = Math.round((Date.now() - startedAt.current) / 1000);
      const res = await apiPost<{ rawScore: number; total: number; band: number; results: Result[] }>(
        "/api/practice/submit",
        { setId: set.meta.id, mode, answers: finalAnswers, timeSpentSeconds: timeSpent },
      );
      setResults(res.results);
      setRawScore(res.rawScore);
      setBand(res.band);
      setPhase("results");
    },
    [mode, set.meta.id],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{set.meta.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {set.questions.length} questions · 4 parts · {Math.round(duration / 60)} min audio
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => { setMode("practice"); setPhase("running"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.practiceMode")}</p>
            <p className="mt-1 text-sm text-muted">{t("practice.flexible")}</p>
          </button>
          <button onClick={() => { setMode("exam"); setPhase("running"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.examMode")}</p>
            <p className="mt-1 text-sm text-muted">{t("listening.onePlay")}</p>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ResultsView
          set={set}
          results={results}
          rawScore={rawScore}
          band={band}
          answers={answers}
          mode={mode}
        />
        <div className="card card-pad mt-6">
          <h2 className="mb-2 text-base font-semibold">{t("listening.transcript")}</h2>
          <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm leading-relaxed">
            {transcript}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const answered = questions.filter((x) => answers[x.id] !== undefined && answers[x.id] !== "").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Player */}
      <div className="card card-pad mb-4">
        <div className="flex items-center gap-3">
          {!playing ? (
            <button className="btn-primary" onClick={playAudio} disabled={!canPlay}>
              <Play className="h-4 w-4" /> {t("listening.playAudio")}
            </button>
          ) : (
            <button className="btn-secondary" onClick={pauseAudio}>
              <Pause className="h-4 w-4" />
            </button>
          )}
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted">
              {mode === "exam" && playedCount >= 1 ? t("listening.onePlay") : `${Math.round(duration / 60)} min`}
            </p>
          </div>
          <span className="text-sm font-semibold">{answered}/{questions.length}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transcript during playback only */}
        {(playing || (mode === "practice" && playedCount > 0)) && (
          <div className="card card-pad max-h-[70vh] overflow-y-auto">
            <h2 className="mb-2 text-sm font-semibold">{t("listening.transcript")}</h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{transcript}</div>
          </div>
        )}

        {/* Questions */}
        <div>
          {/* Part tabs */}
          <div className="mb-3 flex flex-wrap gap-1">
            {groups.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setCurrent(questions.findIndex((x) => x.id === g.questionIds[0]))}
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-gray-50"
              >
                {g.title}
              </button>
            ))}
          </div>

          <div className="card card-pad">
            <QuestionPanel
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
              flagged={flags.has(q.id)}
              onToggleFlag={() =>
                setFlags((prev) => {
                  const next = new Set(prev);
                  next.has(q.id) ? next.delete(q.id) : next.add(q.id);
                  return next;
                })
              }
              index={current}
              total={questions.length}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              <ChevronLeft className="h-4 w-4" /> {t("common.previous")}
            </button>
            <button className="btn-ghost" onClick={() => setFlags((prev) => { const n = new Set(prev); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}>
              <Flag className={`h-4 w-4 ${flags.has(q.id) ? "fill-yellow-400" : ""}`} />
            </button>
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1}>
              {t("common.next")} <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button className="btn-primary mt-4 w-full" onClick={() => submit(answers)} disabled={phase === "submitting"}>
            {t("common.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
