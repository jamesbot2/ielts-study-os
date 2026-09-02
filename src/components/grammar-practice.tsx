"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { grammarExercises } from "@/lib/content/practice/grammar-exercises";
import { grammarLessons } from "@/lib/content/lessons/grammar";
import { recordMistake } from "@/lib/storage/repository";
import { useI18n } from "@/components/i18n-provider";

const LESSON_SESSION_SIZE = 10;
const MIXED_SESSION_SIZE = 20;

// Deterministic selection (no random ordering, so tests are stable).
function buildSession(lessonId: string | null): typeof grammarExercises {
  if (lessonId) {
    const pool = grammarExercises.filter((e) => e.lessonId === lessonId);
    return pool.slice(0, LESSON_SESSION_SIZE);
  }
  // Mixed: deterministic spread across the whole library.
  const step = Math.max(1, Math.floor(grammarExercises.length / MIXED_SESSION_SIZE));
  const out = [];
  for (let i = 0; i < grammarExercises.length && out.length < MIXED_SESSION_SIZE; i += step) {
    out.push(grammarExercises[i]);
  }
  return out;
}

function GrammarPracticeInner() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const lessonParam = searchParams.get("lesson");

  const lessonOptions = useMemo(() => {
    const withExercises = new Set(grammarExercises.map((e) => e.lessonId));
    return grammarLessons.filter((l) => withExercises.has(l.id));
  }, []);

  const [activeLesson, setActiveLesson] = useState<string | null>(
    lessonParam && lessonOptions.some((l) => l.id === lessonParam) ? lessonParam : null,
  );
  const [session, setSession] = useState<typeof grammarExercises>(() => buildSession(activeLesson));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const exercise = session[index];

  function startSession(lessonId: string | null) {
    const nextSession = buildSession(lessonId);
    setActiveLesson(lessonId);
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  }

  async function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === exercise.correct) {
      setScore((s) => s + 1);
    } else {
      await recordMistake({
        source: "grammar",
        skill: "grammar",
        question: exercise.sentence,
        userAnswer: exercise.options[i],
        correctAnswer: exercise.options[exercise.correct],
        mistakeType: exercise.errorType,
        explanation: exercise.explanation,
        questionType: "grammar",
      });
    }
  }

  function next() {
    setSelected(null);
    if (index + 1 < session.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="container-page mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{t("grammar.practice")}</h1>
        <div className="card card-pad mt-6 text-center">
          <p className="text-4xl font-bold">{score} / {session.length}</p>
          <p className="mt-2 text-sm text-muted">correct</p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => startSession(activeLesson)}>
              {locale === "zh" ? "再来一次" : "Restart"}
            </button>
            <button className="btn-secondary" onClick={() => startSession(null)}>
              {locale === "zh" ? "综合练习" : "Mixed practice"}
            </button>
            <Link href="/mistakes" className="btn-secondary">Review mistakes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{t("grammar.practice")}</h1>
        <span className="text-sm text-muted">{index + 1} / {session.length}</span>
      </div>

      {/* Topic / lesson selector */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => startSession(null)}
          className={`rounded-md border px-2.5 py-1.5 text-xs ${activeLesson === null ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}
        >
          {locale === "zh" ? "综合练习" : "Mixed practice"}
        </button>
        {lessonOptions.map((l) => (
          <button
            key={l.id}
            onClick={() => startSession(l.id)}
            className={`rounded-md border px-2.5 py-1.5 text-xs ${activeLesson === l.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}
          >
            {locale === "zh" ? l.title.zh : l.title.en}
          </button>
        ))}
      </div>

      <div className="card card-pad">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{exercise.topic}</p>
        <p className="mt-2 text-lg font-medium">{exercise.sentence}</p>

        <div className="mt-4 space-y-2">
          {exercise.options.map((opt, i) => {
            const isCorrect = i === exercise.correct;
            const isChosen = i === selected;
            const showState = selected !== null;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={showState}
                className={`flex w-full items-center rounded-md border px-3 py-2.5 text-left text-sm ${
                  showState && isCorrect
                    ? "border-green-400 bg-green-50"
                    : showState && isChosen
                      ? "border-red-400 bg-red-50"
                      : "border-border hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
                <span className="ml-2">{opt}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
            <p className={`font-medium ${selected === exercise.correct ? "text-green-700" : "text-red-700"}`}>
              {selected === exercise.correct ? "✓ Correct" : "✗ Incorrect"}
            </p>
            <p className="mt-1 text-muted">{exercise.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button className="btn-primary mt-4" onClick={next}>
            {index + 1 < session.length ? "Next" : "See results"}
          </button>
        )}
      </div>
    </div>
  );
}

export function GrammarPractice() {
  return (
    <Suspense fallback={<div className="container-page text-sm text-muted">Loading…</div>}>
      <GrammarPracticeInner />
    </Suspense>
  );
}
