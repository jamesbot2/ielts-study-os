// Vocabulary provider runtime: registration + resolution.

import { registerPlugin } from "../registry";
import { createPluginContext } from "../manager";
import type { IeltsPlugin } from "../types";
import { builtinVocabularyProvider } from "./builtin-provider";
import { BaicizhanVocabularyProvider } from "./baicizhan-provider";
import type { VocabularyProvider } from "./types";

export function registerAllPlugins(): void {
  registerPlugin({
    id: builtinVocabularyProvider.id,
    name: builtinVocabularyProvider.name,
    description: builtinVocabularyProvider.description,
    version: builtinVocabularyProvider.version,
    kind: "vocabulary",
    source: builtinVocabularyProvider.source,
    capabilities: [...builtinVocabularyProvider.capabilities],
    builtin: true,
  });

  registerPlugin({
    id: "baicizhan",
    name: "Baicizhan Vocabulary",
    description: "Community-compatible Baicizhan word meanings (unofficial).",
    version: "1.0.0",
    kind: "vocabulary",
    source: {
      provider: "Baicizhan (community API)",
      repository: "https://github.com/lyc8503/baicizhan-word-meaning-API",
      attribution: "Data parsed from Baicizhan (百词斩); community-hosted, unofficial.",
    },
    capabilities: ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"],
    configFields: [
      { key: "baseUrl", label: "API Base URL", type: "url", placeholder: "https://cdn.jsdelivr.net/gh/lyc8503/baicizhan-word-meaning-API/data" },
    ],
    async createRuntime(context) {
      const baseUrl = (context.config.baseUrl as string | undefined)?.trim() || undefined;
      return new BaicizhanVocabularyProvider({ baseUrl, context });
    },
  });
}

export async function resolveVocabularyProvider(pluginId: string): Promise<VocabularyProvider | null> {
  registerAllPlugins();
  const { getPlugin } = await import("../registry");
  const plugin = getPlugin(pluginId);
  if (!plugin || !plugin.createRuntime) return null;
  const context = await createPluginContext(pluginId);
  const runtime = await plugin.createRuntime(context);
  return runtime as VocabularyProvider;
}

export async function listVocabularyPlugins(): Promise<IeltsPlugin[]> {
  registerAllPlugins();
  const { findPluginsByKind } = await import("../registry");
  return findPluginsByKind("vocabulary");
}

export async function listEnabledVocabularyProviders(): Promise<VocabularyProvider[]> {
  registerAllPlugins();
  const { findPluginsByKind } = await import("../registry");
  const { getProviderConfig } = await import("@/lib/storage/repository");
  const plugins = findPluginsByKind("vocabulary");
  const providers: VocabularyProvider[] = [];

  for (const plugin of plugins) {
    if (plugin.builtin) {
      if (plugin.id === builtinVocabularyProvider.id) providers.push(builtinVocabularyProvider);
      continue;
    }
    const cfg = await getProviderConfig(plugin.id);
    if (cfg?.enabled) {
      const resolved = await resolveVocabularyProvider(plugin.id);
      if (resolved) providers.push(resolved);
    }
  }
  return providers;
}

export { builtinVocabularyProvider };
