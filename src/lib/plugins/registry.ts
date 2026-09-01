// Central plugin registry: what plugins exist.

import type { IeltsPlugin, PluginCapability, PluginKind } from "./types";

const plugins = new Map<string, IeltsPlugin>();

export function registerPlugin(plugin: IeltsPlugin): void {
  // Idempotent: re-registering the same id is a no-op.
  if (plugins.has(plugin.id)) return;
  plugins.set(plugin.id, plugin);
}

export function listPlugins(): IeltsPlugin[] {
  return [...plugins.values()];
}

export function getPlugin(id: string): IeltsPlugin | undefined {
  return plugins.get(id);
}

export function findPluginsByCapability(capability: PluginCapability): IeltsPlugin[] {
  return [...plugins.values()].filter((p) => p.capabilities.includes(capability));
}

export function findPluginsByKind(kind: PluginKind): IeltsPlugin[] {
  return [...plugins.values()].filter((p) => p.kind === kind);
}

export function resetRegistry(): void {
  plugins.clear();
}
