"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { apiGet, apiPost } from "@/lib/client/api";
import { Spinner } from "@/components/ui";
import type { StudyProfile } from "@/lib/db/store";

interface AiConfigView {
  provider: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enableCritic: boolean;
  hasKey: boolean;
  keyHint: string;
  configured: boolean;
}

interface SpeechConfigView {
  sttProvider: string;
  sttBaseUrl: string;
  sttModel: string;
  hasSttKey: boolean;
  ttsProvider: string;
  ttsVoice: string;
  pronunciationProvider: string;
  hasPronunciationKey: boolean;
}

export function SettingsModule() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [ai, setAi] = useState<AiConfigView | null>(null);
  const [speech, setSpeech] = useState<SpeechConfigView | null>(null);
  const [aiKey, setAiKey] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<StudyProfile>("/api/profile").then(setProfile);
    apiGet<AiConfigView>("/api/ai-config").then(setAi);
    apiGet<SpeechConfigView>("/api/speech-config").then(setSpeech);
  }, []);

  const saveProfile = useCallback(async () => {
    if (!profile) return;
    await apiPost("/api/profile", profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile]);

  const saveAi = useCallback(async () => {
    if (!ai) return;
    await apiPost("/api/ai-config", { ...ai, apiKey: aiKey || undefined });
    const refreshed = await apiGet<AiConfigView>("/api/ai-config");
    setAi(refreshed);
    setAiKey("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [ai, aiKey]);

  const testAi = useCallback(async () => {
    setTestResult("Testing…");
    try {
      const res = await apiPost<{ ok: boolean; reply?: string; error?: string }>("/api/ai-config/test", { apiKey: aiKey || undefined });
      setTestResult(res.ok ? `OK: ${res.reply}` : `Failed: ${res.error}`);
    } catch (e) {
      setTestResult(`Failed: ${(e as Error).message}`);
    }
  }, [aiKey]);

  const saveSpeech = useCallback(async () => {
    if (!speech) return;
    await apiPost("/api/speech-config", speech);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [speech]);

  if (!profile || !ai || !speech) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
        {saved && <span className="text-sm text-green-600">{t("settings.saved")} ✓</span>}
      </div>

      {/* Profile */}
      <section className="card card-pad mb-4">
        <h2 className="mb-3 text-base font-semibold">{t("settings.profile")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label">
            {t("onboarding.testType")}
            <select className="input mt-1" value={profile.testType} onChange={(e) => setProfile({ ...profile, testType: e.target.value as "academic" | "general" })}>
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </label>
          <label className="label">
            {t("onboarding.targetBand")}
            <select className="input mt-1" value={String(profile.targetBand ?? 6.5)} onChange={(e) => setProfile({ ...profile, targetBand: Number(e.target.value) })}>
              {["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="label">
            {t("onboarding.currentBand")}
            <select className="input mt-1" value={String(profile.currentBand ?? 4.5)} onChange={(e) => setProfile({ ...profile, currentBand: Number(e.target.value) })}>
              {["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="label">
            {t("onboarding.testDate")}
            <input type="date" className="input mt-1" value={profile.testDate ?? ""} onChange={(e) => setProfile({ ...profile, testDate: e.target.value || null })} />
          </label>
          <label className="label">
            {t("onboarding.weeklyTime")}
            <input type="number" className="input mt-1" value={profile.weeklyHours} onChange={(e) => setProfile({ ...profile, weeklyHours: Number(e.target.value) })} />
          </label>
        </div>
        <button className="btn-primary mt-4" onClick={saveProfile}>{t("common.save")}</button>
      </section>

      {/* AI */}
      <section className="card card-pad mb-4">
        <h2 className="mb-1 text-base font-semibold">{t("settings.ai")}</h2>
        <p className="mb-3 text-xs text-muted">{t("settings.providerHint")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label">
            {t("settings.baseUrl")}
            <input className="input mt-1" value={ai.baseUrl} onChange={(e) => setAi({ ...ai, baseUrl: e.target.value })} />
          </label>
          <label className="label">
            {t("settings.model")}
            <input className="input mt-1" value={ai.model} onChange={(e) => setAi({ ...ai, model: e.target.value })} />
          </label>
          <label className="label sm:col-span-2">
            {t("settings.apiKey")} {ai.hasKey && <span className="text-xs text-muted">({ai.keyHint})</span>}
            <input className="input mt-1" type="password" value={aiKey} placeholder={ai.hasKey ? "Leave blank to keep existing key" : "sk-..."} onChange={(e) => setAiKey(e.target.value)} autoComplete="off" />
            <span className="mt-1 block text-xs text-muted">{t("settings.keyServerOnly")}</span>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={saveAi}>{t("common.save")}</button>
          <button className="btn-secondary" onClick={testAi}>{t("settings.testConnection")}</button>
          {ai.configured && <span className="text-xs text-green-600">● configured</span>}
        </div>
        {testResult && <p className="mt-2 text-sm text-muted">{testResult}</p>}
      </section>

      {/* Speech */}
      <section className="card card-pad mb-4">
        <h2 className="mb-1 text-base font-semibold">{t("settings.speech")}</h2>
        <p className="mb-3 text-xs text-muted">{t("speaking.noStt")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label">
            {t("settings.speechToText")} provider
            <input className="input mt-1" value={speech.sttProvider} placeholder="whisper-http / openai-compatible-stt" onChange={(e) => setSpeech({ ...speech, sttProvider: e.target.value })} />
          </label>
          <label className="label">
            STT base URL
            <input className="input mt-1" value={speech.sttBaseUrl} onChange={(e) => setSpeech({ ...speech, sttBaseUrl: e.target.value })} />
          </label>
          <label className="label">
            {t("settings.textToSpeech")} provider
            <input className="input mt-1" value={speech.ttsProvider} onChange={(e) => setSpeech({ ...speech, ttsProvider: e.target.value })} />
          </label>
          <label className="label">
            {t("settings.pronunciation")} provider
            <input className="input mt-1" value={speech.pronunciationProvider} onChange={(e) => setSpeech({ ...speech, pronunciationProvider: e.target.value })} />
          </label>
        </div>
        <button className="btn-primary mt-4" onClick={saveSpeech}>{t("common.save")}</button>
      </section>

      {/* Data */}
      <section className="card card-pad mb-4">
        <h2 className="mb-3 text-base font-semibold">{t("settings.data")}</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/api/export" className="btn-secondary" download>{t("settings.exportData")}</a>
        </div>
        <p className="mt-3 text-xs text-muted">
          Data is stored locally in SQLite (data/ielts.db). Your recordings and
          imported materials are never committed to the repository.
        </p>
      </section>
    </div>
  );
}
