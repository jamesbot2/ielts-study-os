"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMockAttempts } from "@/lib/storage/repository";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui";

type MockKind = "academic_full" | "general_full" | "listening" | "reading" | "reading_general";

const MOCKS: { kind: MockKind; titleKey: string; descKey: string; skills: string[]; duration: string; count: string; testType: "academic" | "general" }[] = [
  { kind: "academic_full", titleKey: "mock.academicFull", descKey: "mock.academicFullDesc", skills: ["Listening", "Reading", "Writing"], duration: "≈2h 35m", count: "80 questions + 2 writing tasks", testType: "academic" },
  { kind: "general_full", titleKey: "mock.generalFull", descKey: "mock.generalFullDesc", skills: ["Listening", "Reading", "Writing"], duration: "≈2h 35m", count: "80 questions + 2 writing tasks", testType: "general" },
  { kind: "listening", titleKey: "mock.listening", descKey: "mock.listeningDesc", skills: ["Listening"], duration: "≈35m", count: "40 questions", testType: "academic" },
  { kind: "reading", titleKey: "mock.reading", descKey: "mock.readingDesc", skills: ["Reading"], duration: "60m", count: "40 questions", testType: "academic" },
  { kind: "reading_general", titleKey: "mock.reading", descKey: "mock.readingGeneralDesc", skills: ["Reading"], duration: "60m", count: "40 questions", testType: "general" },
];

export default function MockPage() {
  const { t } = useI18n();
  const [attempts, setAttempts] = useState<{ id: string; kind: string; status: string; overallBand: number | null; startedAt: string }[] | null>(null);

  useEffect(() => {
    listMockAttempts().then((a) =>
      setAttempts(a.map((x) => ({ id: x.id, kind: x.kind, status: x.status, overallBand: x.overallBand, startedAt: x.startedAt }))),
    );
  }, []);

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">{t("mock.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("mock.subtitle")}</p>

      <div className="mt-5 space-y-2">
        {MOCKS.map((m) => (
          <Link
            key={m.kind}
            href={`/mock/run/${m.kind}`}
            className="card card-pad flex flex-wrap items-center justify-between gap-3 hover:border-accent"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{t(m.titleKey)}</p>
                <span className="badge">{m.testType === "academic" ? "Academic" : "General Training"}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                {m.skills.join(" · ")} · {m.duration} · {m.count}
              </p>
            </div>
            <span className="btn-primary inline-flex">{t("mock.start")}</span>
          </Link>
        ))}

        <Link href="/mock/speaking" className="card card-pad flex flex-wrap items-center justify-between gap-3 hover:border-accent">
          <div className="min-w-0">
            <p className="font-semibold">{t("mock.speaking")}</p>
            <p className="mt-0.5 text-sm text-muted">{t("mock.speakingDesc")}</p>
          </div>
          <span className="btn-primary inline-flex">{t("mock.startSpeaking")}</span>
        </Link>
      </div>

      {attempts === null ? (
        <div className="mt-8"><Spinner /></div>
      ) : attempts.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">{t("mock.previousAttempts")}</h2>
          <div className="card divide-y divide-border">
            {attempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{a.kind.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted">{new Date(a.startedAt).toLocaleString()}</p>
                </div>
                <span className={`text-sm ${a.status === "completed" ? "font-semibold" : "text-muted"}`}>
                  {a.status === "completed" ? (a.overallBand != null ? `${t("mock.band")} ${a.overallBand.toFixed(1)}` : t("mock.done")) : t("mock.inProgress")}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
