"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  configureAiClient,
  DisabledAiClient,
  RemoteAiProxyClient,
  isAiAvailable,
  subscribeAiClient,
} from "@/lib/ai/client";
import { getSettings, saveSettings } from "@/lib/storage/repository";
import type { UserSettings } from "@/lib/storage/types";

interface AiContextValue {
  settings: UserSettings | null;
  available: boolean;
  saveAi: (patch: Partial<UserSettings["ai"]>) => Promise<void>;
  testProxy: (url: string) => Promise<{ ok: boolean; message: string }>;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [available, setAvailable] = useState(false);

  // Bootstrap: load settings once and configure the AI client.
  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      applyConfig(s);
    });
    const unsub = subscribeAiClient(() => setAvailable(isAiAvailable()));
    return unsub;
  }, []);

  function applyConfig(s: UserSettings) {
    const url = (s.ai.proxyUrl ?? "").trim();
    configureAiClient(url ? new RemoteAiProxyClient(url) : new DisabledAiClient());
    setAvailable(url.length > 0);
  }

  const saveAi = async (patch: Partial<UserSettings["ai"]>) => {
    const current = await getSettings();
    const next = { ...current, ai: { ...current.ai, ...patch } };
    await saveSettings({ ai: next.ai });
    setSettings(next);
    applyConfig(next);
  };

  const testProxy = async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return { ok: false, message: "No URL provided" };
    try {
      const res = await fetch(`${trimmed.replace(/\/$/, "")}/api/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "ping" }] }),
        signal: AbortSignal.timeout(15000),
      });
      return { ok: res.ok, message: res.ok ? "OK — proxy responded" : `HTTP ${res.status}` };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  };

  const value = useMemo(
    () => ({ settings, available, saveAi, testProxy }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, available],
  );

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

export function useAi(): AiContextValue {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used within AiProvider");
  return ctx;
}
