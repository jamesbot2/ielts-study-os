"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import {
  getProfile,
  getSettings,
  saveProfile,
  saveSettings,
} from "@/lib/storage/repository";
import type { StudyProfile, UserSettings } from "@/lib/storage/types";
import { exportAll, importBackup, resetAllData, type ImportMode } from "@/lib/storage/export";
import { configureAiClient, DisabledAiClient, RemoteAiProxyClient } from "@/lib/ai/client";
import { Spinner } from "@/components/ui";

export function SettingsModule() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getProfile(), getSettings()]).then(([p, s]) => {
      setProfile(p);
      setSettings(s);
    });
  }, []);

  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const saveProfileCb = useCallback(async () => {
    if (!profile) return;
    await saveProfile(profile);
    flashSaved();
  }, [profile, flashSaved]);

  const saveAi = useCallback(async () => {
    if (!settings) return;
    await saveSettings({ ai: settings.ai });
    if (settings.ai.proxyUrl.trim()) {
      configureAiClient(new RemoteAiProxyClient(settings.ai.proxyUrl.trim()));
    } else {
      configureAiClient(new DisabledAiClient());
    }
    flashSaved();
  }, [settings, flashSaved]);

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

  if (!profile || !settings) return <div className="container-page"><Spinner /></div>;

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
        <button className="btn-primary mt-4" onClick={saveProfileCb}>{t("common.save")}</button>
      </section>

      {/* AI (future remote proxy; no secrets in the browser) */}
      <section className="card card-pad mb-4">
        <h2 className="mb-1 text-base font-semibold">{t("settings.ai")}</h2>
        <p className="mb-3 text-xs text-muted">
          AI is optional. Point this app at a trusted remote proxy that holds its own
          API key. The browser never stores a secret key.
        </p>
        <label className="label">
          Remote AI proxy URL
          <input
            className="input mt-1"
            value={settings.ai.proxyUrl}
            placeholder="https://your-proxy.example.com"
            onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, proxyUrl: e.target.value } })}
            autoComplete="off"
          />
        </label>
        <label className="label mt-3">
          {t("settings.model")}
          <input className="input mt-1" value={settings.ai.model} onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, model: e.target.value } })} />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={saveAi}>{t("common.save")}</button>
          {settings.ai.proxyUrl.trim() ? <span className="text-xs text-green-600">● proxy configured</span> : <span className="text-xs text-muted">● AI unavailable</span>}
        </div>
      </section>

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
