"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, getLessonsByCategory } from "@/lib/content/curriculum";
import { getLessonProgress } from "@/lib/storage/repository";
import { useStudyProfile } from "@/components/study-profile-provider";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui";

export default function LearnPage() {
  const { t, locale } = useI18n();
  const { testType, loading: profileLoading } = useStudyProfile();
  const [progress, setProgress] = useState<Record<string, string> | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getLessonProgress().then(setProgress);
  }, []);

  if (profileLoading || !progress) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("learn.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("learn.subtitle")}</p>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          {locale === "zh" ? "显示全部类型" : "Show all IELTS types"}
        </label>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const lessons = getLessonsByCategory(cat.id, showAll ? undefined : testType);
          if (lessons.length === 0) return null;
          const done = lessons.filter((l) => progress[l.id] === "completed").length;
          return (
            <section key={cat.id} className="card card-pad">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">{locale === "zh" ? cat.labelZh : cat.labelEn}</h2>
                <span className="text-xs text-muted">
                  {done}/{lessons.length} {locale === "zh" ? "已完成" : "completed"}
                </span>
              </div>
              <ul className="space-y-1">
                {lessons.map((lesson) => {
                  const status = progress[lesson.id];
                  return (
                    <li key={lesson.id}>
                      <Link href={`/learn/${lesson.id}`} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50">
                        <span className="font-medium">{locale === "zh" ? lesson.title.zh : lesson.title.en}</span>
                        <span className="text-xs text-muted">
                          {status === "completed" ? "✓" : `${lesson.estimatedMinutes ?? 3} ${t("common.minutes")}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
