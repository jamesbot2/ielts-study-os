// SESSION-ONLY LLM provider API keys.
//
// Keys entered in Settings live in this in-memory Map for the current browser
// session only. They are NEVER written to IndexedDB, localStorage, backup
// exports, or any other persistent store. After a reload the user re-enters the
// key (the UI says so explicitly). This is a deliberate BYOK security choice
// for an application with no accounts and no authenticated backend.

const sessionKeys = new Map<string, string>();

export function setProviderSessionKey(providerId: string, apiKey: string): void {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    sessionKeys.delete(providerId);
    return;
  }
  sessionKeys.set(providerId, trimmed);
}

export function getProviderSessionKey(providerId: string): string | undefined {
  return sessionKeys.get(providerId);
}

export function clearProviderSessionKey(providerId: string): void {
  sessionKeys.delete(providerId);
}

export function hasProviderSessionKey(providerId: string): boolean {
  return sessionKeys.has(providerId);
}

/** Forget every session key (used on sign-out-like resets). */
export function clearAllProviderSessionKeys(): void {
  sessionKeys.clear();
}
