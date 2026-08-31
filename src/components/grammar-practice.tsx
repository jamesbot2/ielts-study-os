"use client";

import { useState } from "react";
import Link from "next/link";
import { grammarExercises } from "@/lib/content/practice/grammar-exercises";
import { recordMistake } from "@/lib/storage/repository";
import { useI18n } from "@/components/i18n-provider";

export function GrammarPractice() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const exercise = grammarExercises[index];

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
    if (index + 1 < grammarExercises.length) {
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
          <p className="text-4xl font-bold">{score} / {grammarExercises.length}</p>
          <p className="mt-2 text-sm text-muted">correct</p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => { setIndex(0); setScore(0); setDone(false); setSelected(null); }}>
              Restart
            </button>
            <Link href="/mistakes" className="btn-secondary">Review mistakes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("grammar.practice")}</h1>
        <span className="text-sm text-muted">{index + 1} / {grammarExercises.length}</span>
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
            {index + 1 < grammarExercises.length ? "Next" : "See results"}
          </button>
        )}
      </div>
    </div>
  );
}
