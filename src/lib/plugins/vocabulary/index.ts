// Vocabulary plugin registration + runtime resolution.

import { registerPlugin, findPluginsByKind } from "../registry";
import { createPluginContext } from "../manager";
import { getProviderConfig } from "@/lib/storage/repository";
import type { IeltsPlugin } from "../types";
import { builtinVocabularyProvider } from "./builtin-provider";
import { BaicizhanVocabularyProvider } from "./baicizhan-provider";
import type { VocabularyProvider } from "./types";

export function registerVocabularyPlugins(): void {
  registerPlugin({
    id: builtinVocabularyProvider.id,
    name: builtinVocabularyProvider.name,
    description: builtinVocabularyProvider.description,
    version: builtinVocabularyProvider.version,
    kind: "vocabulary",
    source: builtinVocabularyProvider.source,
    capabilities: [...builtinVocabularyProvider.capabilities],
    builtin: true,
    // Built-in resolves through the same runtime path as any other provider.
    async createRuntime() {
      return builtinVocabularyProvider;
    },
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
  registerVocabularyPlugins();
  const plugin = findPluginsByKind("vocabulary").find((p) => p.id === pluginId);
  if (!plugin || !plugin.createRuntime) return null;
  const context = await createPluginContext(pluginId);
  const runtime = await plugin.createRuntime(context);
  return runtime as VocabularyProvider;
}

export async function listVocabularyPlugins(): Promise<IeltsPlugin[]> {
  registerVocabularyPlugins();
  return findPluginsByKind("vocabulary");
}

export async function listEnabledVocabularyProviders(): Promise<VocabularyProvider[]> {
  registerVocabularyPlugins();
  const plugins = findPluginsByKind("vocabulary");
  const providers: VocabularyProvider[] = [];

  for (const plugin of plugins) {
    const cfg = await getProviderConfig(plugin.id);
    // Built-in providers are always enabled; others require an enabled config row.
    const enabled = plugin.builtin ? true : cfg?.enabled === true;
    if (!enabled || !plugin.createRuntime) continue;
    const context = await createPluginContext(plugin.id);
    providers.push((await plugin.createRuntime(context)) as VocabularyProvider);
  }
  return providers;
}

export { builtinVocabularyProvider };
