// Plugin manager: what is active/configured, plus provider cache + health.

import { getPlugin } from "./registry";
import {
  deleteProviderCache,
  getProviderCache,
  getProviderConfig,
  saveProviderConfig,
  setProviderCache,
} from "@/lib/storage/repository";
import type { ProviderConfig } from "@/lib/storage/types";
import type { IeltsPlugin, PluginCache, PluginHealth } from "./types";
import { normalizeProviderError } from "./errors";

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
    lastHealthStatus: null,
    lastHealthMessage: null,
    ...(existing ?? {}),
    ...patch,
  };
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

export async function healthCheck(pluginId: string): Promise<PluginHealth> {
  const plugin = getPlugin(pluginId);
  if (!plugin) {
    return { status: "unavailable", message: "Unknown plugin", checkedAt: new Date().toISOString() };
  }
  if (!plugin.healthCheck) {
    return { status: "healthy", checkedAt: new Date().toISOString() };
  }
  try {
    const health = await plugin.healthCheck();
    await setConfig(pluginId, {
      lastHealthStatus: health.status,
      lastHealthMessage: health.message ?? null,
      lastSyncAt: health.status === "healthy" ? new Date().toISOString() : undefined,
    } as Partial<ProviderConfig>);
    return health;
  } catch (err) {
    const normalized = normalizeProviderError(err, pluginId);
    const health: PluginHealth = { status: "unavailable", message: normalized.message, checkedAt: new Date().toISOString() };
    await setConfig(pluginId, { lastHealthStatus: "unavailable", lastHealthMessage: normalized.message });
    return health;
  }
}

// Cache adapter passed to providers via PluginContext.
export const providerCache: PluginCache = {
  async get<T>(key: string): Promise<T | undefined> {
    return getProviderCache<T>(key);
  },
  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    await setProviderCache(key, value, ttlMs);
  },
  async delete(key: string): Promise<void> {
    await deleteProviderCache(key);
  },
};

export function createPluginContext(pluginId: string): { config: Record<string, unknown>; cache: PluginCache } {
  return { config: {}, cache: providerCache };
}

export { normalizeProviderError };
export type { IeltsPlugin };
