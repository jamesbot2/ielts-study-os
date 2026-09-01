"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { listMistakes, updateMistake } from "@/lib/storage/repository";
import type { Mistake } from "@/lib/storage/types";
import Link from "next/link";
import { coachLink } from "@/lib/coach/page-link";
import { Spinner } from "@/components/ui";

export function MistakesModule() {
  const { t, locale } = useI18n();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("all");

  useEffect(() => {
    listMistakes().then((m) => {
      setMistakes(m);
      setLoading(false);
    });
  }, []);

  async function setMastery(id: string, mastery: Mistake["mastery"]) {
    await updateMistake(id, { mastery });
    setMistakes((list) => list.map((m) => (m.id === id ? { ...m, mastery } : m)));
  }

  if (loading) return <div className="container-page"><Spinner /></div>;

  const skills = ["all", ...new Set(mistakes.map((m) => m.skill))];
  const filtered = skillFilter === "all" ? mistakes : mistakes.filter((m) => m.skill === skillFilter);

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold">{t("mistakes.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("mistakes.subtitle")}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <button key={s} onClick={() => setSkillFilter(s)} className={skillFilter === s ? "btn-primary" : "btn-secondary"}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card card-pad mt-4 text-center text-muted">{t("mistakes.noMistakes")}</div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((m) => (
            <div key={m.id} className="card card-pad">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-medium uppercase">{m.skill}</span>
                    {m.questionType && <span>{m.questionType}</span>}
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                    {m.recurrenceCount > 1 && <span className="text-amber-600">×{m.recurrenceCount}</span>}
                  </div>
                  {m.question && <p className="mt-2 text-sm font-medium">{m.question}</p>}
                  <div className="mt-2 grid gap-1 text-sm">
                    {m.userAnswer != null && (
                      <p><span className="text-muted">{t("mistakes.yourAnswer")}:</span> <span className="text-red-700">{m.userAnswer || "(blank)"}</span></p>
                    )}
                    {m.correctAnswer != null && (
                      <p><span className="text-muted">{t("mistakes.correctAnswer")}:</span> <span className="text-green-700">{m.correctAnswer}</span></p>
                    )}
                  </div>
                  {m.explanation && <p className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-muted">{m.explanation}</p>}
                  <Link
                    href={coachLink({
                      route: "/mistakes",
                      kind: "mistake",
                      mistakeId: m.id,
                      questionType: m.questionType ?? undefined,
                      question: m.question?.slice(0, 300),
                      userAnswer: m.userAnswer?.slice(0, 300),
                      correctAnswer: m.correctAnswer?.slice(0, 300),
                      explanation: m.explanation?.slice(0, 300),
                    })}
                    className="mt-2 inline-block text-sm text-accent underline"
                  >
                    {locale === "zh" ? "问 AI 教练：解释这道错题" : "Ask AI Coach: explain this mistake"}
                  </Link>
                </div>
                <select
                  className="input w-32 shrink-0"
                  value={m.mastery}
                  onChange={(e) => setMastery(m.id, e.target.value as Mistake["mastery"])}
                >
                  <option value="new">new</option>
                  <option value="learning">learning</option>
                  <option value="reviewing">reviewing</option>
                  <option value="mastered">mastered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
