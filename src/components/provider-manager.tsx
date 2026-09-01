"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { registerVocabularyPlugins } from "@/lib/plugins/vocabulary";
import { setConfig, healthCheck } from "@/lib/plugins/manager";
import { getProviderConfig } from "@/lib/storage/repository";
import type { ProviderConfig } from "@/lib/storage/types";
import type { PluginHealth } from "@/lib/plugins/types";
import { Spinner } from "@/components/ui";

interface ProviderView {
  id: string;
  name: string;
  description: string;
  kind: string;
  capabilities: string[];
  source: { repository?: string; provider?: string; license?: string; attribution?: string };
  builtin: boolean;
}

export function ProviderManager() {
  const { t, locale } = useI18n();
  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>({});
  const [health, setHealth] = useState<Record<string, PluginHealth | null>>({});
  const [baseUrl, setBaseUrl] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const providers: ProviderView[] = [
    {
      id: "ielts-study-os-builtin",
      name: "IELTS Study OS Core",
      description: "Bundled original IELTS vocabulary.",
      kind: "vocabulary",
      capabilities: ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"],
      source: { provider: "IELTS Study OS", license: "CC0" },
      builtin: true,
    },
    {
      id: "baicizhan",
      name: "Baicizhan Vocabulary",
      description: "Community-compatible Baicizhan word meanings (unofficial).",
      kind: "vocabulary",
      capabilities: ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"],
      source: {
        provider: "Baicizhan (community API)",
        repository: "https://github.com/lyc8503/baicizhan-word-meaning-API",
        attribution: "Data parsed from Baicizhan (百词斩); community-hosted, unofficial.",
      },
      builtin: false,
    },
  ];

  const load = useCallback(async () => {
    registerVocabularyPlugins();
    const map: Record<string, ProviderConfig> = {};
    for (const p of providers) {
      const c = await getProviderConfig(p.id);
      if (c) map[p.id] = c;
      else if (p.builtin) map[p.id] = { id: p.id, enabled: true, config: {}, lastSyncAt: null, lastHealthStatus: "healthy", lastHealthMessage: null };
    }
    setConfigs(map);
    const baicizhan = map["baicizhan"];
    if (baicizhan) setBaseUrl((baicizhan.config.baseUrl as string) ?? "");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(pluginId: string, enabled: boolean) {
    setBusy(pluginId);
    const cfg = await setConfig(pluginId, { enabled });
    setConfigs((prev) => ({ ...prev, [pluginId]: cfg }));
    setBusy(null);
  }

  async function saveBaseUrl() {
    setBusy("baicizhan");
    const cfg = await setConfig("baicizhan", { config: { baseUrl: baseUrl.trim() || undefined } });
    setConfigs((prev) => ({ ...prev, baicizhan: cfg }));
    setBusy(null);
    setMsg(locale === "zh" ? "已保存" : "Saved");
    setTimeout(() => setMsg(null), 1500);
  }

  async function test(pluginId: string) {
    setBusy(pluginId);
    setMsg(null);
    if (pluginId === "baicizhan") {
      // Persist the current URL before testing.
      await setConfig("baicizhan", { config: { baseUrl: baseUrl.trim() || undefined } });
    }
    const h = await healthCheck(pluginId);
    setHealth((prev) => ({ ...prev, [pluginId]: h }));
    setBusy(null);
    setMsg(h.status === "healthy" ? (locale === "zh" ? "连接正常" : "Connected") : (h.message ?? h.status));
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <section className="card card-pad mb-4">
      <h2 className="mb-1 text-base font-semibold">{locale === "zh" ? "插件 / 服务提供方" : "Plugins / Providers"}</h2>
      <p className="mb-3 text-xs text-muted">
        {locale === "zh" ? "外部内容提供方通过统一接口接入，失败不会影响核心功能。" : "External providers connect through a uniform interface; failures never break core features."}
      </p>

      <div className="space-y-3">
        {providers.map((p) => {
          const cfg = configs[p.id];
          const enabled = cfg?.enabled === true;
          const h = health[p.id] ?? (cfg?.lastHealthStatus ? ({ status: cfg.lastHealthStatus, message: cfg.lastHealthMessage ?? undefined, checkedAt: "" } as PluginHealth) : null);
          return (
            <div key={p.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.name}</p>
                    {p.builtin ? <span className="badge badge-accent">{locale === "zh" ? "内置" : "Built-in"}</span> : <span className="badge">{locale === "zh" ? "外部" : "External"}</span>}
                    {enabled && <span className={`badge ${h?.status === "healthy" ? "badge-accent" : ""}`}>{h?.status ?? "configured"}</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{p.description}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.capabilities.join(" · ")}</p>
                  {p.source.repository && (
                    <a href={p.source.repository} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline">{p.source.repository}</a>
                  )}
                  {p.source.attribution && <p className="text-[11px] text-muted">{p.source.attribution}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {!p.builtin && (
                    <label className="flex items-center gap-1.5 text-sm text-muted">
                      <input type="checkbox" checked={enabled} onChange={(e) => toggle(p.id, e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                      {locale === "zh" ? "启用" : "Enable"}
                    </label>
                  )}
                  {!p.builtin && (
                    <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => test(p.id)} disabled={busy === p.id}>
                      {busy === p.id ? <Spinner /> : locale === "zh" ? "测试连接" : "Test"}
                    </button>
                  )}
                </div>
              </div>

              {p.id === "baicizhan" && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-2">
                  <label className="text-xs text-muted">{locale === "zh" ? "API Base URL" : "API Base URL"}</label>
                  <input className="input max-w-md flex-1" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://cdn.jsdelivr.net/gh/lyc8503/baicizhan-word-meaning-API/data" />
                  <button className="btn-primary px-2.5 py-1.5 text-xs" onClick={saveBaseUrl} disabled={busy === "baicizhan"}>
                    {locale === "zh" ? "保存" : "Save"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}
    </section>
  );
}
