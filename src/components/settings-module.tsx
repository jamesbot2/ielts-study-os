"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { useStudyProfile } from "@/components/study-profile-provider";
import { useAi, type ProxyHealthResult } from "@/components/ai-provider";
import {
  CANONICAL_AI_BACKEND,
  isCanonicalFrontend as isCanonicalFrontendHost,
} from "@/lib/ai/backend-health";
import { ProviderManager } from "@/components/provider-manager";
import { LlmProviderManager } from "@/components/llm-provider-manager";
import { getSettings, saveSettings } from "@/lib/storage/repository";
import type { UserSettings } from "@/lib/storage/types";
import { exportAll, importBackup, resetAllData, type ImportMode } from "@/lib/storage/export";
import { Spinner } from "@/components/ui";

export function SettingsModule() {
  const { t, locale } = useI18n();
  const { profile, updateProfile, loading: profileLoading } = useStudyProfile();
  const { settings: aiSettings, saveAi, available: aiAvailable, testProxy } = useAi();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [aiUrl, setAiUrl] = useState("");
  const [healthResult, setHealthResult] = useState<ProxyHealthResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const aiUrlEditedRef = useRef(false);

  // Speech settings are loaded locally (not part of the profile/ai providers).
  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  // Hydrate the AI URL from the AiProvider once settings load, without
  // overwriting any unsaved user edits made before hydration. On the canonical
  // production frontend, prefill the production AI/RAG backend URL so users
  // don't have to know it — it remains an editable, explicitly saved value.
  useEffect(() => {
    if (aiSettings && !aiUrlEditedRef.current) {
      const saved = aiSettings.ai.proxyUrl ?? "";
      if (saved) {
        setAiUrl(saved);
      } else if (typeof window !== "undefined" && isCanonicalFrontendHost(window.location.hostname)) {
        setAiUrl(CANONICAL_AI_BACKEND);
      }
    }
  }, [aiSettings]);

  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  async function patchProfile(patch: Partial<import("@/lib/storage/types").StudyProfile>) {
    setSaveError(null);
    try {
      await updateProfile(patch);
      flashSaved();
    } catch (e) {
      setSaveError((e as Error).message || "Save failed");
    }
  }

  const saveSpeech = useCallback(async () => {
    if (!settings) return;
    await saveSettings({ speech: settings.speech });
    flashSaved();
  }, [settings, flashSaved]);

  async function handleExport() {
    await exportAll();
  }

  async function handleImport(file: File) {
    setImportStatus("Importing…");
    try {
      const result = await importBackup(file, importMode);
      setImportStatus(
        result.ok
          ? `Imported ${Object.values(result.counts).reduce((a, b) => a + b, 0)} records (${result.mode}). Reloading…`
          : result.error ?? "Import failed",
      );
      if (result.ok) setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setImportStatus(`Import failed: ${(e as Error).message}`);
    }
  }

  async function handleReset() {
    if (!window.confirm("Reset ALL local data? This permanently deletes your profile, progress, vocabulary, mistakes and drafts.")) return;
    setResetting(true);
    await resetAllData();
    window.location.reload();
  }

  if (profileLoading || !settings) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
        {saved && <span className="text-sm text-green-600">{t("settings.saved")} ✓</span>}
        {saveError && <span className="text-sm text-red-600">{saveError}</span>}
      </div>

      {/* Profile */}
      <section className="card card-pad mb-4">
        <h2 className="mb-3 text-base font-semibold">{t("settings.profile")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label">
            {t("onboarding.testType")}
            <select className="input mt-1" value={profile.testType} onChange={(e) => patchProfile({ testType: e.target.value as "academic" | "general" })}>
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </label>
          <label className="label">
            {t("onboarding.targetBand")}
            <select className="input mt-1" value={String(profile.targetBand ?? 6.5)} onChange={(e) => patchProfile({ targetBand: Number(e.target.value) })}>
              {["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="label">
            {t("onboarding.currentBand")}
            <select className="input mt-1" value={String(profile.currentBand ?? 4.5)} onChange={(e) => patchProfile({ currentBand: Number(e.target.value) })}>
              {["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="label">
            {t("onboarding.testDate")}
            <input type="date" className="input mt-1" value={profile.testDate ?? ""} onChange={(e) => patchProfile({ testDate: e.target.value || null })} />
          </label>
          <label className="label">
            {t("onboarding.weeklyTime")}
            <input type="number" className="input mt-1" value={profile.weeklyHours} onChange={(e) => patchProfile({ weeklyHours: Number(e.target.value) })} />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">{t("settings.saved")}</p>
      </section>

      {/* AI Service: points at the IELTS Study OS AI/RAG backend (not an LLM). */}
      <section className="card card-pad mb-4">
        <h2 className="mb-1 text-base font-semibold">{t("settings.ai")}</h2>
        <p className="mb-3 text-xs text-muted">
          {locale === "zh"
            ? "这是 IELTS Study OS 的 AI/RAG 后端地址。连接测试只检查后端本身（/health），不需要也不使用任何 LLM 密钥。下方可单独配置 LLM Provider。"
            : "This is the IELTS Study OS AI/RAG backend address. The connection test checks the backend itself (/health) — it needs no LLM key. LLM credentials are configured separately below."}
        </p>
        <label className="label">
          {locale === "zh" ? "AI 后端地址（AI Service URL）" : "AI Service URL"}
          <input
            className="input mt-1"
            value={aiUrl}
            placeholder="https://ielts-study-os-ai-rag.vercel.app"
            onChange={(e) => { aiUrlEditedRef.current = true; setAiUrl(e.target.value); }}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <p className="mt-1 text-xs text-muted">
          {locale === "zh"
            ? "LLM Provider 的 API 密钥是会话级（仅内存），不会保存在这里或浏览器存储中。"
            : "LLM provider API keys are session-only (in-memory) and are managed below — never here."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={async () => { await saveAi({ proxyUrl: aiUrl }); flashSaved(); }}>{t("common.save")}</button>
          <button
            className="btn-secondary"
            disabled={testing}
            onClick={async () => {
              setTesting(true);
              setHealthResult(null);
              try {
                const r = await testProxy(aiUrl);
                setHealthResult(r);
              } finally {
                setTesting(false);
              }
            }}
          >
            {testing ? "…" : t("settings.testConnection")}
          </button>
          {aiAvailable
            ? (healthResult?.ok
              ? <span className="text-xs text-green-600">● {locale === "zh" ? "已连接并验证" : "connected &amp; verified"}</span>
              : <span className="text-xs text-amber-600">● {locale === "zh" ? "已配置（未验证）" : "configured (not verified)"}</span>)
            : <span className="text-xs text-muted">● {locale === "zh" ? "AI 未连接" : "AI unavailable"}</span>}
        </div>
        {healthResult && (
          <div className="mt-2 rounded-md border border-border p-2 text-xs">
            <p className={healthResult.ok ? "text-green-700" : "text-red-600"}>{healthResult.message}</p>
            {healthResult.ok && healthResult.service && (
              <p className="mt-1 text-muted">
                {locale === "zh" ? "服务" : "Service"}: {healthResult.service}
                {healthResult.ragStatus ? ` · RAG: ${healthResult.ragStatus}` : ""}
                {healthResult.retrievalMode ? ` · ${healthResult.retrievalMode}` : ""}
              </p>
            )}
            {healthResult.ok && (
              <p className="text-muted">
                DB: {healthResult.databaseReachable === undefined ? "n/a" : healthResult.databaseReachable ? "reachable" : "down"}
                {healthResult.pgvectorAvailable !== undefined ? ` · pgvector: ${healthResult.pgvectorAvailable ? "yes" : "no"}` : ""}
                {healthResult.embeddingsConfigured !== undefined ? ` · embeddings: ${healthResult.embeddingsConfigured ? "configured" : "missing"}` : ""}
                {healthResult.knowledgeChunkCount !== undefined ? ` · chunks: ${healthResult.knowledgeChunkCount}` : ""}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Runtime LLM providers (CC Switch-style BYOK) */}
      <LlmProviderManager />

      {/* Speech (future remote services) */}
      <section className="card card-pad mb-4">
        <h2 className="mb-1 text-base font-semibold">{t("settings.speech")}</h2>
        <p className="mb-3 text-xs text-muted">{t("speaking.noStt")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label">
            {t("settings.speechToText")} base URL
            <input className="input mt-1" value={settings.speech.sttBaseUrl} placeholder="http://localhost:9000" onChange={(e) => setSettings({ ...settings, speech: { ...settings.speech, sttBaseUrl: e.target.value } })} />
          </label>
          <label className="label">
            STT model
            <input className="input mt-1" value={settings.speech.sttModel} onChange={(e) => setSettings({ ...settings, speech: { ...settings.speech, sttModel: e.target.value } })} />
          </label>
        </div>
        <button className="btn-primary mt-4" onClick={saveSpeech}>{t("common.save")}</button>
      </section>

      {/* Providers / plugins */}
      <ProviderManager />

      {/* Data */}
      <section className="card card-pad mb-4">
        <h2 className="mb-3 text-base font-semibold">{t("settings.data")}</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={handleExport}>{t("settings.exportData")}</button>
        </div>

        <div className="mt-4 rounded-md border border-border p-3">
          <p className="text-sm font-medium">Import backup</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select className="input w-40" value={importMode} onChange={(e) => setImportMode(e.target.value as ImportMode)}>
              <option value="merge">Merge</option>
              <option value="replace">Replace all</option>
            </select>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = "";
              }}
            />
            <button className="btn-secondary" onClick={() => fileRef.current?.click()}>Choose backup file…</button>
          </div>
          <p className="mt-2 text-xs text-muted">Replace clears current data before restoring. Merge keeps existing records.</p>
          {importStatus && <p className="mt-2 text-sm text-muted">{importStatus}</p>}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <button className="btn-danger" onClick={handleReset} disabled={resetting}>
            {resetting ? <Spinner /> : t("settings.resetProgress")}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Data is stored locally in your browser (IndexedDB). Your recordings and
          imported materials never leave your device unless you connect a remote AI or
          speech service.
        </p>
      </section>
    </div>
  );
}
