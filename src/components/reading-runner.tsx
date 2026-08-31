"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PracticeSet, Question } from "@/types/ielts";
import { useI18n } from "@/components/i18n-provider";
import { apiPost } from "@/lib/client/api";
import { BandBadge, Spinner } from "@/components/ui";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  Minus,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type Answer = string | string[] | Record<string, string>;

interface Result {
  questionId: string;
  correct: boolean;
  userAnswer: Answer;
  correctAnswer: string;
  timeSpentSeconds: number;
  flagged: boolean;
}

export function ReadingRunner({ set }: { set: PracticeSet }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "submitting" | "results">("intro");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [split, setSplit] = useState(50);
  const [hidePassage, setHidePassage] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [results, setResults] = useState<Result[] | null>(null);
  const [rawScore, setRawScore] = useState(0);
  const [band, setBand] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const startRef = useRef<number | null>(null);

  const questions = set.questions;
  const passages = set.passages;

  const submit = useCallback(
    async (finalAnswers: Record<string, Answer>) => {
      setPhase("submitting");
      const timeSpent = Math.round((Date.now() - (startRef.current ?? Date.now())) / 1000);
      try {
        const res = await apiPost<{
          rawScore: number;
          total: number;
          band: number;
          results: Result[];
        }>("/api/practice/submit", {
          setId: set.meta.id,
          mode,
          answers: finalAnswers,
          timeSpentSeconds: timeSpent,
          flags: Object.fromEntries([...flags].map((f) => [f, true])),
        });
        setResults(res.results);
        setRawScore(res.rawScore);
        setBand(res.band);
        setPhase("results");
      } catch (e) {
        alert(String(e));
        setPhase("running");
      }
    },
    [flags, mode, set.meta.id],
  );

  // Timer
  useEffect(() => {
    if (phase !== "running") return;
    startRef.current = startRef.current ?? Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startRef.current!) / 1000);
      if (mode === "exam") {
        const remaining = 60 * 60 - elapsed;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          submit(answers);
        }
      } else {
        setTimeLeft(elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, mode, submit, answers]);

  const setAnswer = (questionId: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleFlag = (id: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addHighlight = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 1) {
      setHighlights((prev) => [...prev, text]);
    }
    sel?.removeAllRanges();
  };

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{set.meta.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {set.questions.length} questions · {set.meta.testType === "academic" ? "Academic" : "General Training"} Reading
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => { setMode("practice"); setPhase("running"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.practiceMode")}</p>
            <p className="mt-1 text-sm text-muted">{t("practice.flexible")}</p>
          </button>
          <button onClick={() => { setMode("exam"); setPhase("running"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.examMode")}</p>
            <p className="mt-1 text-sm text-muted">60 minutes · {t("practice.strict")}</p>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <ResultsView
        set={set}
        results={results}
        rawScore={rawScore}
        band={band}
        answers={answers}
        mode={mode}
      />
    );
  }

  const q = questions[current];
  const answered = questions.filter((x) => answers[x.id] !== undefined && answers[x.id] !== "").length;

  return (
    <div className="flex h-screen flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{set.meta.title}</span>
          <span className="text-xs text-muted">
            {answered}/{questions.length} {t("common.answered")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn-ghost px-2" onClick={() => setFontScale((s) => Math.max(0.8, s - 0.1))} aria-label="Decrease font">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-xs">{(fontScale * 100).toFixed(0)}%</span>
          <button className="btn-ghost px-2" onClick={() => setFontScale((s) => Math.min(1.4, s + 0.1))} aria-label="Increase font">
            <Plus className="h-4 w-4" />
          </button>
          <button className="btn-ghost px-2" onClick={addHighlight} aria-label="Highlight selection">
            <Highlighter className="h-4 w-4" />
          </button>
          <button className="btn-ghost px-2" onClick={() => setHidePassage((v) => !v)} aria-label="Toggle passage">
            {hidePassage ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <span className={`ml-1 rounded-md px-2 py-1 text-sm font-semibold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
            {formatTime(timeLeft)}
          </span>
          <button className="btn-primary" onClick={() => submit(answers)} disabled={phase === "submitting"}>
            {phase === "submitting" ? <Spinner /> : t("common.submit")}
          </button>
        </div>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1 border-b border-border bg-gray-50 px-3 py-2">
        {questions.map((question, i) => {
          const a = answers[question.id];
          const isAnswered = a !== undefined && a !== "" && !(Array.isArray(a) && a.length === 0);
          return (
            <button
              key={question.id}
              onClick={() => setCurrent(i)}
              className={`h-8 w-8 rounded text-xs font-medium ${
                i === current
                  ? "bg-accent text-white"
                  : flags.has(question.id)
                    ? "bg-yellow-200"
                    : isAnswered
                      ? "bg-green-200"
                      : "bg-white border border-border"
              }`}
              aria-label={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1">
        {!hidePassage && (
          <>
            <div className="overflow-y-auto border-r border-border p-4" style={{ width: `${split}%` }}>
              <div className="passage-text" style={{ fontSize: `${15 * fontScale}px` }}>
                {passages.map((passage) => (
                  <div key={passage.id}>
                    <h2 className="mb-3 text-lg font-semibold">{passage.title}</h2>
                    {renderWithHighlights(passage.body, highlights)}
                  </div>
                ))}
              </div>
            </div>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Adjust panel width"
              className="w-1.5 cursor-col-resize bg-border hover:bg-accent/50"
              onMouseDown={(e) => {
                e.preventDefault();
                const container = (e.target as HTMLElement).parentElement;
                if (!container) return;
                const rect = container.getBoundingClientRect();
                const move = (ev: MouseEvent) => {
                  const pct = Math.min(75, Math.max(25, ((ev.clientX - rect.left) / rect.width) * 100));
                  setSplit(pct);
                };
                const up = () => {
                  window.removeEventListener("mousemove", move);
                  window.removeEventListener("mouseup", up);
                };
                window.addEventListener("mousemove", move);
                window.addEventListener("mouseup", up);
              }}
            />
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="overflow-y-auto p-4" style={{ width: hidePassage ? "100%" : undefined }}>
            <QuestionPanel
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(v) => setAnswer(q.id, v)}
              flagged={flags.has(q.id)}
              onToggleFlag={() => toggleFlag(q.id)}
              index={current}
              total={questions.length}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              <ChevronLeft className="h-4 w-4" /> {t("common.previous")}
            </button>
            <button className="btn-ghost" onClick={() => toggleFlag(q.id)}>
              <Flag className={`h-4 w-4 ${flags.has(q.id) ? "fill-yellow-400" : ""}`} /> {t("reading.flag")}
            </button>
            <button className="btn-secondary" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1}>
              {t("common.next")} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestionPanel({
  question,
  value,
  onChange,
  flagged,
  onToggleFlag,
  index,
  total,
}: {
  question: Question;
  value: Answer | undefined;
  onChange: (v: Answer) => void;
  flagged: boolean;
  onToggleFlag: () => void;
  index: number;
  total: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">
          Question {index + 1} of {total}
        </p>
        <button onClick={onToggleFlag} className={`text-xs ${flagged ? "text-yellow-600" : "text-muted"}`}>
          {flagged ? "★ Flagged" : "☆ Flag"}
        </button>
      </div>
      <p className="mb-4 text-[15px] font-medium leading-relaxed">{question.prompt}</p>

      {question.answerType === "text" || question.answerType === "number" ? (
        <div>
          <input
            className="input max-w-sm"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer"
            autoComplete="off"
          />
          {question.wordLimit ? (
            <p className="mt-1 text-xs text-muted">No more than {question.wordLimit} word(s)</p>
          ) : null}
        </div>
      ) : question.answerType === "single_choice" || question.answerType === "multiple_choice" ? (
        <ul className="space-y-2">
          {question.options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.id);
            return (
              <li key={opt.id}>
                <button
                  onClick={() => {
                    if (question.answerType === "single_choice") {
                      onChange([opt.id]);
                    } else {
                      const cur = Array.isArray(value) ? value : [];
                      onChange(cur.includes(opt.id) ? cur.filter((x) => x !== opt.id) : [...cur, opt.id]);
                    }
                  }}
                  className={`flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm ${
                    selected ? "border-accent bg-accent/5" : "border-border hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold">{opt.label}</span>
                  <span>{opt.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <MatchingInput
          question={question as Extract<Question, { answerType: "matching" | "heading_matching" }>}
          value={value as Record<string, string> | undefined}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export function MatchingInput({
  question,
  value,
  onChange,
}: {
  question: Extract<Question, { answerType: "matching" | "heading_matching" }>;
  value: Record<string, string> | undefined;
  onChange: (v: Record<string, string>) => void;
}) {
  const options = question.options;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <span key={opt.id} className="rounded-md border border-border px-2 py-1 text-xs">
            <span className="font-semibold">{opt.label}</span> {opt.text}
          </span>
        ))}
      </div>
      {question.items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <span className="flex-1 text-sm">{item.text}</span>
          <select
            className="input w-32"
            value={value?.[item.id] ?? ""}
            onChange={(e) => onChange({ ...(value ?? {}), [item.id]: e.target.value })}
          >
            <option value="">—</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function ResultsView({
  set,
  results,
  rawScore,
  band,
  answers,
  mode,
}: {
  set: PracticeSet;
  results: Result[];
  rawScore: number;
  band: number;
  answers: Record<string, Answer>;
  mode: string;
}) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | "incorrect" | "unanswered">("all");
  const correct = results.filter((r) => r.correct).length;

  const filtered = set.questions.filter((q) => {
    const r = results.find((x) => x.questionId === q.id)!;
    if (filter === "incorrect") return !r.correct;
    if (filter === "unanswered") {
      const a = answers[q.id];
      return a == null || a === "" || (Array.isArray(a) && a.length === 0);
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="card card-pad mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Results</h1>
            <p className="text-sm text-muted">
              {correct}/{set.questions.length} correct · {mode} mode
            </p>
          </div>
          <BandBadge band={band} />
        </div>
        <p className="mt-2 text-xs text-muted">{t("scoring.rawToBandNote")}</p>
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "incorrect", "unanswered"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? "btn-primary" : "btn-secondary"}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((q) => {
          const r = results.find((x) => x.questionId === q.id)!;
          return (
            <div key={q.id} className={`card card-pad ${r.correct ? "border-green-200" : "border-red-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{q.prompt}</p>
                <span className={`text-sm font-semibold ${r.correct ? "text-green-600" : "text-red-600"}`}>
                  {r.correct ? "✓" : "✗"}
                </span>
              </div>
              <div className="mt-2 grid gap-1 text-sm">
                <p>
                  <span className="text-muted">{t("reading.yourAnswer")}: </span>
                  {stringify(r.userAnswer) || <em className="text-muted">(blank)</em>}
                </p>
                {!r.correct && (
                  <p>
                    <span className="text-muted">{t("reading.correctAnswer")}: </span>
                    <span className="font-medium text-green-700">{r.correctAnswer}</span>
                  </p>
                )}
              </div>
              <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm">
                <p className="font-medium">Explanation</p>
                <p className="mt-1 text-muted">{q.explanation}</p>
                {q.evidence ? (
                  <p className="mt-2 text-xs">
                    <span className="font-medium">Evidence:</span> {q.evidence}
                  </p>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-muted">
                {t("reading.questionType")}: {q.type} · {t("reading.difficulty")}: {q.difficulty}/5
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderWithHighlights(body: string, highlights: string[]) {
  const paragraphs = body.split("\n").filter((p) => p.trim().length > 0);
  return paragraphs.map((p, i) => {
    let content = p;
    for (const h of highlights) {
      if (!h) continue;
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      content = content.replace(new RegExp(`(${escaped})`, "g"), "<mark>$1</mark>");
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: content }} />;
  });
}

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function stringify(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
