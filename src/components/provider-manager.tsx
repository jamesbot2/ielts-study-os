"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { registerAllPlugins } from "@/lib/plugins/register";
import { listPlugins } from "@/lib/plugins/registry";
import { setConfig, healthCheck } from "@/lib/plugins/manager";
import { coerceConfigFieldValue } from "@/lib/plugins/config";
import { getProviderConfig } from "@/lib/storage/repository";
import type { ProviderConfig } from "@/lib/storage/types";
import type { IeltsPlugin, PluginHealth } from "@/lib/plugins/types";
import { Spinner } from "@/components/ui";

export function ProviderManager() {
  const { locale } = useI18n();
  const [plugins, setPlugins] = useState<IeltsPlugin[]>([]);
  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>({});
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [health, setHealth] = useState<Record<string, PluginHealth | null>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    registerAllPlugins();
    const all = listPlugins();
    setPlugins(all);
    const map: Record<string, ProviderConfig> = {};
    const draftMap: Record<string, Record<string, unknown>> = {};
    for (const p of all) {
      const c = await getProviderConfig(p.id);
      if (c) map[p.id] = c;
      else if (p.builtin) map[p.id] = { id: p.id, enabled: true, config: {}, lastSyncAt: null, lastHealthCheckedAt: null, lastHealthStatus: "healthy", lastHealthMessage: null };
      draftMap[p.id] = { ...(c?.config ?? {}) };
    }
    setConfigs(map);
    setDrafts(draftMap);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(pluginId: string, enabled: boolean) {
    // Optimistic local update so the controlled checkbox reflects immediately.
    setConfigs((prev) => ({
      ...prev,
      [pluginId]: { ...(prev[pluginId] ?? { id: pluginId, config: {}, lastSyncAt: null, lastHealthCheckedAt: null, lastHealthStatus: null, lastHealthMessage: null }), enabled },
    }));
    setBusy(pluginId);
    const cfg = await setConfig(pluginId, { enabled });
    setConfigs((prev) => ({ ...prev, [pluginId]: cfg }));
    setBusy(null);
  }

  async function saveConfig(pluginId: string) {
    setBusy(pluginId);
    const cfg = await setConfig(pluginId, { config: drafts[pluginId] ?? {} });
    setConfigs((prev) => ({ ...prev, [pluginId]: cfg }));
    setBusy(null);
    setMsg(locale === "zh" ? "已保存" : "Saved");
    setTimeout(() => setMsg(null), 1500);
  }

  async function test(pluginId: string) {
    setBusy(pluginId);
    setMsg(null);
    // Persist current draft config before testing so the runtime uses it.
    await setConfig(pluginId, { config: drafts[pluginId] ?? {} });
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
        {plugins.map((p) => {
          const cfg = configs[p.id];
          const enabled = cfg?.enabled === true;
          const h = health[p.id] ?? (cfg?.lastHealthStatus ? ({ status: cfg.lastHealthStatus, message: cfg.lastHealthMessage ?? undefined, checkedAt: cfg.lastHealthCheckedAt ?? "" } as PluginHealth) : null);
          return (
            <div key={p.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.name}</p>
                    {p.builtin ? <span className="badge badge-accent">{locale === "zh" ? "内置" : "Built-in"}</span> : <span className="badge">{locale === "zh" ? "外部" : "External"}</span>}
                    {enabled && <span className={`badge ${h?.status === "healthy" ? "badge-accent" : ""}`}>{h ? h.status : "not_tested"}</span>}
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
                  {p.createRuntime && (
                    <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => test(p.id)} disabled={busy === p.id}>
                      {busy === p.id ? <Spinner /> : locale === "zh" ? "测试连接" : "Test"}
                    </button>
                  )}
                </div>
              </div>

              {p.configFields && p.configFields.length > 0 && (
                <div className="mt-2 border-t border-border pt-2">
                  {p.configFields.map((f) => {
                    if (f.secret) {
                      return (
                        <p key={f.key} className="mb-2 text-xs text-muted">
                          {f.label}: <span className="font-medium">{locale === "zh" ? "需要受信任的后端代理" : "Requires a trusted proxy/backend"}</span>
                        </p>
                      );
                    }
                    if (f.type === "boolean") {
                      return (
                        <label key={f.key} className="mb-2 flex items-center gap-2 text-xs text-muted">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[var(--accent)]"
                            checked={Boolean(drafts[p.id]?.[f.key])}
                            onChange={(e) => setDrafts((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] ?? {}), [f.key]: e.target.checked } }))}
                          />
                          {f.label}
                        </label>
                      );
                    }
                    if (f.type === "select") {
                      return (
                        <label key={f.key} className="mb-2 block text-xs text-muted">
                          {f.label}
                          <select
                            className="input mt-1"
                            value={String(drafts[p.id]?.[f.key] ?? "")}
                            onChange={(e) => setDrafts((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] ?? {}), [f.key]: e.target.value } }))}
                          >
                            <option value="">—</option>
                            {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </label>
                      );
                    }
                    return (
                      <label key={f.key} className="mb-2 block text-xs text-muted">
                        {f.label}
                        <input
                          className="input mt-1"
                          type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                          value={String(drafts[p.id]?.[f.key] ?? "")}
                          placeholder={f.placeholder}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] ?? {}), [f.key]: coerceConfigFieldValue(f, e.target.value) } }))}
                        />
                      </label>
                    );
                  })}
                  <button className="btn-primary px-2.5 py-1.5 text-xs" onClick={() => saveConfig(p.id)} disabled={busy === p.id}>
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
