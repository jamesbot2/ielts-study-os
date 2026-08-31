"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import {
  getProfile,
  getDueVocabCards,
  listMistakes,
  listMockAttempts,
  listPracticeAttempts,
} from "@/lib/storage/repository";
import type { StudyProfile } from "@/lib/storage/types";
import { categories, lessonCountByCategory } from "@/lib/content/curriculum";
import { BandBadge, StatCard, Spinner } from "@/components/ui";

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(date);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

export function Dashboard() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [due, setDue] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mocks, setMocks] = useState<{ id: string; kind: string; status: string; overallBand: number | null; startedAt: string }[]>([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    Promise.all([
      getProfile(),
      getDueVocabCards(),
      listMistakes(),
      listMockAttempts(),
      listPracticeAttempts(500),
    ]).then(([p, d, m, mk, a]) => {
      setProfile(p);
      setDue(d.length);
      setMistakes(m.length);
      setMocks(mk.slice(0, 5).map((x) => ({ id: x.id, kind: x.kind, status: x.status, overallBand: x.overallBand, startedAt: x.startedAt })));
      setAttempts(a.filter((x) => x.completedAt).length);
    });
  }, []);

  if (!profile) return <div className="container-page"><Spinner /></div>;

  const days = daysUntil(profile.testDate);
  const lessonCounts = lessonCountByCategory();

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IELTS Study OS</h1>
          <p className="mt-1 text-sm text-muted">
            {profile.testType === "academic" ? "Academic" : "General Training"}
            {profile.targetBand ? ` · ${t("dashboard.targetBand")} ${profile.targetBand}` : ""}
          </p>
        </div>
        {!profile.onboardingComplete ? (
          <Link href="/onboarding" className="btn-primary">Set up my study profile</Link>
        ) : (
          <Link href="/settings" className="btn-secondary">Edit profile</Link>
        )}
      </div>

      {!profile.onboardingComplete && (
        <div className="card card-pad mb-6 border-blue-200 bg-blue-50">
          <p className="text-sm">Welcome! Complete a short setup to get a personalised study plan and targets. You can skip and change everything later.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t("dashboard.targetBand")} value={profile.targetBand ?? "—"} hint="overall" />
        <StatCard label={t("dashboard.estimatedBand")} value={profile.currentBand ?? "—"} hint="estimated" />
        <StatCard
          label={t("dashboard.testCountdown")}
          value={days == null ? "—" : Math.max(0, days)}
          hint={days != null && days < 0 ? "past test date" : profile.testDate ? `${t("dashboard.daysLeft")}` : undefined}
        />
        <StatCard label={t("dashboard.weeklyMinutes")} value={`${profile.weeklyHours}h`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">{t("dashboard.skillProgress")}</h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm">{c.labelEn}</span>
                <span className="text-sm text-muted">{lessonCounts[c.id]} lessons</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">{t("dashboard.recentPractice")}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Practice attempts</dt>
              <dd>{attempts}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("dashboard.vocabularyDue")}</dt>
              <dd>{due}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Mistakes recorded</dt>
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
            <p className="mt-1 text-sm text-muted">Understand structure and scoring first.</p>
          </Link>
          <Link href="/practice/reading/academic-reading-1" className="card card-pad hover:border-accent">
            <p className="font-medium">2 · {t("nav.practice")}</p>
            <p className="mt-1 text-sm text-muted">Academic Reading set.</p>
          </Link>
          <Link href="/practice/listening/listening-1" className="card card-pad hover:border-accent">
            <p className="font-medium">3 · Listening</p>
            <p className="mt-1 text-sm text-muted">Four parts with audio.</p>
          </Link>
          <Link href="/mock" className="card card-pad hover:border-accent">
            <p className="font-medium">4 · {t("nav.mockExams")}</p>
            <p className="mt-1 text-sm text-muted">Computer-style, timed.</p>
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
                {m.status === "completed" ? <BandBadge band={m.overallBand} /> : <span className="text-xs text-muted">in progress</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
