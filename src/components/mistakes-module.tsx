"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { apiGet, apiPatch } from "@/lib/client/api";
import { Spinner } from "@/components/ui";
import type { MistakeRow } from "@/lib/db/store";

export function MistakesModule() {
  const { t } = useI18n();
  const [mistakes, setMistakes] = useState<MistakeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("all");

  useEffect(() => {
    apiGet<{ mistakes: MistakeRow[] }>("/api/mistakes").then((d) => {
      setMistakes(d.mistakes);
      setLoading(false);
    });
  }, []);

  async function setMastery(id: string, mastery: string) {
    await apiPatch("/api/mistakes", { id, mastery });
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
                    {m.question_type && <span>{m.question_type}</span>}
                    <span>{new Date(m.created_at).toLocaleDateString()}</span>
                    {m.recurrence_count > 1 && <span className="text-amber-600">×{m.recurrence_count}</span>}
                  </div>
                  {m.question && <p className="mt-2 text-sm font-medium">{m.question}</p>}
                  <div className="mt-2 grid gap-1 text-sm">
                    {m.user_answer != null && (
                      <p><span className="text-muted">{t("mistakes.yourAnswer")}:</span> <span className="text-red-700">{m.user_answer || "(blank)"}</span></p>
                    )}
                    {m.correct_answer != null && (
                      <p><span className="text-muted">{t("mistakes.correctAnswer")}:</span> <span className="text-green-700">{m.correct_answer}</span></p>
                    )}
                  </div>
                  {m.explanation && <p className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-muted">{m.explanation}</p>}
                </div>
                <select
                  className="input w-32 shrink-0"
                  value={m.mastery}
                  onChange={(e) => setMastery(m.id, e.target.value)}
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
