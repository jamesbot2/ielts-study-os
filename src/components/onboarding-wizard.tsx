"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { apiPost } from "@/lib/client/api";
import type { StudyProfile } from "@/lib/db/store";
import { Spinner } from "@/components/ui";

const SKILLS = [
  { id: "listening", en: "Listening", zh: "听力" },
  { id: "reading", en: "Reading", zh: "阅读" },
  { id: "writing", en: "Writing", zh: "写作" },
  { id: "speaking", en: "Speaking", zh: "口语" },
] as const;

export function OnboardingWizard() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    uiLanguage: locale as "en" | "zh",
    testType: "academic" as "academic" | "general",
    currentBand: "4.5",
    targetBand: "6.5",
    targetListening: "6.5",
    targetReading: "6.5",
    targetWriting: "6.0",
    targetSpeaking: "6.5",
    testDate: "",
    weeklyHours: "6",
    weakestSkills: [] as string[],
    takenBefore: null as boolean | null,
  });

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSkill = (id: string) =>
    setForm((f) => ({
      ...f,
      weakestSkills: f.weakestSkills.includes(id)
        ? f.weakestSkills.filter((s) => s !== id)
        : [...f.weakestSkills, id],
    }));

  const bandOptions = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];

  async function finish(skip: boolean) {
    setSaving(true);
    const profile: StudyProfile = {
      uiLanguage: form.uiLanguage,
      testType: form.testType,
      currentBand: Number(form.currentBand),
      targetBand: Number(form.targetBand),
      targetListening: Number(form.targetListening),
      targetReading: Number(form.targetReading),
      targetWriting: Number(form.targetWriting),
      targetSpeaking: Number(form.targetSpeaking),
      testDate: form.testDate || null,
      weeklyHours: Number(form.weeklyHours) || 6,
      weakestSkills: form.weakestSkills as StudyProfile["weakestSkills"],
      takenBefore: form.takenBefore,
      onboardingComplete: !skip,
    };
    await apiPost("/api/profile", profile);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{t("onboarding.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("onboarding.subtitle")}</p>

      <div className="mt-6 h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-accent transition-all"
          style={{ width: `${((step + 1) / 6) * 100}%` }}
        />
      </div>

      <div className="card card-pad mt-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="label">{t("onboarding.uiLanguage")}</label>
              <div className="flex gap-3">
                {(["en", "zh"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => set("uiLanguage", l)}
                    className={`btn ${form.uiLanguage === l ? "btn-primary" : "btn-secondary"}`}
                  >
                    {l === "en" ? "English" : "中文"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t("onboarding.testType")}</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => set("testType", "academic")}
                  className={`card card-pad text-left ${form.testType === "academic" ? "border-accent ring-1 ring-accent" : ""}`}
                >
                  <p className="font-medium">{t("onboarding.academic")}</p>
                  <p className="mt-1 text-xs text-muted">{t("onboarding.academicDesc")}</p>
                </button>
                <button
                  type="button"
                  onClick={() => set("testType", "general")}
                  className={`card card-pad text-left ${form.testType === "general" ? "border-accent ring-1 ring-accent" : ""}`}
                >
                  <p className="font-medium">{t("onboarding.general")}</p>
                  <p className="mt-1 text-xs text-muted">{t("onboarding.generalDesc")}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <BandField label={t("onboarding.currentBand")} value={form.currentBand} onChange={(v) => set("currentBand", v)} options={bandOptions} hint={t("onboarding.currentBandHint")} />
            <BandField label={t("onboarding.targetBand")} value={form.targetBand} onChange={(v) => set("targetBand", v)} options={bandOptions} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(["listening", "reading", "writing", "speaking"] as const).map((s) => (
              <BandField
                key={s}
                label={t(`onboarding.target${s[0].toUpperCase() + s.slice(1)}`)}
                value={form[`target${s[0].toUpperCase() + s.slice(1)}` as "targetListening"]}
                onChange={(v) => set(`target${s[0].toUpperCase() + s.slice(1)}`, v)}
                options={bandOptions}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label">{t("onboarding.testDate")}</label>
              <input
                type="date"
                className="input max-w-xs"
                value={form.testDate}
                onChange={(e) => set("testDate", e.target.value)}
              />
              <p className="mt-1 text-xs text-muted">{t("onboarding.noDate")}</p>
            </div>
            <div>
              <label className="label">{t("onboarding.weeklyTime")}</label>
              <input
                type="number"
                min={1}
                max={40}
                className="input max-w-xs"
                value={form.weeklyHours}
                onChange={(e) => set("weeklyHours", e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t("onboarding.weakest")}</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSkill(s.id)}
                    className={`btn ${form.weakestSkills.includes(s.id) ? "btn-primary" : "btn-secondary"}`}
                  >
                    {locale === "zh" ? s.zh : s.en}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t("onboarding.takenBefore")}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => set("takenBefore", true)} className={`btn ${form.takenBefore === true ? "btn-primary" : "btn-secondary"}`}>{t("common.yes")}</button>
                <button type="button" onClick={() => set("takenBefore", false)} className={`btn ${form.takenBefore === false ? "btn-primary" : "btn-secondary"}`}>{t("common.no")}</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm">{t("onboarding.diagnosticDesc")}</p>
            <p className="text-sm text-muted">
              Start with the Academic Reading set (40 questions) to estimate your
              starting band. You can also skip this.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <p className="text-sm">
              You&apos;re ready. We&apos;ll generate a starter study plan based on
              your targets.
            </p>
            <dl className="rounded-md border border-border p-3 text-sm">
              <SummaryRow k={t("onboarding.testType")} v={form.testType === "academic" ? t("onboarding.academic") : t("onboarding.general")} />
              <SummaryRow k={t("onboarding.targetBand")} v={form.targetBand} />
              <SummaryRow k={t("onboarding.testDate")} v={form.testDate || t("onboarding.noDate")} />
              <SummaryRow k={t("onboarding.weeklyTime")} v={`${form.weeklyHours}h`} />
            </dl>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => (step === 0 ? router.push("/") : setStep((s) => s - 1))}
        >
          {step === 0 ? t("onboarding.later") : t("common.previous")}
        </button>
        <div className="flex gap-3">
          {step === 4 && (
            <LinkButton href="/practice/reading/academic-reading-1" label={t("onboarding.diagnostic")} />
          )}
          {step < 5 ? (
            <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)} disabled={saving}>
              {t("common.next")}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => finish(false)} disabled={saving}>
              {saving ? <Spinner /> : t("onboarding.finish")}
            </button>
          )}
        </div>
      </div>

      {step < 5 && (
        <button type="button" className="mt-4 text-sm text-muted underline" onClick={() => finish(true)}>
          {t("common.skip")}
        </button>
      )}
    </div>
  );
}

function BandField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  return (
    <button type="button" className="btn-secondary" onClick={() => router.push(href)}>
      {label}
    </button>
  );
}
