// Provider presets are convenience defaults ONLY — provider-neutral logic never
// branches on them beyond pre-filling a new profile. Base URLs here are public
// endpoints (never secrets). Model fields stay fully editable.

import type { LlmProviderPreset } from "@/lib/storage/types";

export const PROVIDER_PRESETS: {
  id: LlmProviderPreset;
  label: string;
  baseUrl: string;
  placeholderModel: string;
}[] = [
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", placeholderModel: "gpt-4o-mini" },
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", placeholderModel: "deepseek-chat" },
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", placeholderModel: "openai/gpt-4o-mini" },
  { id: "custom", label: "Custom", baseUrl: "", placeholderModel: "" },
];

export function presetById(id: string): (typeof PROVIDER_PRESETS)[number] | undefined {
  return PROVIDER_PRESETS.find((p) => p.id === id);
}
