"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { useStudyProfile } from "@/components/study-profile-provider";
import {
  createStudyTask,
  deleteStudyTask,
  listStudyTasks,
  updateStudyTask,
} from "@/lib/storage/repository";
import { generatePlan } from "@/lib/study-plan/generate";
import { studyGuides } from "@/lib/content/study-guides";
import type { StudyTask } from "@/lib/storage/types";
import { Spinner } from "@/components/ui";

export function StudyPlanModule() {
  const { t, locale } = useI18n();
  const { profile, loading: profileLoading } = useStudyProfile();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setTasks(await listStudyTasks());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    setGenerating(true);
    const plan = generatePlan(profile);
    for (const task of tasks) {
      if (task.category !== "daily") await deleteStudyTask(task.id);
    }
    for (const item of plan) {
      await createStudyTask(item.title, item.category, item.scheduledFor ?? undefined, {
        titleZh: item.titleZh,
        href: item.href ?? undefined,
        estimatedMinutes: item.estimatedMinutes,
      });
    }
    setGenerating(false);
    await load();
  }

  async function toggle(task: StudyTask) {
    await updateStudyTask(task.id, { completed: task.completed ? 0 : 1 });
    await load();
  }

  async function addTask() {
    const title = prompt(locale === "zh" ? "任务标题" : "Task title");
    if (!title) return;
    await createStudyTask(title, "daily", new Date().toISOString().slice(0, 10));
    await load();
  }

  if (profileLoading || loading) return <div className="container-page"><Spinner /></div>;

  const grouped = groupBy(tasks, (task) => task.scheduledFor ?? "unscheduled");

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

      <StudyGuidesSection />

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
                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted" : ""}`}>
                      {task.href ? (
                        <Link href={task.href} className="hover:underline">
                          {locale === "zh" && task.titleZh ? task.titleZh : task.title}
                        </Link>
                      ) : locale === "zh" && task.titleZh ? task.titleZh : task.title}
                    </span>
                    {task.estimatedMinutes != null && <span className="text-xs text-muted">{task.estimatedMinutes}m</span>}
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-muted">{task.category}</span>
                    <button className="text-xs text-muted hover:text-red-600" onClick={async () => { await deleteStudyTask(task.id); await load(); }}>
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

function StudyGuidesSection() {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-5">
      <button className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-4 py-3 text-left" onClick={() => setOpen((o) => !o)}>
        <span className="text-sm font-semibold">{locale === "zh" ? "内置学习计划模板" : "Built-in study plan templates"}</span>
        <span className="text-xs text-muted">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {studyGuides.map((g) => (
            <div key={g.id} className="card card-pad">
              <p className="font-medium">{locale === "zh" ? g.titleZh : g.titleEn}</p>
              <p className="mt-1 text-sm text-muted">{locale === "zh" ? g.summaryZh : g.summaryEn}</p>
              {g.target && <span className="badge badge-accent mt-2">{g.target.from} → {g.target.to}</span>}
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {g.schedule.map((s, i) => (
                  <li key={i}>
                    <span className="font-medium text-foreground">{locale === "zh" ? s.phaseZh : s.phase}</span>
                    {" · "}{locale === "zh" ? s.focusZh : s.focus}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
