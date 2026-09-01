// Vocabulary provider runtime: which providers are available/active.

import { getProviderConfig } from "@/lib/storage/repository";
import { registerPlugin } from "../registry";
import type { IeltsPlugin } from "../types";
import { builtinVocabularyProvider } from "./builtin-provider";
import { BaicizhanVocabularyProvider } from "./baicizhan-provider";
import type { VocabularyProvider } from "./types";

// Plugin metadata (registered once).
const builtinPlugin: IeltsPlugin = {
  id: builtinVocabularyProvider.id,
  name: builtinVocabularyProvider.name,
  description: builtinVocabularyProvider.description,
  version: builtinVocabularyProvider.version,
  kind: "vocabulary",
  source: builtinVocabularyProvider.source,
  capabilities: [...builtinVocabularyProvider.capabilities],
  builtin: true,
};

const baicizhanPlugin: IeltsPlugin = {
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
};

export function registerVocabularyPlugins(): void {
  try {
    registerPlugin(builtinPlugin);
  } catch {
    // already registered
  }
  try {
    registerPlugin(baicizhanPlugin);
  } catch {
    // already registered
  }
}

export async function getVocabularyProviders(): Promise<VocabularyProvider[]> {
  registerVocabularyPlugins();
  const providers: VocabularyProvider[] = [builtinVocabularyProvider];

  const cfg = await getProviderConfig("baicizhan");
  if (cfg?.enabled) {
    const baseUrl = (cfg.config.baseUrl as string | undefined)?.trim() || undefined;
    providers.push(new BaicizhanVocabularyProvider({ baseUrl }));
  }
  return providers;
}

export async function getVocabularyProvider(id: string): Promise<VocabularyProvider | null> {
  const providers = await getVocabularyProviders();
  return providers.find((p) => p.id === id) ?? null;
}
