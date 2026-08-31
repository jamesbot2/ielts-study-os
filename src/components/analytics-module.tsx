"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { computeAnalytics, type AnalyticsData } from "@/lib/analytics/compute";
import { Spinner, BandBadge } from "@/components/ui";

export function AnalyticsModule() {
  const { t } = useI18n();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    computeAnalytics().then(setData);
  }, []);

  if (!data) return <div className="container-page"><Spinner /></div>;

  const { summary } = data;
  const skills = ["listening", "reading", "writing", "speaking"];

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold">{t("analytics.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("analytics.subtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Practice" value={summary.totalPractice} />
        <Stat label="Mistakes" value={summary.totalMistakes} />
        <Stat label="Mocks" value={summary.totalMocks} />
        <Stat label="Vocab due" value={summary.vocabDue} />
      </div>

      <section className="card card-pad mt-6">
        <h2 className="mb-3 text-base font-semibold">{t("analytics.bySkill")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => {
            const e = summary.bySkill[s];
            return (
              <div key={s} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium capitalize">{s}</p>
                {e ? (
                  <div className="mt-1 space-y-1 text-xs text-muted">
                    <p>{e.attempts} attempts</p>
                    {e.accuracy > 0 && <p>Accuracy {Math.round(e.accuracy * 100)}%</p>}
                    {e.avgBand > 0 && <p>Avg band <BandBadge band={e.avgBand} /></p>}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted">—</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card card-pad mt-6">
        <h2 className="mb-3 text-base font-semibold">{t("analytics.mockHistory")}</h2>
        {data.mocks.length === 0 ? (
          <p className="text-sm text-muted">{t("analytics.noData")}</p>
        ) : (
          <div className="divide-y divide-border">
            {data.mocks.slice(0, 10).map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium capitalize">{m.kind.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted">{new Date(m.startedAt).toLocaleDateString()}</p>
                </div>
                {m.status === "completed" ? <BandBadge band={m.overallBand} /> : <span className="text-xs text-muted">in progress</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card card-pad mt-6">
        <h2 className="mb-3 text-base font-semibold">{t("analytics.mistakesByCategory")}</h2>
        {Object.keys(data.mistakesBySkill).length === 0 ? (
          <p className="text-sm text-muted">{t("mistakes.noMistakes")}</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(data.mistakesBySkill)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-24 text-sm capitalize">{k}</span>
                  <div className="h-3 flex-1 rounded-full bg-gray-100">
                    <div className="h-3 rounded-full bg-accent" style={{ width: `${Math.min(100, (v / Math.max(...Object.values(data.mistakesBySkill))) * 100)}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm text-muted">{v}</span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card card-pad">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
