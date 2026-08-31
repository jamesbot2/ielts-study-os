"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listMockAttempts, abandonMockAttempt, deleteMockAttempt } from "@/lib/storage/repository";
import { useStudyProfile } from "@/components/study-profile-provider";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui";

type MockKind = "academic_full" | "general_full" | "listening" | "reading" | "reading_general";

interface MockDef {
  kind: MockKind;
  titleKey: string;
  descKey: string;
  skills: string[];
  duration: string;
  count: string;
  testType: "academic" | "general" | "both";
}

const MOCKS: MockDef[] = [
  { kind: "academic_full", titleKey: "mock.academicFull", descKey: "mock.academicFullDesc", skills: ["Listening", "Reading", "Writing"], duration: "≈2h 35m", count: "80 questions + 2 writing tasks", testType: "academic" },
  { kind: "general_full", titleKey: "mock.generalFull", descKey: "mock.generalFullDesc", skills: ["Listening", "Reading", "Writing"], duration: "≈2h 35m", count: "80 questions + 2 writing tasks", testType: "general" },
  { kind: "listening", titleKey: "mock.listening", descKey: "mock.listeningDesc", skills: ["Listening"], duration: "≈35m", count: "40 questions", testType: "both" },
  { kind: "reading", titleKey: "mock.reading", descKey: "mock.readingDesc", skills: ["Reading"], duration: "60m", count: "40 questions", testType: "academic" },
  { kind: "reading_general", titleKey: "mock.reading", descKey: "mock.readingGeneralDesc", skills: ["Reading"], duration: "60m", count: "40 questions", testType: "general" },
];

export default function MockPage() {
  const { t, locale } = useI18n();
  const { testType } = useStudyProfile();
  const [attempts, setAttempts] = useState<{ id: string; kind: string; status: string; overallBand: number | null; startedAt: string }[] | null>(null);

  const load = useCallback(() => {
    listMockAttempts().then((a) =>
      setAttempts(a.map((x) => ({ id: x.id, kind: x.kind, status: x.status, overallBand: x.overallBand, startedAt: x.startedAt }))),
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Profile-aware ordering: matching type first, shared next, other type last.
  const ordered = [...MOCKS].sort((a, b) => {
    const score = (m: MockDef) => (m.testType === testType ? 0 : m.testType === "both" ? 1 : 2);
    return score(a) - score(b);
  });

  const fullMock = ordered.find((m) => m.testType === testType);

  if (attempts === null) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">{t("mock.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("mock.subtitle")}</p>

      {/* Recommended full mock */}
      {fullMock && (
        <Link href={`/mock/run/${fullMock.kind}`} className="card card-pad mt-5 flex flex-wrap items-center justify-between gap-3 border-accent hover:border-accent">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{t(fullMock.titleKey)}</p>
              <span className="badge badge-accent">{locale === "zh" ? "推荐" : "Recommended"}</span>
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {fullMock.skills.join(" · ")} · {fullMock.duration} · {fullMock.count}
            </p>
          </div>
          <span className="btn-primary inline-flex">{t("mock.start")}</span>
        </Link>
      )}

      <div className="mt-4 space-y-2">
        {ordered.filter((m) => m !== fullMock).map((m) => (
          <Link key={m.kind} href={`/mock/run/${m.kind}`} className="card card-pad flex flex-wrap items-center justify-between gap-3 hover:border-accent">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{t(m.titleKey)}</p>
                {m.testType !== "both" && <span className="badge">{m.testType === "academic" ? "Academic" : "General Training"}</span>}
              </div>
              <p className="mt-0.5 text-sm text-muted">
                {m.skills.join(" · ")} · {m.duration} · {m.count}
              </p>
            </div>
            <span className="btn-secondary inline-flex">{t("mock.start")}</span>
          </Link>
        ))}

        <Link href="/mock/speaking" className="card card-pad flex flex-wrap items-center justify-between gap-3 hover:border-accent">
          <div className="min-w-0">
            <p className="font-semibold">{t("mock.speaking")}</p>
            <p className="mt-0.5 text-sm text-muted">{t("mock.speakingDesc")}</p>
          </div>
          <span className="btn-secondary inline-flex">{t("mock.startSpeaking")}</span>
        </Link>
      </div>

      {attempts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">{t("mock.previousAttempts")}</h2>
          <div className="card divide-y divide-border">
            {attempts.map((a) => {
              const kind = a.kind.replace(/_/g, " ");
              const isActive = a.status === "in_progress";
              const isCompleted = a.status === "completed";
              return (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium capitalize">{kind}</p>
                    <p className="text-xs text-muted">
                      {new Date(a.startedAt).toLocaleString()}
                      {a.status === "abandoned" ? ` · ${locale === "zh" ? "已放弃" : "abandoned"}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && a.overallBand != null && (
                      <span className="text-xs text-muted">
                        {locale === "zh" ? "听力/阅读平均" : "L/R graded avg"}{" "}
                        <span className="font-semibold">{a.overallBand.toFixed(1)}</span>
                      </span>
                    )}
                    {isActive ? (
                      <>
                        <Link href={`/mock/run/${a.kind}`} className="btn-primary px-3 py-1.5 text-xs">{t("mock.resume")}</Link>
                        <button
                          className="btn-ghost px-2 py-1.5 text-xs text-muted"
                          onClick={async () => { if (window.confirm(locale === "zh" ? "放弃这次模拟考试？" : "Abandon this mock attempt?")) { await abandonMockAttempt(a.id); load(); } }}
                        >
                          {locale === "zh" ? "放弃" : "Abandon"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/mock/run/${a.kind}`} className="btn-secondary px-3 py-1.5 text-xs">{t("mock.retake")}</Link>
                        <button
                          className="btn-ghost px-2 py-1.5 text-xs text-muted hover:text-red-600"
                          onClick={async () => { if (window.confirm(locale === "zh" ? "删除这条记录？" : "Delete this attempt?")) { await deleteMockAttempt(a.id); load(); } }}
                        >
                          {locale === "zh" ? "删除" : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
