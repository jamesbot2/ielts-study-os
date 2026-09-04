"use client";

// CC Switch-style runtime LLM provider manager.
//
// Users add/edit/delete/test/switch OpenAI-compatible providers from Settings.
// Provider METADATA (name/baseUrl/model) persists locally; API keys are
// SESSION-ONLY (in-memory, re-entered after reload) and never persisted or
// exported. The active provider is sent per-request to the IELTS AI/RAG
// backend, which validates it (SSRF-safe) and uses it for that request only.

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { useAi } from "@/components/ai-provider";
import { PROVIDER_PRESETS, presetById } from "@/lib/ai/provider-presets";
import {
  clearProviderSessionKey,
  getProviderSessionKey,
  hasProviderSessionKey,
  setProviderSessionKey,
} from "@/lib/ai/provider-session";
import type { LlmProviderPreset, LlmProviderProfile } from "@/lib/storage/types";
import { Plus, Trash2, Check, Plug, RefreshCw, ChevronDown } from "lucide-react";

interface Draft {
  id: string | null;
  displayName: string;
  preset: LlmProviderPreset;
  baseUrl: string;
  model: string;
  apiKey: string;
  keyIsSession: boolean;
}

function newId(): string {
  return `llm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_DRAFT: Draft = {
  id: null,
  displayName: "",
  preset: "deepseek",
  baseUrl: "",
  model: "",
  apiKey: "",
  keyIsSession: false,
};

export function LlmProviderManager() {
  const { t, locale } = useI18n();
  const { settings, saveAi } = useAi();
  const profiles: LlmProviderProfile[] = settings?.ai.llmProviders ?? [];
  const activeId = settings?.ai.activeProviderId ?? null;
  const proxyUrl = settings?.ai.proxyUrl ?? "";

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [modelList, setModelList] = useState<string[]>([]);
  const keyInputRef = useRef<HTMLInputElement>(null);

  const flash = useCallback((kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
  }, []);

  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 5000);
    return () => clearTimeout(id);
  }, [msg]);

  // Pick a preset default when the preset selector changes.
  const applyPreset = (id: LlmProviderPreset) => {
    const preset = presetById(id);
    setDraft((d) => ({
      ...d,
      preset: id,
      baseUrl: preset?.baseUrl ?? d.baseUrl,
      // Keep an existing model only when it looks custom; otherwise prefill a hint.
      model: d.model || preset?.placeholderModel || "",
    }));
  };

  const startAdd = () => {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT, preset: "deepseek", baseUrl: presetById("deepseek")?.baseUrl ?? "" });
    setAdding(true);
  };

  const startEdit = (p: LlmProviderProfile) => {
    setEditingId(p.id);
    setAdding(true);
    setDraft({
      id: p.id,
      displayName: p.displayName,
      preset: p.preset,
      baseUrl: p.baseUrl,
      model: p.model,
      apiKey: "",
      keyIsSession: hasProviderSessionKey(p.id),
    });
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setModelList([]);
  };

  const saveDraft = async () => {
    const name = draft.displayName.trim();
    const baseUrl = draft.baseUrl.trim();
    const model = draft.model.trim();
    if (!name || !baseUrl || !model) {
      flash("err", locale === "zh" ? "请填写名称、Base URL 和模型。" : "Name, Base URL and model are required.");
      return;
    }
    const profile: LlmProviderProfile = {
      id: draft.id ?? newId(),
      displayName: name,
      preset: draft.preset,
      baseUrl,
      model,
      createdAt: new Date().toISOString(),
    };
    if (draft.apiKey.trim()) {
      setProviderSessionKey(profile.id, draft.apiKey.trim());
    }
    const exists = profiles.some((p) => p.id === profile.id);
    const next = exists ? profiles.map((p) => (p.id === profile.id ? profile : p)) : [...profiles, profile];
    const nextActive = !activeId || (exists && activeId === profile.id) ? profile.id : activeId;
    await saveAi({ llmProviders: next, activeProviderId: nextActive });
    setAdding(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    flash("ok", locale === "zh" ? "已保存。" : "Saved.");
  };

  const removeProvider = async (id: string) => {
    const next = profiles.filter((p) => p.id !== id);
    clearProviderSessionKey(id);
    await saveAi({ llmProviders: next, activeProviderId: activeId === id ? (next[0]?.id ?? null) : activeId });
    flash("ok", locale === "zh" ? "已删除。" : "Deleted.");
  };

  const setActive = async (id: string) => {
    await saveAi({ activeProviderId: id });
    flash("ok", locale === "zh" ? "已设为当前 Provider。" : "Active provider set.");
  };

  const clearSessionKey = async (id: string) => {
    clearProviderSessionKey(id);
    setDraft((d) => (d.id === id ? { ...d, apiKey: "", keyIsSession: false } : d));
    flash("ok", locale === "zh" ? "会话密钥已清除，刷新后需重新输入。" : "Session key cleared. Re-enter after reload.");
  };

  const backendBase = proxyUrl.replace(/\/$/, "");
  const requestProvider = (p: LlmProviderProfile) => ({
    baseUrl: p.baseUrl,
    model: p.model,
    apiKey: getProviderSessionKey(p.id),
    name: p.displayName,
  });

  const testConnection = async (p: LlmProviderProfile) => {
    setBusy(p.id);
    setMsg(null);
    try {
      const res = await fetch(`${backendBase}/api/llm/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: requestProvider(p) }),
        signal: AbortSignal.timeout(20000),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      flash(data.ok ? "ok" : "err", data.message ?? (res.ok ? "OK" : `HTTP ${res.status}`));
    } catch (e) {
      flash("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const fetchModels = async (p: LlmProviderProfile) => {
    setBusy(`models-${p.id}`);
    setMsg(null);
    try {
      const res = await fetch(`${backendBase}/api/llm/models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: requestProvider(p) }),
        signal: AbortSignal.timeout(15000),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; models?: string[] };
      if (data.ok && data.models?.length) {
        setModelList(data.models);
        flash("ok", `${data.models.length} models`);
      } else {
        setModelList([]);
        flash("err", data.message ?? "No models returned");
      }
    } catch (e) {
      flash("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const hasBackend = proxyUrl.trim().length > 0;

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            {locale === "zh" ? "LLM Provider（CC Switch 风格）" : "LLM Providers (CC Switch style)"}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {locale === "zh"
              ? "密钥仅保存在当前会话内存中，刷新后需重新输入；不会写入浏览器存储或备份。"
              : "API keys are session-only (in-memory) and are re-entered after a reload. They are never persisted or exported."}
          </p>
        </div>
        <button className="btn-secondary" onClick={startAdd}>
          <Plus className="h-4 w-4" /> {locale === "zh" ? "添加 Provider" : "Add Provider"}
        </button>
      </div>

      {!hasBackend && (
        <p className="mb-3 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          {locale === "zh"
            ? "请先在上方填写 AI Proxy URL（指向 IELTS AI/RAG 后端），才能测试连接。"
            : "Set the AI Proxy URL above (pointing at the IELTS AI/RAG backend) before testing connections."}
        </p>
      )}

      {profiles.length === 0 && !adding && (
        <p className="text-sm text-muted">
          {locale === "zh" ? "尚未添加任何 Provider。" : "No providers yet."}
        </p>
      )}

      {profiles.map((p) => {
        const isActive = p.id === activeId;
        const keyPresent = hasProviderSessionKey(p.id);
        return (
          <div key={p.id} className={`mb-2 rounded-md border p-3 ${isActive ? "border-accent" : "border-border"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                data-testid={`set-active-${p.id}`}
                className="btn-secondary"
                onClick={() => setActive(p.id)}
                title={locale === "zh" ? "设为当前" : "Set active"}
              >
                {isActive ? <Check className="h-4 w-4 text-green-600" /> : <ChevronDown className="h-4 w-4" />}
                {p.displayName}
              </button>
              {isActive && <span className="text-xs font-medium text-green-700">● {locale === "zh" ? "当前" : "Active"}</span>}
              <span className="text-xs text-muted">Base: {p.baseUrl}</span>
              <span className="text-xs text-muted">Model: {p.model}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={keyPresent ? "text-green-700" : "text-muted"}>
                {keyPresent ? "● " + (locale === "zh" ? "会话密钥已配置" : "Session key configured") : (locale === "zh" ? "无会话密钥" : "No session key")}
              </span>
              {keyPresent && (
                <button data-testid={`clear-key-${p.id}`} className="btn-ghost text-xs" onClick={() => clearSessionKey(p.id)}>
                  {locale === "zh" ? "清除密钥" : "Clear key"}
                </button>
              )}
              <button data-testid={`test-connection-${p.id}`} className="btn-ghost text-xs" onClick={() => testConnection(p)} disabled={busy === p.id}>
                <Plug className="h-3.5 w-3.5" /> {busy === p.id ? "…" : t("settings.testConnection")}
              </button>
              <button className="btn-ghost text-xs" onClick={() => fetchModels(p)} disabled={busy === `models-${p.id}`}>
                <RefreshCw className="h-3.5 w-3.5" /> {locale === "zh" ? "获取模型" : "Fetch models"}
              </button>
              <button data-testid={`edit-${p.id}`} className="btn-ghost text-xs" onClick={() => startEdit(p)}>
                {locale === "zh" ? "编辑" : "Edit"}
              </button>
              <button data-testid={`delete-${p.id}`} className="btn-ghost text-xs text-red-600" onClick={() => removeProvider(p.id)}>
                <Trash2 className="h-3.5 w-3.5" /> {locale === "zh" ? "删除" : "Delete"}
              </button>
            </div>
            {modelList.length > 0 && p.id === editingId && (
              <select
                className="input mt-2 w-full"
                value={draft.model}
                onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
              >
                <option value={draft.model}>{draft.model}</option>
                {modelList.filter((m) => m !== draft.model).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>
        );
      })}

      {adding && (
        <div className="rounded-md border border-border p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="label">
              {locale === "zh" ? "显示名称" : "Display name"}
              <input
                className="input mt-1"
                value={draft.displayName}
                placeholder={locale === "zh" ? "例如：DeepSeek" : "e.g. DeepSeek"}
                onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
              />
            </label>
            <label className="label">
              {locale === "zh" ? "预设" : "Preset"}
              <select
                className="input mt-1"
                value={draft.preset}
                onChange={(e) => applyPreset(e.target.value as LlmProviderPreset)}
              >
                {PROVIDER_PRESETS.map((pr) => (
                  <option key={pr.id} value={pr.id}>{pr.label}</option>
                ))}
              </select>
            </label>
            <label className="label sm:col-span-2">
              Base URL
              <input
                className="input mt-1"
                value={draft.baseUrl}
                placeholder="https://api.deepseek.com/v1"
                onChange={(e) => setDraft((d) => ({ ...d, baseUrl: e.target.value }))}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <label className="label">
              Model
              <input
                className="input mt-1"
                value={draft.model}
                placeholder="deepseek-chat"
                onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <label className="label">
              {locale === "zh" ? "API 密钥（仅本次会话）" : "API key (session only)"}
              <div className="mt-1 flex items-center gap-1">
                <input
                  ref={keyInputRef}
                  className="input flex-1"
                  type="password"
                  value={draft.apiKey}
                  placeholder={draft.keyIsSession ? "••••••••" : ""}
                  onChange={(e) => setDraft((d) => ({ ...d, apiKey: e.target.value }))}
                  autoComplete="off"
                />
              </div>
              <span className="mt-1 block text-xs text-muted">
                {locale === "zh"
                  ? "密钥只保存在当前会话内存，不写入浏览器存储或备份；刷新后需重新输入。"
                  : "Stored in memory for this session only — never persisted or exported. Re-enter after a reload."}
              </span>
            </label>
          </div>
          {msg && <p className={`mt-2 text-sm ${msg.kind === "ok" ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>}
          <div className="mt-3 flex gap-2">
            <button data-testid="llm-provider-save" className="btn-primary" onClick={saveDraft}>
              {locale === "zh" ? "保存" : "Save"}
            </button>
            <button data-testid="llm-provider-cancel" className="btn-secondary" onClick={cancel}>
              {locale === "zh" ? "取消" : "Cancel"}
            </button>
          </div>
        </div>
      )}
      {!adding && msg && (
        <p className={`mt-2 text-sm ${msg.kind === "ok" ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
      )}
    </div>
  );
}
