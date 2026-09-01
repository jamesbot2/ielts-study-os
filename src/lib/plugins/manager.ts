// Plugin manager: what is active/configured, plus provider-scoped cache + health.

import { getPlugin } from "./registry";
import {
  deleteProviderCache,
  getProviderCache,
  getProviderConfig,
  saveProviderConfig,
  setProviderCache,
} from "@/lib/storage/repository";
import type { ProviderConfig } from "@/lib/storage/types";
import type { IeltsPlugin, PluginCache, PluginContext, PluginHealth } from "./types";
import { normalizeProviderError } from "./errors";
import { sanitizeProviderConfig } from "./config";

export async function getConfig(pluginId: string): Promise<ProviderConfig | undefined> {
  return getProviderConfig(pluginId);
}

export async function setConfig(pluginId: string, patch: Partial<ProviderConfig>): Promise<ProviderConfig> {
  const existing = await getProviderConfig(pluginId);
  const next: ProviderConfig = {
    id: pluginId,
    enabled: false,
    config: {},
    lastSyncAt: null,
    lastHealthCheckedAt: null,
    lastHealthStatus: null,
    lastHealthMessage: null,
    ...(existing ?? {}),
    ...patch,
  };
  // Never persist secret config fields in the browser; coerce typed values.
  if (next.config) {
    next.config = sanitizeProviderConfig(getPlugin(pluginId), next.config);
  }
  await saveProviderConfig(next);
  return next;
}

export async function enablePlugin(pluginId: string, enabled: boolean): Promise<ProviderConfig> {
  return setConfig(pluginId, { enabled });
}

export async function isEnabled(pluginId: string): Promise<boolean> {
  const c = await getProviderConfig(pluginId);
  return c?.enabled === true;
}

// Create a provider-scoped cache adapter.
export function createProviderCache(pluginId: string): PluginCache {
  const ns = (key: string) => `${pluginId}:${key}`;
  return {
    async get<T>(key: string): Promise<T | undefined> {
      return getProviderCache<T>(ns(key));
    },
    async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
      await setProviderCache(ns(key), value, ttlMs);
    },
    async delete(key: string): Promise<void> {
      await deleteProviderCache(ns(key));
    },
  };
}

// Build a real PluginContext with resolved config and a scoped cache.
export async function createPluginContext(pluginId: string): Promise<PluginContext> {
  const cfg = await getProviderConfig(pluginId);
  return { pluginId, config: cfg?.config ?? {}, cache: createProviderCache(pluginId) };
}

// Resolve the configured runtime provider from plugin metadata.
export async function resolveRuntime(pluginId: string): Promise<{ plugin: IeltsPlugin; runtime: import("./types").IeltsPluginRuntime } | null> {
  const plugin = getPlugin(pluginId);
  if (!plugin) return null;
  if (!plugin.createRuntime) return null;
  const context = await createPluginContext(pluginId);
  const runtime = await plugin.createRuntime(context);
  return { plugin, runtime };
}

export async function healthCheck(pluginId: string): Promise<PluginHealth> {
  const plugin = getPlugin(pluginId);
  if (!plugin) {
    return { status: "unavailable", message: "Unknown plugin", checkedAt: new Date().toISOString() };
  }
  try {
    let health: PluginHealth;
    if (plugin.createRuntime) {
      const resolved = await resolveRuntime(pluginId);
      if (!resolved) {
        health = { status: "not_configured", message: "Provider is not configured.", checkedAt: new Date().toISOString() };
      } else {
        health = await resolved.runtime.healthCheck();
      }
    } else {
      // Plugins without a runtime factory are metadata-only / built-in and
      // inherently healthy (no network dependency).
      health = { status: "healthy", checkedAt: new Date().toISOString() };
    }
    await setConfig(pluginId, {
      lastHealthStatus: health.status,
      lastHealthMessage: health.message ?? null,
      lastHealthCheckedAt: new Date().toISOString(),
    });
    return health;
  } catch (err) {
    const normalized = normalizeProviderError(err, pluginId);
    const health: PluginHealth = { status: "unavailable", message: normalized.message, checkedAt: new Date().toISOString() };
    await setConfig(pluginId, {
      lastHealthStatus: "unavailable",
      lastHealthMessage: normalized.message,
      lastHealthCheckedAt: new Date().toISOString(),
    });
    return health;
  }
}

export async function markSynced(pluginId: string): Promise<void> {
  await setConfig(pluginId, { lastSyncAt: new Date().toISOString() });
}

export { normalizeProviderError };
