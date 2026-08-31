"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import {
  createImportedMaterial,
  deleteImportedMaterial,
  listImportedMaterials,
} from "@/lib/storage/repository";
import type { ImportedMaterial } from "@/lib/storage/types";
import { isAiAvailable } from "@/lib/ai/client";
import { Spinner } from "@/components/ui";

export function LibraryModule() {
  const { t } = useI18n();
  const [materials, setMaterials] = useState<ImportedMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);

  const load = async () => {
    setMaterials(await listImportedMaterials());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("library.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("library.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowGenerate((s) => !s)}>
            ✨ AI generate
          </button>
          <button className="btn-primary" onClick={() => setShowImport((s) => !s)}>
            + {t("library.import")}
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
        {t("library.copyrightNotice")}
      </div>

      {showGenerate && <GenerateForm />}
      {showImport && <ImportForm onDone={() => { setShowImport(false); load(); }} />}

      <p className="mb-2 text-xs text-muted">{t("library.formats")}</p>

      {materials.length === 0 ? (
        <div className="card card-pad text-center text-muted">{t("library.empty")}</div>
      ) : (
        <div className="card divide-y divide-border">
          {materials.map((m) => (
            <div key={m.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-muted">
                  {m.skill} · {m.testType} · {m.format}
                  {m.sourceType === "AI_GENERATED" && <span className="ml-2 text-amber-600">AI-generated</span>}
                </p>
                {m.content && <p className="mt-1 line-clamp-2 text-xs text-muted">{m.content.slice(0, 200)}</p>}
              </div>
              <button
                className="text-xs text-muted hover:text-red-600"
                onClick={async () => { await deleteImportedMaterial(m.id); load(); }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    title: "",
    skill: "reading",
    testType: "academic",
    format: "text",
    content: "",
    sourceType: "USER_IMPORTED",
    sourceName: "",
    license: "Personal use",
  });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await createImportedMaterial({
      title: form.title,
      skill: form.skill,
      testType: form.testType as "academic" | "general" | "both",
      sourceType: form.sourceType as "USER_IMPORTED",
      sourceName: form.sourceName,
      license: form.license,
      copyrightStatus: "User-provided",
      format: form.format,
      content: form.content,
    });
    setSaving(false);
    onDone();
  }

  return (
    <div className="card card-pad mb-4 grid gap-3 sm:grid-cols-2">
      <input className="input" placeholder={t("library.title2")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <select className="input" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })}>
        {["reading", "listening", "writing", "speaking", "vocabulary", "grammar"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="input" value={form.testType} onChange={(e) => setForm({ ...form, testType: e.target.value })}>
        <option value="academic">academic</option>
        <option value="general">general</option>
        <option value="both">both</option>
      </select>
      <select className="input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
        <option value="text">text</option>
        <option value="markdown">markdown</option>
      </select>
      <input className="input" placeholder="Source name (optional)" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
      <textarea
        className="input min-h-[120px] sm:col-span-2"
        placeholder={t("library.content")}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <button className="btn-primary sm:col-span-2" onClick={submit} disabled={saving || !form.title.trim()}>
        {saving ? <Spinner /> : t("common.save")}
      </button>
    </div>
  );
}

function GenerateForm() {
  const { t } = useI18n();
  const [topic, setTopic] = useState("");
  const [testType, setTestType] = useState<"academic" | "general">("academic");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!topic.trim()) return;
    setBusy(true);
    setError(null);
    try {
      if (!isAiAvailable()) {
        setError("AI generation is unavailable. Connect an AI backend in Settings to enable it.");
      } else {
        setError("AI generation is not yet wired to the client proxy. It will be available when a backend is connected.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card card-pad mb-4">
      <p className="mb-2 text-sm font-medium">Generate original reading practice</p>
      <p className="mb-3 text-xs text-muted">{t("ai.generatedLabel")}</p>
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Topic (e.g. renewable energy)" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <select className="input w-40" value={testType} onChange={(e) => setTestType(e.target.value as "academic" | "general")}>
          <option value="academic">academic</option>
          <option value="general">general</option>
        </select>
        <button className="btn-primary" onClick={submit} disabled={busy || !topic.trim()}>
          {busy ? <Spinner /> : "Generate"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
