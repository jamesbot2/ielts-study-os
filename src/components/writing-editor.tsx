"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WritingPrompt, WritingEvaluation } from "@/types/ielts";
import { useI18n } from "@/components/i18n-provider";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { writingBandFromCriteria } from "@/lib/scoring/scoring";
import {
  getWritingDraft,
  saveWritingDraft,
  saveWritingSubmission,
} from "@/lib/storage/repository";
import { BandBadge, Spinner } from "@/components/ui";
import { Maximize, Minimize, History } from "lucide-react";

const HISTORY_KEY = "ielts-writing-history";

export function WritingEditor({ prompt }: { prompt: WritingPrompt }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [phase, setPhase] = useState<"intro" | "writing" | "evaluating" | "done">("intro");
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(prompt.suggestedMinutes * 60);
  const [fullscreen, setFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Load draft from IndexedDB (history stays in localStorage, bounded)
  useEffect(() => {
    getWritingDraft(prompt.id).then((draft) => {
      if (draft) setText(draft.answer);
    });
    const saved = localStorage.getItem(`${HISTORY_KEY}:${prompt.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setHistory(parsed);
      } catch {
        /* ignore malformed history */
      }
    }
  }, [prompt.id]);

  // Autosave draft to IndexedDB
  useEffect(() => {
    if (phase !== "writing") return;
    const id = setTimeout(() => {
      saveWritingDraft(prompt.id, text);
      localStorage.setItem(`${HISTORY_KEY}:${prompt.id}`, JSON.stringify(history.slice(0, 10)));
    }, 800);
    return () => clearTimeout(id);
  }, [text, history, phase, prompt.id]);

  // Timer
  useEffect(() => {
    if (phase !== "writing") return;
    startedAt.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
      if (mode === "exam") {
        const remaining = prompt.suggestedMinutes * 60 - elapsed;
        setTimeLeft(remaining);
      } else {
        setTimeLeft(elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, mode, prompt.suggestedMinutes]);

  const snapshotDraft = useCallback(() => {
    if (text.trim()) setHistory((h) => [text, ...h.filter((x) => x !== text)].slice(0, 10));
  }, [text]);

  async function evaluate() {
    snapshotDraft();
    setPhase("evaluating");
    setError(null);
    try {
      if (!isAiAvailable()) {
        setError("AI band estimation is unavailable. Your draft remains saved.");
        setPhase("writing");
        return;
      }
      const timeUsedSeconds = Math.round((Date.now() - startedAt.current) / 1000);
      const raw = await getAiClient().evaluateWriting({
        testType: prompt.testType,
        task: prompt.task,
        prompt: prompt.prompt,
        visualDescription: prompt.visualDescription,
        dataTable: prompt.dataTable,
        answer: text,
        wordCount,
        timeUsedSeconds,
      });
      // Deterministically recompute the overall band from criterion scores.
      const overall = writingBandFromCriteria(raw.criterionScores, prompt.task);
      const evaluation: WritingEvaluation = { ...raw, estimatedOverallBand: overall };
      setEvaluation(evaluation);
      await saveWritingSubmission({
        promptId: prompt.id,
        testType: prompt.testType,
        task: prompt.task,
        answer: text,
        wordCount,
        timeUsedSeconds,
        evaluation,
      });
      setPhase("done");
    } catch (e) {
      setError((e as Error).message);
      setPhase("writing");
    }
  }

  async function saveOnly() {
    snapshotDraft();
    setSaving(true);
    try {
      await saveWritingSubmission({
        promptId: prompt.id,
        testType: prompt.testType,
        task: prompt.task,
        answer: text,
        wordCount,
        timeUsedSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        evaluation: null,
      });
    } catch {
      // draft already persisted
    }
    setSaving(false);
    alert(t("common.save") + " ✓");
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs uppercase tracking-wide text-muted">
          {prompt.testType === "academic" ? "Academic" : "General Training"} · Task {prompt.task}
        </p>
        <h1 className="mt-1 text-xl font-semibold">{prompt.title}</h1>
        <div className="card card-pad mt-4">
          <p className="text-[15px] leading-relaxed">{prompt.prompt}</p>
          {prompt.visualDescription && (
            <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-muted">
              <p className="font-medium">Visual description:</p>
              <p className="mt-1">{prompt.visualDescription}</p>
            </div>
          )}
          {prompt.dataTable && (
            <div className="mt-3 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {prompt.dataTable.columns.map((c) => (
                      <th key={c} className="px-3 py-2 text-left">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prompt.dataTable.rows.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      {r.map((cell, j) => (
                        <td key={j} className="px-3 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">
          Minimum {prompt.wordLimit} words · suggested {prompt.suggestedMinutes} minutes
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => { setMode("practice"); setPhase("writing"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.practiceMode")}</p>
            <p className="mt-1 text-sm text-muted">{t("writing.draftHistory")}</p>
          </button>
          <button onClick={() => { setMode("exam"); setPhase("writing"); }} className="card card-pad text-left hover:border-accent">
            <p className="font-semibold">{t("practice.examMode")}</p>
            <p className="mt-1 text-sm text-muted">{t("writing.noSpellcheck")}</p>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done" && evaluation) {
    return <EvaluationView evaluation={evaluation} prompt={prompt} onBack={() => setPhase("writing")} />;
  }

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 flex flex-col bg-surface" : "mx-auto max-w-4xl px-4 py-6"}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Task {prompt.task}</p>
          <h1 className="text-sm font-semibold">{prompt.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-1 text-sm font-semibold ${timeLeft < 300 && mode === "exam" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-muted">{wordCount} {t("writing.wordCount")}</span>
          <button className="btn-ghost px-2" onClick={() => setFullscreen((f) => !f)} aria-label="Fullscreen">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          {mode === "practice" && (
            <button className="btn-ghost px-2" onClick={() => setShowHistory((s) => !s)} aria-label="Draft history">
              <History className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={mode !== "exam"}
            autoCorrect={mode !== "exam" ? "on" : "off"}
            autoCapitalize={mode !== "exam" ? "on" : "off"}
            className="min-h-[50vh] w-full resize-y rounded-md border border-border bg-surface p-4 text-[15px] leading-relaxed focus:outline-accent"
            placeholder="Write your answer here…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={saveOnly} disabled={saving || !text.trim()}>
              {saving ? <Spinner /> : t("common.save")}
            </button>
            <button className="btn-primary" onClick={evaluate} disabled={phase === "evaluating" || !text.trim()}>
              {phase === "evaluating" ? <Spinner /> : t("writing.evaluate")}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <aside>
          <div className="card card-pad">
            <h2 className="mb-2 text-sm font-semibold">Prompt</h2>
            <p className="text-sm text-muted">{prompt.prompt}</p>
            {prompt.visualDescription && (
              <p className="mt-2 text-xs text-muted">Visual: {prompt.visualDescription}</p>
            )}
          </div>
          {showHistory && history.length > 0 && (
            <div className="card card-pad mt-3">
              <h3 className="mb-2 text-sm font-semibold">{t("writing.draftHistory")}</h3>
              <ul className="space-y-2">
                {history.map((d, i) => (
                  <li key={i}>
                    <button
                      className="w-full rounded-md border border-border px-2 py-1.5 text-left text-xs hover:bg-gray-50"
                      onClick={() => setText(d)}
                    >
                      Draft {i + 1} · {d.split(/\s+/).length} words · {d.slice(0, 60)}…
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function EvaluationView({
  evaluation,
  prompt,
  onBack,
}: {
  evaluation: WritingEvaluation;
  prompt: WritingPrompt;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="card card-pad mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{t("writing.evaluate")}</h1>
            <p className="text-sm text-muted">{prompt.title}</p>
          </div>
          <BandBadge band={evaluation.estimatedOverallBand} />
        </div>
        <p className="mt-2 text-xs text-muted">{t("common.officialNote")}</p>
      </div>

      <section className="card card-pad mb-4">
        <h2 className="mb-3 text-base font-semibold">{t("writing.criteria")}</h2>
        <div className="space-y-3">
          {evaluation.criterionScores.map((c) => (
            <div key={c.criterion} className="flex items-start gap-3">
              <BandBadge band={c.band} />
              <div>
                <p className="text-sm font-medium">{criterionLabel(c.criterion)}</p>
                <p className="text-sm text-muted">{c.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-2 text-base font-semibold">{t("writing.strengths")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
        <section className="card card-pad">
          <h2 className="mb-2 text-base font-semibold">{t("writing.weaknesses")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {evaluation.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      </div>

      {evaluation.improvedSentences.length > 0 && (
        <section className="card card-pad mt-4">
          <h2 className="mb-2 text-base font-semibold">{t("writing.suggestions")}</h2>
          <ul className="space-y-2 text-sm">
            {evaluation.improvedSentences.map((s, i) => (
              <li key={i} className="rounded-md bg-gray-50 p-2">
                <p className="text-red-700 line-through">{s.original}</p>
                <p className="text-green-700">→ {s.improved}</p>
                <p className="text-xs text-muted">{s.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evaluation.vocabularySuggestions.length > 0 && (
        <section className="card card-pad mt-4">
          <h2 className="mb-2 text-base font-semibold">Vocabulary</h2>
          <ul className="space-y-1 text-sm">
            {evaluation.vocabularySuggestions.map((v, i) => (
              <li key={i}>
                <span className="font-medium">{v.word}</span> → <span className="text-green-700">{v.suggestion}</span>
                <span className="text-muted"> — {v.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card card-pad mt-4">
        <h2 className="mb-2 text-base font-semibold">{t("writing.gapAnalysis")}</h2>
        <p className="text-sm leading-relaxed">{evaluation.bandGapAnalysis}</p>
        <p className="mt-2 text-sm text-muted">{evaluation.examinerStyleSummary}</p>
      </section>

      <button className="btn-secondary mt-6" onClick={onBack}>← {t("common.back")}</button>
    </div>
  );
}

function criterionLabel(c: string): string {
  const map: Record<string, string> = {
    taskAchievement: "Task Achievement",
    taskResponse: "Task Response",
    coherenceCohesion: "Coherence and Cohesion",
    lexicalResource: "Lexical Resource",
    grammaticalRange: "Grammatical Range and Accuracy",
  };
  return map[c] ?? c;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
