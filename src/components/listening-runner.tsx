"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeSet } from "@/types/ielts";
import { useI18n } from "@/components/i18n-provider";
import { submitPractice } from "@/lib/practice/submit";
import { useStudyProfile } from "@/components/study-profile-provider";
import {
  initialListeningPlaybackState,
  playbackStart,
  playbackProgress,
  playbackAdvance,
  playbackFinish,
  type ListeningPlaybackState,
} from "@/lib/practice/listening-state";
import { QuestionPanel, ResultsView } from "@/components/reading-runner";
import { effectiveQuestionCount } from "@/lib/content/practice-validation";
import { scoredUnitCountForQuestions, scoredUnitRange, answeredScoredUnitCount, questionUsesVisual } from "@/lib/scoring/units";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Flag } from "lucide-react";

type Answer = string | string[] | Record<string, string>;

interface PersistedListening {
  setId: string;
  mode: "practice" | "exam";
  answers: Record<string, Answer>;
  flags: string[];
  current: number;
  playback: ListeningPlaybackState;
  startedAt: number;
}

const storageKey = (setId: string) => `ielts-listening:${setId}`;

export function ListeningRunner({ set }: { set: PracticeSet }) {
  const { t, locale } = useI18n();
  const { testType } = useStudyProfile();
  const [phase, setPhase] = useState<"intro" | "resume" | "running" | "submitting" | "results">("intro");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playback, setPlayback] = useState<ListeningPlaybackState>(initialListeningPlaybackState());
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Awaited<ReturnType<typeof submitPractice>>["results"] | null>(null);
  const [rawScore, setRawScore] = useState(0);
  const [resTotal, setResTotal] = useState(0);
  const [band, setBand] = useState<number | null>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAt = useRef<number>(Date.now());

  const transcript = set.audio?.transcript ?? "";
  const parts = set.audio?.parts?.filter((p) => p.src) ?? [];
  const questions = set.questions;
  const groups = set.groups ?? [];

  // Detect an in-progress attempt and offer resume.
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(set.meta.id));
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as PersistedListening;
      if (saved.setId === set.meta.id) {
        setMode(saved.mode);
        setAnswers(saved.answers ?? {});
        setFlags(new Set(saved.flags ?? []));
        setCurrent(saved.current ?? 0);
        setPlayback(saved.playback ?? initialListeningPlaybackState());
        startedAt.current = saved.startedAt ?? Date.now();
        setPhase("resume");
      }
    } catch {
      localStorage.removeItem(storageKey(set.meta.id));
    }
  }, [set.meta.id]);

  const persist = useCallback(() => {
    if (phase !== "running") return;
    const data: PersistedListening = {
      setId: set.meta.id,
      mode,
      answers,
      flags: [...flags],
      current,
      playback,
      startedAt: startedAt.current,
    };
    localStorage.setItem(storageKey(set.meta.id), JSON.stringify(data));
  }, [set.meta.id, mode, answers, flags, current, playback, phase]);

  useEffect(() => {
    persist();
  }, [persist]);

  function startAttempt(m: "practice" | "exam") {
    setMode(m);
    startedAt.current = Date.now();
    setPhase("running");
  }

  const playCurrentPart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(true);
    void audio.play();
  }, []);

  const playAudio = useCallback(() => {
    if (mode === "exam" && playback.finished) return;
    const audio = audioRef.current;
    if (audio) {
      if (audio.src !== new URL(parts[playback.partIndex]?.src ?? "", window.location.href).href) {
        audio.src = parts[playback.partIndex]?.src ?? "";
        audio.load();
      }
      if (playback.currentTime > 0 && audio.currentTime === 0) audio.currentTime = playback.currentTime;
    }
    setPlayback((p) => playbackStart(p));
    playCurrentPart();
  }, [mode, playback, parts, playCurrentPart]);

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    setProgress(0);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.src = parts[0]?.src ?? "";
    }
    setPlaying(false);
    setPlayback(initialListeningPlaybackState());
  }, [parts]);

  const handleEnded = useCallback(() => {
    if (playback.partIndex < parts.length - 1) {
      const next = playback.partIndex + 1;
      setPlayback((p) => playbackAdvance(p, next));
      const audio = audioRef.current;
      if (audio) {
        audio.src = parts[next]?.src ?? "";
        void audio.play();
      }
    } else {
      setPlaying(false);
      setPlayback((p) => playbackFinish(p));
    }
  }, [playback.partIndex, parts]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.duration === 0) return;
    const total = parts.reduce((sum, p) => sum + estimatePartDuration(p.src ?? ""), 0) || 1;
    const partDurations = parts.map((p) => estimatePartDuration(p.src ?? ""));
    const elapsedInPart = audio.currentTime;
    const prior = partDurations.slice(0, playback.partIndex).reduce((a, b) => a + b, 0);
    setProgress(Math.min(100, Math.round(((prior + elapsedInPart) / total) * 100)));
    // Throttled persistence of playback offset (once per second).
    const now = Date.now();
    setPlayback((p) => (now - p.updatedAt >= 1000 ? playbackProgress(p, audio.currentTime, now) : p));
  }, [parts, playback.partIndex]);

  // When the part changes, the audio element src changes; auto-play is handled
  // by handleEnded / playAudio.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && parts[playback.partIndex]) {
      audio.src = parts[playback.partIndex].src ?? "";
      audio.load();
    }
  }, [playback.partIndex, parts]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const canPlay = mode === "practice" || !playback.finished;

  const submit = useCallback(
    async (finalAnswers: Record<string, Answer>) => {
      setPhase("submitting");
      audioRef.current?.pause();
      const timeSpent = Math.round((Date.now() - startedAt.current) / 1000);
      const res = await submitPractice(
        set,
        mode,
        finalAnswers,
        timeSpent,
        Object.fromEntries([...flags].map((f) => [f, true])),
        {},
        testType,
      );
      localStorage.removeItem(storageKey(set.meta.id));
      setResults(res.results);
      setRawScore(res.rawScore);
      setResTotal(res.total);
      setBand(res.band);
      setPhase("results");
    },
    [mode, set, flags],
  );

  const isTargeted = set.practiceMode === "targeted";

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{set.meta.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {isTargeted
            ? `${effectiveQuestionCount(set)} questions · ${locale === "zh" ? "专项听力训练" : "Targeted Listening drill"}`
            : `${effectiveQuestionCount(set)} questions · 4 parts · real audio`}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => startAttempt("practice")} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.practiceMode")}</p>
            <p className="mt-1 text-sm text-muted">{isTargeted ? (locale === "zh" ? "短篇专项练习，可随时重听" : "Short focused drill with replay") : t("practice.flexible")}</p>
          </button>
          {!isTargeted && (
            <button onClick={() => startAttempt("exam")} className="card card-pad text-left hover:border-accent">
              <p className="font-semibold">{t("practice.examMode")}</p>
              <p className="mt-1 text-sm text-muted">{t("listening.onePlay")}</p>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "resume") {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{locale === "zh" ? "继续进行中的听力" : "Resume in-progress listening"}</h1>
        <p className="mt-2 text-sm text-muted">
          {locale === "zh" ? "发现未完成的听力。可以继续或重新开始。" : "We found an unfinished listening attempt. Resume or start over."}
        </p>
        <div className="mt-6 flex gap-3">
          <button className="btn-primary" onClick={() => setPhase("running")}>{locale === "zh" ? "继续" : "Resume"}</button>
          <button className="btn-secondary" onClick={() => { localStorage.removeItem(storageKey(set.meta.id)); setAnswers({}); setFlags(new Set()); setPlayback(initialListeningPlaybackState()); setCurrent(0); startedAt.current = Date.now(); setPhase("intro"); }}>{locale === "zh" ? "重新开始" : "Start over"}</button>
        </div>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ResultsView set={set} results={results} rawScore={rawScore} total={resTotal} band={band} answers={answers} mode={mode} />
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
  const answered = questions.reduce((n, x) => n + answeredScoredUnitCount(x, answers[x.id]), 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Audio element (hidden in exam mode; visible controls in practice mode) */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls={mode === "practice"}
        className="mb-3 w-full"
        preload="none"
      />

      {/* Player */}
      <div className="card card-pad mb-4">
        <div className="flex items-center gap-3">
          {!playing ? (
            <button className="btn-primary" onClick={playAudio} disabled={!canPlay}>
              <Play className="h-4 w-4" /> {playback.finished && mode === "exam" ? t("listening.onePlay") : t("listening.playAudio")}
            </button>
          ) : mode === "practice" ? (
            <button className="btn-secondary" onClick={pauseAudio}>
              <Pause className="h-4 w-4" />
            </button>
          ) : null}
          {mode === "practice" && (
            <button className="btn-secondary" onClick={replay}>
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted">
              {parts[playback.partIndex]?.title ?? ""}
              {mode === "exam" && playback.finished ? ` · ${t("listening.onePlay")}` : ""}
            </p>
          </div>
          <span className="text-sm font-semibold">{answered}/{scoredUnitCountForQuestions(questions)}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transcript in practice mode after playback only; hidden in exam mode */}
        {mode === "practice" && playback.finished && (
          <div className="card card-pad max-h-[70vh] overflow-y-auto">
            <h2 className="mb-2 text-sm font-semibold">{t("listening.transcript")}</h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{transcript}</div>
          </div>
        )}

        {/* Questions */}
        <div>
          <div className="mb-3 flex flex-wrap gap-1">
            {groups.map((g) => (
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
                  if (next.has(q.id)) next.delete(q.id);
                  else next.add(q.id);
                  return next;
                })
              }
              range={scoredUnitRange(questions, current)}
              total={scoredUnitCountForQuestions(questions)}
              visual={questionUsesVisual(q) ? set.visual : undefined}
              stimulus={set.taskStimulus}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              <ChevronLeft className="h-4 w-4" /> {t("common.previous")}
            </button>
            <button className="btn-ghost" onClick={() => setFlags((prev) => { const n = new Set(prev); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })}>
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

// Approximate duration per audio part for the progress bar (real durations are
// read from the audio element, but a per-part weighting keeps the bar stable).
function estimatePartDuration(src: string): number {
  // Reasonable speech estimate (~150 wpm) used only for the composite progress bar.
  const base = 60;
  const part = Number(src.match(/part(\d+)\.mp3/)?.[1] ?? 1);
  return base * (part === 4 ? 1.3 : part === 3 ? 1.1 : 1);
}
