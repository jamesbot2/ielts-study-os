"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeSet, WritingPrompt, Question } from "@/types/ielts";
import { startMock, finishMock, saveMockState, type MockSectionResult, type MockCompleteInput } from "@/lib/practice/mock";
import { QuestionPanel } from "@/components/reading-runner";
import { scoredUnitRange, scoredUnitCountForQuestions } from "@/lib/scoring/units";
import { BandBadge, Spinner } from "@/components/ui";
import { useI18n } from "@/components/i18n-provider";
import {
  initialListeningPlaybackState,
  playbackStart,
  playbackProgress,
  playbackAdvance,
  playbackFinish,
  type ListeningPlaybackState,
} from "@/lib/practice/listening-state";
import { Play, Flag } from "lucide-react";

type Answer = string | string[] | Record<string, string>;

interface SectionDef {
  key: string;
  title: string;
  durationSeconds: number;
}

interface PersistedMock {
  attemptId: string;
  kind: string;
  sectionIndex: number;
  answers: Record<string, Record<string, Answer>>;
  sectionTimes: Record<string, number>;
  flags: Record<string, Record<string, boolean>>;
  deadline: number | null; // absolute ms timestamp for the current section
  phase: "running" | "section-intro";
  listening: ListeningPlaybackState;
  currentQuestion: Record<string, number>;
}

const storageKey = (kind: string) => `ielts-mock:${kind}`;


export function MockRunner({
  kind,
  testType,
  listeningSet,
  readingSet,
  writingPrompts,
}: {
  kind: string;
  testType: "academic" | "general";
  listeningSet: PracticeSet | null;
  readingSet: PracticeSet | null;
  writingPrompts: WritingPrompt[];
}) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"intro" | "resume" | "section-intro" | "running" | "submitting" | "results">("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, Record<string, boolean>>>({});
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [listening, setListening] = useState<ListeningPlaybackState>(initialListeningPlaybackState());
  const [currentQuestion, setCurrentQuestion] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, MockSectionResult> | null>(null);
  const [gradedAverage, setGradedAverage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumedRef = useRef(false);

  const sections: SectionDef[] = [
    ...(listeningSet ? [{ key: "listening", title: "Listening", durationSeconds: 35 * 60 }] : []),
    ...(readingSet ? [{ key: "reading", title: "Reading", durationSeconds: 60 * 60 }] : []),
    ...(writingPrompts.length ? [{ key: "writing", title: "Writing", durationSeconds: 60 * 60 }] : []),
  ];

  const currentSection = sections[sectionIndex];

  const currentQuestions = (): Question[] => {
    if (!currentSection) return [];
    if (currentSection.key === "listening" && listeningSet) return listeningSet.questions;
    if (currentSection.key === "reading" && readingSet) return readingSet.questions;
    return [];
  };

  // On mount: detect an in-progress mock and offer resume, restoring ALL state
  // including the absolute deadline, flags, and listening playback state.
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(kind));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as PersistedMock;
        if (saved.attemptId && saved.kind === kind) {
          setAttemptId(saved.attemptId);
          setSectionIndex(saved.sectionIndex);
          setAnswers(saved.answers ?? {});
          setSectionTimes(saved.sectionTimes ?? {});
          setFlags(saved.flags ?? {});
          setDeadline(saved.deadline ?? null);
          setListening(saved.listening ?? initialListeningPlaybackState());
          setCurrentQuestion(saved.currentQuestion ?? {});
          setPhase("resume");
        }
      } catch {
        localStorage.removeItem(storageKey(kind));
      }
    }
  }, [kind]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const persist = useCallback(
    (overrides: Partial<PersistedMock> = {}) => {
      if (!attemptId) return;
      const current: PersistedMock = {
        attemptId,
        kind,
        sectionIndex,
        answers,
        sectionTimes,
        flags,
        deadline,
        phase: phase === "section-intro" ? "section-intro" : "running",
        listening,
        currentQuestion,
      };
      localStorage.setItem(storageKey(kind), JSON.stringify({ ...current, ...overrides }));
    },
    [attemptId, kind, sectionIndex, answers, sectionTimes, flags, deadline, phase, listening, currentQuestion],
  );

  const begin = async () => {
    setError(null);
    try {
      const id = await startMock(kind, testType);
      setAttemptId(id);
      setPhase("section-intro");
    } catch (e) {
      setError(String(e));
    }
  };

  function armTimer(absoluteDeadline: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((absoluteDeadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        finishSection();
      }
    }, 1000);
  }

  function startSectionTimer() {
    const d = Date.now() + currentSection.durationSeconds * 1000;
    setDeadline(d);
    setTimeLeft(currentSection.durationSeconds);
    armTimer(d);
  }

  const resume = () => {
    // If we were between sections, show the section intro again.
    if (phase === "resume") {
      if (deadline == null) {
        setPhase("section-intro");
        return;
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        // Timer already expired while away: advance/finish immediately.
        setPhase("running");
        finishSection();
        return;
      }
      setTimeLeft(Math.round(remaining / 1000));
      setPhase("running");
      armTimer(deadline);
    }
  };

  const discardAndRestart = () => {
    localStorage.removeItem(storageKey(kind));
    setAttemptId(null);
    setSectionIndex(0);
    setAnswers({});
    setSectionTimes({});
    setFlags({});
    setDeadline(null);
    setListening(initialListeningPlaybackState());
    setCurrentQuestion({});
    setPhase("intro");
  };

  const beginSection = () => {
    setPhase("running");
    startSectionTimer();
  };

  const finishSection = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const key = currentSection?.key ?? "";
    const start = deadline ? deadline - currentSection.durationSeconds * 1000 : Date.now();
    const elapsed = Math.max(0, Math.round((Date.now() - start) / 1000));
    const nextTimes = { ...sectionTimes, [key]: elapsed };
    setSectionTimes(nextTimes);

    if (attemptId) {
      await saveMockState(attemptId, { sectionIndex, answers, sectionTimes: nextTimes, flags });
    }

    if (sectionIndex + 1 < sections.length) {
      setSectionIndex((i) => i + 1);
      setDeadline(null);
      setPhase("section-intro");
    } else {
      setPhase("submitting");
      await submitAll(nextTimes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, sectionIndex, sections.length, deadline, attemptId, answers, flags, sectionTimes]);

  async function submitAll(nextTimes: Record<string, number> = sectionTimes) {
    try {
      const input: MockCompleteInput = {};
      if (sections.some((s) => s.key === "listening") && listeningSet) {
        input.listening = { answers: answers.listening ?? {}, timeSpentSeconds: nextTimes.listening ?? 0 };
      }
      if (sections.some((s) => s.key === "reading") && readingSet) {
        input.reading = { answers: answers.reading ?? {}, timeSpentSeconds: nextTimes.reading ?? 0 };
      }
      const res = await finishMock(attemptId!, testType, listeningSet, readingSet, input);
      localStorage.removeItem(storageKey(kind));
      setResults(res.sections);
      setGradedAverage(res.gradedAverage);
      setPhase("results");
    } catch (e) {
      setError(String(e));
      setPhase("running");
    }
  }

  const setAnswer = (qid: string, value: Answer) => {
    const key = currentSection?.key ?? "";
    setAnswers((prev) => {
      const next = { ...prev, [key]: { ...prev[key], [qid]: value } };
      return next;
    });
  };

  const toggleFlag = (qid: string) => {
    const key = currentSection?.key ?? "";
    setFlags((prev) => {
      const sectionFlags = { ...(prev[key] ?? {}) };
      if (sectionFlags[qid]) delete sectionFlags[qid];
      else sectionFlags[qid] = true;
      return { ...prev, [key]: sectionFlags };
    });
  };

  const onListeningStateChange = (next: ListeningPlaybackState) => {
    setListening(next);
  };

  const onCurrentQuestionChange = (qid: number) => {
    const key = currentSection?.key ?? "";
    setCurrentQuestion((prev) => ({ ...prev, [key]: qid }));
  };

  // Persist on every relevant change.
  useEffect(() => {
    if (phase === "running" || phase === "section-intro") persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, sectionTimes, flags, deadline, phase, listening, currentQuestion]);

  if (phase === "intro") {
    return (
      <FullScreen>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold capitalize">{kind.replace(/_/g, " ")} Mock</h1>
          <p className="mt-2 text-sm text-muted">
            {testType === "academic" ? "Academic" : "General Training"} · computer-style mock
          </p>
          <div className="card card-pad mt-6">
            <h2 className="mb-2 font-semibold">{t("mock.instructions")}</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>{t("mock.instructionTimer")}</li>
              <li>{t("mock.instructionListening")}</li>
              <li>{t("mock.instructionAutosave")}</li>
              <li>{t("mock.instructionNoFeedback")}</li>
            </ul>
            <div className="mt-4 space-y-1 text-sm">
              {sections.map((s, i) => (
                <div key={s.key} className="flex justify-between">
                  <span>{i + 1}. {s.title}</span>
                  <span className="text-muted">{Math.round(s.durationSeconds / 60)} min</span>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button className="btn-primary mt-6" onClick={begin}>{t("mock.start")}</button>
        </div>
      </FullScreen>
    );
  }

  if (phase === "resume") {
    return (
      <FullScreen>
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold">{t("mock.resumeTitle")}</h1>
          <p className="mt-2 text-sm text-muted">
            {t("mock.resumeMessage")}
          </p>
          <div className="mt-6 flex gap-3">
            <button className="btn-primary" onClick={resume}>{t("mock.resume")}</button>
            <button className="btn-secondary" onClick={discardAndRestart}>{t("mock.startOver")}</button>
          </div>
        </div>
      </FullScreen>
    );
  }

  if (phase === "section-intro") {
    return (
      <FullScreen>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm uppercase tracking-wide text-muted">{t("mock.sectionOf")} {sectionIndex + 1} / {sections.length}</p>
          <h1 className="mt-2 text-2xl font-semibold">{currentSection.title}</h1>
          <p className="mt-2 text-sm text-muted">{Math.round(currentSection.durationSeconds / 60)} {t("common.minutes")}</p>
          <button className="btn-primary mt-6" onClick={beginSection}>{t("mock.startSection")}</button>
        </div>
      </FullScreen>
    );
  }

  if (phase === "submitting") {
    return (
      <FullScreen>
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-8 w-8" />
          <p className="mt-4 text-sm text-muted">{t("mock.submitting")}</p>
        </div>
      </FullScreen>
    );
  }

  if (phase === "results" && results) {
    return (
      <FullScreen>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold">{t("mock.mockResults")}</h1>
          <div className="card card-pad mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{t("mock.gradedSections")}</p>
              <BandBadge band={gradedAverage} />
            </div>
            <div className="mt-4 space-y-2">
              {sections.map((s) => {
                const r = results[s.key];
                const isWriting = s.key === "writing";
                return (
                  <div key={s.key} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="text-sm font-medium">{s.title}</span>
                    {isWriting ? (
                      <span className="text-xs text-muted">{t("mock.submittedNotGraded")}</span>
                    ) : r?.band != null ? (
                      <BandBadge band={r.band} />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                    {r?.rawScore != null && <span className="text-xs text-muted">{r.rawScore}/{r.total}</span>}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted">
              {t("mock.resultNote")}
            </p>
          </div>
          <a href="/mock" className="btn-primary mt-6 inline-flex">{t("mock.backToMocks")}</a>
        </div>
      </FullScreen>
    );
  }

  // Running
  const questions = currentQuestions();
  const sectionFlags = flags[currentSection?.key ?? ""] ?? {};
  const answered = countAnswered(answers[currentSection?.key ?? ""] ?? {});

  return (
    <FullScreen>
      {currentSection?.key === "writing" ? (
        <WritingSection prompts={writingPrompts} answers={answers.writing ?? {}} onAnswer={(qid, v) => setAnswer(qid, v)} />
      ) : (
        <QuestionSection
          questions={questions}
          answers={answers[currentSection?.key ?? ""] ?? {}}
          flags={sectionFlags}
          onAnswer={setAnswer}
          onToggleFlag={toggleFlag}
          listening={currentSection?.key === "listening"}
          audioParts={currentSection?.key === "listening" ? listeningSet?.audio?.parts?.filter((p) => p.src) ?? [] : []}
          playbackState={listening}
          initialQuestion={currentQuestion[currentSection?.key ?? ""] ?? 0}
          onListeningStateChange={onListeningStateChange}
          onCurrentQuestionChange={onCurrentQuestionChange}
          passages={currentSection?.key === "reading" ? readingSet?.passages ?? [] : []}
        />
      )}
      <FooterBar
        timeLeft={timeLeft}
        answered={answered}
        total={currentSection?.key === "writing" ? 2 : questions.length}
        onFinish={finishSection}
      />
    </FullScreen>
  );
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background">{children}</div>;
}

function FooterBar({ timeLeft, answered, total, onFinish }: { timeLeft: number; answered: number; total: number; onFinish: () => void }) {
  const { t } = useI18n();
  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-surface px-4 py-3">
      <span className="text-sm text-muted">{answered}/{total} {t("common.answered")}</span>
      <span className={`rounded-md px-3 py-1 text-sm font-semibold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
        {formatTime(timeLeft)}
      </span>
      <button className="btn-primary" onClick={onFinish}>{t("mock.submitSection")}</button>
    </div>
  );
}

function QuestionSection({
  questions,
  answers,
  flags,
  onAnswer,
  onToggleFlag,
  listening,
  audioParts,
  playbackState,
  initialQuestion,
  onListeningStateChange,
  onCurrentQuestionChange,
  passages,
}: {
  questions: Question[];
  answers: Record<string, Answer>;
  flags: Record<string, boolean>;
  onAnswer: (qid: string, v: Answer) => void;
  onToggleFlag: (qid: string) => void;
  listening: boolean;
  audioParts: { part: number; title: string; src?: string }[];
  playbackState: ListeningPlaybackState;
  initialQuestion: number;
  onListeningStateChange: (state: ListeningPlaybackState) => void;
  onCurrentQuestionChange: (index: number) => void;
  passages: PracticeSet["passages"];
}) {
  const [current, setCurrent] = useState(initialQuestion);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPersistRef = useRef(0);
  const { t } = useI18n();

  const q = questions[current];
  const partIndex = playbackState.partIndex;
  const finished = playbackState.finished;

  // Keep the audio element pointing at the correct part and resume offset.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !listening || audioParts.length === 0) return;
    const src = audioParts[partIndex]?.src ?? "";
    if (audio.src !== new URL(src, window.location.href).href) {
      audio.src = src;
      audio.load();
    }
    if (playbackState.currentTime > 0 && !finished) {
      audio.currentTime = playbackState.currentTime;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partIndex, listening, audioParts]);

  const playAudio = () => {
    if (finished || audioParts.length === 0) return;
    const audio = audioRef.current;
    if (audio) {
      if (audio.src !== new URL(audioParts[partIndex]?.src ?? "", window.location.href).href) {
        audio.src = audioParts[partIndex]?.src ?? "";
        audio.load();
      }
      if (playbackState.currentTime > 0 && audio.currentTime === 0) {
        audio.currentTime = playbackState.currentTime;
      }
      void audio.play();
      setPlaying(true);
      onListeningStateChange(playbackStart(playbackState));
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const now = Date.now();
    // Throttle persistence to at most once per second.
    if (now - lastPersistRef.current < 1000) return;
    lastPersistRef.current = now;
    onListeningStateChange(playbackProgress(playbackState, audio.currentTime, now));
  };

  const handleEnded = () => {
    const next = partIndex + 1;
    if (next < audioParts.length) {
      const nextState = playbackAdvance(playbackState, next);
      onListeningStateChange(nextState);
      const audio = audioRef.current;
      if (audio) {
        audio.src = audioParts[next].src ?? "";
        audio.load();
        void audio.play();
      }
    } else {
      setPlaying(false);
      onListeningStateChange(playbackFinish(playbackState));
    }
  };

  const goToQuestion = (i: number) => {
    setCurrent(i);
    onCurrentQuestionChange(i);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap gap-1 border-b border-border bg-gray-50 px-3 py-2">
        {questions.map((question, i) => {
          const a = answers[question.id];
          const isAnswered = a !== undefined && a !== "" && !(Array.isArray(a) && a.length === 0);
          const isFlagged = flags[question.id];
          return (
            <button
              key={question.id}
              onClick={() => goToQuestion(i)}
              className={`flex h-8 min-w-8 items-center justify-center gap-1 rounded px-1.5 text-xs ${
                i === current
                  ? "bg-accent text-white"
                  : isAnswered
                    ? "bg-green-100 text-green-800"
                    : isFlagged
                      ? "bg-amber-100 text-amber-800"
                      : "bg-white border border-border"
              }`}
            >
              {i + 1}
              {isFlagged && <Flag className="h-3 w-3" />}
            </button>
          );
        })}
      </div>

      {listening && (
        <>
          <audio ref={audioRef} onEnded={handleEnded} onTimeUpdate={handleTimeUpdate} onPlay={() => setPlaying(true)} className="hidden" />
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2">
            <button className="btn-secondary" disabled={finished} onClick={playAudio}>
              <Play className="h-4 w-4" /> {finished ? t("mock.played") : playbackState.started && !playing ? t("mock.resumeAudio") : t("mock.playAudioOnce")}
            </button>
            {playing && <span className="text-xs text-muted">Playing… {audioParts[partIndex]?.title}</span>}
            {finished && <span className="text-xs text-muted">{t("mock.audioComplete")}</span>}
          </div>
        </>
      )}

      <div className="grid flex-1 lg:grid-cols-2">
        {!listening && passages.length > 0 && (
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto border-r border-border p-4">
            {passages.map((p) => (
              <div key={p.id}>
                <h2 className="mb-2 font-semibold">{p.title}</h2>
                <div className="passage-text whitespace-pre-wrap text-sm">{p.body}</div>
              </div>
            ))}
          </div>
        )}

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
          {q ? (
            <QuestionPanel
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(v) => onAnswer(q.id, v)}
              flagged={Boolean(flags[q.id])}
              onToggleFlag={() => onToggleFlag(q.id)}
              range={scoredUnitRange(questions, current)}
              total={scoredUnitCountForQuestions(questions)}
            />
          ) : null}
          <div className="mt-4 flex justify-between">
            <button className="btn-secondary" onClick={() => goToQuestion(Math.max(0, current - 1))} disabled={current === 0}>{t("common.previous")}</button>
            <button className="btn-secondary" onClick={() => goToQuestion(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}>{t("common.next")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WritingSection({ prompts, answers, onAnswer }: { prompts: WritingPrompt[]; answers: Record<string, Answer>; onAnswer: (qid: string, v: Answer) => void }) {
  const [task, setTask] = useState(0);
  const p = prompts[task];
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex gap-2">
        {prompts.map((pr, i) => (
          <button key={pr.id} onClick={() => setTask(i)} className={task === i ? "btn-primary" : "btn-secondary"}>
            Task {pr.task}
          </button>
        ))}
      </div>
      {p && (
        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="card card-pad">
            <p className="text-sm font-medium">{p.prompt}</p>
            {p.visualDescription && <p className="mt-2 text-xs text-muted">Visual: {p.visualDescription}</p>}
          </div>
          <textarea
            className="min-h-[40vh] w-full rounded-md border border-border p-3 text-sm"
            value={typeof answers[p.id] === "string" ? (answers[p.id] as string) : ""}
            onChange={(e) => onAnswer(p.id, e.target.value)}
            spellCheck={false}
            placeholder={`Write your Task ${p.task} answer (min ${p.wordLimit} words)…`}
          />
        </div>
      )}
    </div>
  );
}

function countAnswered(answers: Record<string, Answer>): number {
  return Object.values(answers).filter((a) => a !== undefined && a !== "" && !(Array.isArray(a) && a.length === 0)).length;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
