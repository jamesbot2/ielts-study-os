"use client";

import Link from "next/link";
import { useState } from "react";
import { writingPrompts } from "@/lib/content/practice/writing-prompts";
import { useStudyProfile } from "@/components/study-profile-provider";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui";

export default function WritingPage() {
  const { t, locale } = useI18n();
  const { testType, loading } = useStudyProfile();
  const [showAll, setShowAll] = useState(false);

  if (loading) return <div className="container-page"><Spinner /></div>;

  const task1 = writingPrompts.filter((p) => p.task === 1 && (showAll || p.testType === testType));
  const task2 = writingPrompts.filter((p) => p.task === 2);

  return (
    <div className="container-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("writing.title")}</h1>
          <p className="mt-1 text-sm text-muted">
            {locale === "zh" ? "含计时、字数和 AI 反馈的 Task 1 与 Task 2 作文。" : "Task 1 and Task 2 essays with timer, word count and AI feedback."}
          </p>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-muted">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          {locale === "zh" ? "显示全部类型" : "Show all IELTS types"}
        </label>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">
          {testType === "academic"
            ? (locale === "zh" ? "学术类 Task 1" : "Academic Task 1")
            : (locale === "zh" ? "培训类 Task 1（书信）" : "General Training Task 1 (letters)")}
        </h2>
        <PromptList prompts={task1} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">{t("writing.task2")}</h2>
        <PromptList prompts={task2} />
      </section>
    </div>
  );
}

function PromptList({ prompts }: { prompts: typeof writingPrompts }) {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {prompts.map((p) => (
        <li key={p.id}>
          <Link
            href={`/practice/writing/${p.id}`}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
          >
            <span className="font-medium">{p.title}</span>
            <span className="text-xs text-muted">{p.visualType ? `${p.visualType} · ` : ""}{p.wordLimit} words</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
