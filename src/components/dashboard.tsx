"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { useStudyProfile } from "@/components/study-profile-provider";
import {
  getDueVocabCards,
  getLessonProgress,
  listMistakes,
  listMockAttempts,
  listPracticeAttempts,
} from "@/lib/storage/repository";
import { categories, getLessonsByCategory } from "@/lib/content/curriculum";
import { daysUntil } from "@/lib/date";
import { BandBadge, StatCard, Spinner } from "@/components/ui";

export function Dashboard() {
  const { t, locale } = useI18n();
  const { profile, testType, loading } = useStudyProfile();
  const [progress, setProgress] = useState<Record<string, string> | null>(null);
  const [due, setDue] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mocks, setMocks] = useState<{ id: string; kind: string; status: string; gradedAverage: number | null; startedAt: string }[]>([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    Promise.all([getLessonProgress(), getDueVocabCards(), listMistakes(), listMockAttempts(), listPracticeAttempts(500)]).then(
      ([p, d, m, mk, a]) => {
        setProgress(p);
        setDue(d.length);
        setMistakes(m.length);
        setMocks(mk.slice(0, 5).map((x) => ({ id: x.id, kind: x.kind, status: x.status, gradedAverage: x.gradedAverage, startedAt: x.startedAt })));
        setAttempts(a.filter((x) => x.completedAt).length);
      },
    );
  }, []);

  if (loading || !progress) return <div className="container-page"><Spinner /></div>;

  const days = daysUntil(profile.testDate);
  const readingSet = testType === "academic" ? "academic-reading-1" : "general-reading-1";

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IELTS Study OS</h1>
          <p className="mt-1 text-sm text-muted">
            {testType === "academic" ? "Academic" : "General Training"}
            {profile.targetBand ? ` · ${t("dashboard.targetBand")} ${profile.targetBand}` : ""}
          </p>
        </div>
        {!profile.onboardingComplete ? (
          <Link href="/onboarding" className="btn-primary">{locale === "zh" ? "设置学习档案" : "Set up my study profile"}</Link>
        ) : (
          <Link href="/settings" className="btn-secondary">{locale === "zh" ? "编辑档案" : "Edit profile"}</Link>
        )}
      </div>

      {!profile.onboardingComplete && (
        <div className="card card-pad mb-6 border-border bg-accent-soft">
          <p className="text-sm">{locale === "zh" ? "欢迎！完成简短的设置以获取个性化学习计划与目标。" : "Welcome! Complete a short setup to get a personalised study plan and targets."}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t("dashboard.targetBand")} value={profile.targetBand ?? "—"} hint="overall" />
        <StatCard label={t("dashboard.estimatedBand")} value={profile.currentBand ?? "—"} hint="estimated" />
        <StatCard
          label={t("dashboard.testCountdown")}
          value={days == null ? "—" : Math.max(0, days)}
          hint={days != null && days < 0 ? (locale === "zh" ? "已过考试日期" : "past test date") : profile.testDate ? t("dashboard.daysLeft") : undefined}
        />
        <StatCard label={t("dashboard.weeklyMinutes")} value={`${profile.weeklyHours}h`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">{t("dashboard.skillProgress")}</h2>
          <div className="space-y-2">
            {categories.map((c) => {
              const lessons = getLessonsByCategory(c.id, testType);
              if (lessons.length === 0) return null;
              const done = lessons.filter((l) => progress[l.id] === "completed").length;
              const pct = Math.round((done / lessons.length) * 100);
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{locale === "zh" ? c.labelZh : c.labelEn}</span>
                    <span className="text-xs text-muted">{done}/{lessons.length} · {pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">{t("dashboard.recentPractice")}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{locale === "zh" ? "练习次数" : "Practice attempts"}</dt>
              <dd>{attempts}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("dashboard.vocabularyDue")}</dt>
              <dd>{due}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{locale === "zh" ? "错题数" : "Mistakes recorded"}</dt>
              <dd>{mistakes}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("dashboard.mockHistory")}</dt>
              <dd>{mocks.filter((m) => m.status === "completed").length}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">{t("dashboard.recommendedNext")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/learn" className="card card-pad hover:border-accent">
            <p className="font-medium">1 · {t("nav.learn")}</p>
            <p className="mt-1 text-sm text-muted">{locale === "zh" ? "先理解考试结构与评分。" : "Understand structure and scoring first."}</p>
          </Link>
          <Link href={`/practice/reading/${readingSet}`} className="card card-pad hover:border-accent">
            <p className="font-medium">2 · {t("nav.practice")}</p>
            <p className="mt-1 text-sm text-muted">{testType === "academic" ? (locale === "zh" ? "学术类阅读。" : "Academic Reading set.") : (locale === "zh" ? "培训类阅读。" : "General Training Reading set.")}</p>
          </Link>
          <Link href="/practice/listening/listening-1" className="card card-pad hover:border-accent">
            <p className="font-medium">3 · Listening</p>
            <p className="mt-1 text-sm text-muted">{locale === "zh" ? "四部分带音频。" : "Four parts with audio."}</p>
          </Link>
          <Link href="/mock" className="card card-pad hover:border-accent">
            <p className="font-medium">4 · {t("nav.mockExams")}</p>
            <p className="mt-1 text-sm text-muted">{locale === "zh" ? "机考风格、计时。" : "Computer-style, timed."}</p>
          </Link>
        </div>
      </section>

      {mocks.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">{t("dashboard.mockHistory")}</h2>
          <div className="card divide-y divide-border">
            {mocks.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{m.kind.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted">{new Date(m.startedAt).toLocaleDateString()}</p>
                </div>
                {m.status === "completed" ? <BandBadge band={m.gradedAverage} /> : <span className="text-xs text-muted">{t("mock.inProgress")}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
