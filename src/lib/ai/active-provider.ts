// Resolves the ACTIVE runtime LLM provider for a request.
//
// The browser sends the active provider's NON-secret metadata plus the
// SESSION-ONLY key (from provider-session.ts) to OUR FastAPI backend on every
// AI request. The backend validates and uses it for that request only.

import { getSettings } from "@/lib/storage/repository";
import { getProviderSessionKey } from "@/lib/ai/provider-session";

export interface ActiveProviderRequest {
  /** OpenAI-compatible Base URL, e.g. https://api.deepseek.com/v1 */
  baseUrl: string;
  /** Model name, e.g. deepseek-chat */
  model: string;
  /** Session-only API key (never persisted). May be undefined. */
  apiKey?: string;
  /** Human label (non-secret) for logs/UI. */
  name?: string;
}

/**
 * Returns the active provider payload for a request, or null when no provider
 * is active (the backend then falls back to its server-managed LLM).
 */
export async function getActiveProviderRequest(): Promise<ActiveProviderRequest | null> {
  const s = await getSettings();
  const activeId = s.ai.activeProviderId;
  if (!activeId) return null;
  const profile = (s.ai.llmProviders ?? []).find((p) => p.id === activeId);
  if (!profile) return null;
  const baseUrl = profile.baseUrl.trim();
  const model = profile.model.trim();
  if (!baseUrl || !model) return null;
  const apiKey = getProviderSessionKey(profile.id);
  return {
    baseUrl,
    model,
    apiKey: apiKey ?? undefined,
    name: profile.displayName,
  };
}
