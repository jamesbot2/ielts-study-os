"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeSet, WritingPrompt, Question } from "@/types/ielts";
import { apiPost } from "@/lib/client/api";
import { QuestionPanel } from "@/components/reading-runner";
import { BandBadge, Spinner } from "@/components/ui";
import { Play } from "lucide-react";

type Answer = string | string[] | Record<string, string>;

interface SectionDef {
  key: string;
  title: string;
  durationSeconds: number;
}

interface SectionResult {
  rawScore?: number;
  total?: number;
  band?: number;
}

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
  const [phase, setPhase] = useState<"intro" | "section-intro" | "running" | "submitting" | "results">("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<Record<string, SectionResult> | null>(null);
  const [overallBand, setOverallBand] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionStart = useRef<number>(Date.now());

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

  const startAttempt = useCallback(async () => {
    const res = await apiPost<{ attemptId: string }>("/api/mock", { kind, testType });
    setAttemptId(res.attemptId);
  }, [kind, testType]);

  const begin = async () => {
    setError(null);
    try {
      if (!attemptId) await startAttempt();
      setPhase("section-intro");
    } catch (e) {
      setError(String(e));
    }
  };

  const beginSection = () => {
    sectionStart.current = Date.now();
    setTimeLeft(currentSection.durationSeconds);
    setPhase("running");
    timerRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - sectionStart.current) / 1000);
      const remaining = currentSection.durationSeconds - elapsed;
      setTimeLeft(remaining);
      setSectionTimes((t) => ({ ...t, [currentSection.key]: elapsed }));
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        finishSection();
      }
    }, 1000);
  };

  const finishSection = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - sectionStart.current) / 1000);
    setSectionTimes((t) => ({ ...t, [currentSection.key]: elapsed }));

    if (sectionIndex + 1 < sections.length) {
      setSectionIndex((i) => i + 1);
      setPhase("section-intro");
    } else {
      setPhase("submitting");
      await submitAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, sectionIndex, sections.length]);

  async function submitAll() {
    try {
      const sectionsPayload: Record<string, { answers: Record<string, Answer>; timeSpentSeconds: number }> = {};
      for (const s of sections) {
        sectionsPayload[s.key] = {
          answers: answers[s.key] ?? {},
          timeSpentSeconds: sectionTimes[s.key] ?? 0,
        };
      }
      const res = await apiPost<{ overallBand: number; sections: Record<string, SectionResult> }>(
        `/api/mock/${attemptId}`,
        { sections: sectionsPayload },
      );
      setResults(res.sections);
      setOverallBand(res.overallBand);
      setPhase("results");
    } catch (e) {
      setError(String(e));
      setPhase("running");
    }
  }

  const setAnswer = (qid: string, value: Answer) => {
    const key = currentSection.key;
    setAnswers((prev) => ({ ...prev, [key]: { ...prev[key], [qid]: value } }));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (phase === "intro") {
    return (
      <FullScreen>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold capitalize">{kind.replace(/_/g, " ")} Mock</h1>
          <p className="mt-2 text-sm text-muted">
            {testType === "academic" ? "Academic" : "General Training"} · computer-style mock
          </p>
          <div className="card card-pad mt-6">
            <h2 className="mb-2 font-semibold">Instructions</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>The timer runs continuously; there is no pause.</li>
              <li>Listening audio plays once. Reading and Writing are strictly timed.</li>
              <li>Answers are saved automatically. If the page refreshes, you can resume.</li>
              <li>No feedback is shown until the whole mock is submitted.</li>
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
          <button className="btn-primary mt-6" onClick={begin}>Start mock exam</button>
        </div>
      </FullScreen>
    );
  }

  if (phase === "section-intro") {
    return (
      <FullScreen>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm uppercase tracking-wide text-muted">Section {sectionIndex + 1} of {sections.length}</p>
          <h1 className="mt-2 text-2xl font-semibold">{currentSection.title}</h1>
          <p className="mt-2 text-sm text-muted">{Math.round(currentSection.durationSeconds / 60)} minutes</p>
          <button className="btn-primary mt-6" onClick={beginSection}>Start section</button>
        </div>
      </FullScreen>
    );
  }

  if (phase === "submitting") {
    return (
      <FullScreen>
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-8 w-8" />
          <p className="mt-4 text-sm text-muted">Submitting your mock…</p>
        </div>
      </FullScreen>
    );
  }

  if (phase === "results" && results) {
    return (
      <FullScreen>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold">Mock results</h1>
          <div className="card card-pad mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">Overall band</p>
              <BandBadge band={overallBand} />
            </div>
            <div className="mt-4 space-y-2">
              {sections.map((s) => {
                const r = results[s.key];
                return (
                  <div key={s.key} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="text-sm font-medium">{s.title}</span>
                    {r?.band != null ? <BandBadge band={r.band} /> : <span className="text-xs text-muted">—</span>}
                    {r?.rawScore != null && <span className="text-xs text-muted">{r.rawScore}/{r.total}</span>}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted">Raw-score conversion uses published approximate tables; exact thresholds may vary between test versions.</p>
          </div>
          <a href="/mock" className="btn-primary mt-6 inline-flex">Back to mocks</a>
        </div>
      </FullScreen>
    );
  }

  // Running
  const questions = currentQuestions();
  return (
    <FullScreen>
      {currentSection.key === "writing" ? (
        <WritingSection prompts={writingPrompts} answers={answers.writing ?? {}} onAnswer={(qid, v) => setAnswer(qid, v)} />
      ) : (
        <QuestionSection
          title={currentSection.title}
          questions={questions}
          answers={answers[currentSection.key] ?? {}}
          onAnswer={setAnswer}
          listening={currentSection.key === "listening"}
          transcript={currentSection.key === "listening" ? listeningSet?.audio?.transcript ?? "" : ""}
          passages={currentSection.key === "reading" ? readingSet?.passages ?? [] : []}
        />
      )}
      <FooterBar timeLeft={timeLeft} answered={countAnswered(answers[currentSection.key] ?? {})} total={currentSection.key === "writing" ? 2 : questions.length} onFinish={finishSection} />
    </FullScreen>
  );
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background">{children}</div>;
}

function FooterBar({ timeLeft, answered, total, onFinish }: { timeLeft: number; answered: number; total: number; onFinish: () => void }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-surface px-4 py-3">
      <span className="text-sm text-muted">{answered}/{total} answered</span>
      <span className={`rounded-md px-3 py-1 text-sm font-semibold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
        {formatTime(timeLeft)}
      </span>
      <button className="btn-primary" onClick={onFinish}>Submit section</button>
    </div>
  );
}

function QuestionSection({
  title,
  questions,
  answers,
  onAnswer,
  listening,
  transcript,
  passages,
}: {
  title: string;
  questions: Question[];
  answers: Record<string, Answer>;
  onAnswer: (qid: string, v: Answer) => void;
  listening: boolean;
  transcript: string;
  passages: PracticeSet["passages"];
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  const q = questions[current];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap gap-1 border-b border-border bg-gray-50 px-3 py-2">
        {questions.map((question, i) => {
          const a = answers[question.id];
          const isAnswered = a !== undefined && a !== "" && !(Array.isArray(a) && a.length === 0);
          return (
            <button key={question.id} onClick={() => setCurrent(i)} className={`h-8 w-8 rounded text-xs ${i === current ? "bg-accent text-white" : isAnswered ? "bg-green-200" : "bg-white border border-border"}`}>
              {i + 1}
            </button>
          );
        })}
      </div>

      {listening && (
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2">
          <button
            className="btn-secondary"
            disabled={played}
            onClick={() => {
              setPlaying(true);
              setPlayed(true);
              setTimeout(() => setPlaying(false), 60000);
            }}
          >
            <Play className="h-4 w-4" /> {played ? "Played" : "Play audio (once)"}
          </button>
          {playing && <span className="text-xs text-muted">Playing… (transcript shown below)</span>}
        </div>
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
        {listening && playing && (
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto border-r border-border p-4 text-sm text-muted">
            {transcript}
          </div>
        )}

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
          {q ? (
            <QuestionPanel
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(v) => onAnswer(q.id, v)}
              flagged={false}
              onToggleFlag={() => {}}
              index={current}
              total={questions.length}
            />
          ) : null}
          <div className="mt-4 flex justify-between">
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>Previous</button>
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1}>Next</button>
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
