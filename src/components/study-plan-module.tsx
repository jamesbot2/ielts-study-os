"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/client/api";
import { generatePlan } from "@/lib/study-plan/generate";
import type { StudyProfile, StudyTaskRow } from "@/lib/db/store";
import { Spinner } from "@/components/ui";

export function StudyPlanModule() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<StudyTaskRow[]>([]);
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    const [t, p] = await Promise.all([
      apiGet<{ tasks: StudyTaskRow[] }>("/api/study-plan"),
      apiGet<StudyProfile>("/api/profile"),
    ]);
    setTasks(t.tasks);
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    if (!profile) return;
    setGenerating(true);
    const plan = generatePlan(profile);
    // clear existing then add
    for (const task of tasks) {
      if (task.category !== "daily") await apiDelete(`/api/study-plan?id=${task.id}`);
    }
    for (const item of plan) {
      await apiPost("/api/study-plan", {
        title: item.title,
        category: item.category,
        scheduledFor: item.scheduledFor,
      });
    }
    setGenerating(false);
    await load();
  }

  async function toggle(task: StudyTaskRow) {
    await apiPatch("/api/study-plan", { id: task.id, completed: task.completed ? 0 : 1 });
    await load();
  }

  async function addTask() {
    const title = prompt("Task title");
    if (!title) return;
    await apiPost("/api/study-plan", { title, category: "daily", scheduledFor: new Date().toISOString().slice(0, 10) });
    await load();
  }

  if (loading) return <div className="container-page"><Spinner /></div>;

  const grouped = groupBy(tasks, (task) => task.scheduled_for ?? "unscheduled");

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("plan.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("plan.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={addTask}>+ {t("plan.addTask")}</button>
          <button className="btn-primary" onClick={generate} disabled={generating || !profile}>
            {generating ? <Spinner /> : t("plan.generate")}
          </button>
        </div>
      </div>

      {profile && (
        <div className="mb-4 rounded-md border border-border bg-surface p-3 text-sm">
          Target {profile.targetBand} · {profile.weeklyHours}h/week
          {profile.testDate ? ` · test ${profile.testDate}` : ""}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card card-pad text-center text-muted">{t("plan.noPlan")}</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, items]) => (
            <section key={date}>
              <h2 className="mb-2 text-sm font-semibold text-muted">{date === "unscheduled" ? "Unscheduled" : date}</h2>
              <div className="card divide-y divide-border">
                {items.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={task.completed === 1}
                      onChange={() => toggle(task)}
                      className="h-4 w-4 accent-[var(--accent)]"
                      aria-label={task.title}
                    />
                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted" : ""}`}>{task.title}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-muted">{task.category}</span>
                    <button className="text-xs text-muted hover:text-red-600" onClick={async () => { await apiDelete(`/api/study-plan?id=${task.id}`); await load(); }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}
