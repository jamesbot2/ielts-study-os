// Plugin / provider architecture core types.

export type PluginKind =
  | "vocabulary"
  | "practice"
  | "speaking"
  | "speech"
  | "resource";

export type PluginCapability =
  | "VOCABULARY_BOOKS"
  | "VOCABULARY_LOOKUP"
  | "VOCABULARY_SYNC"
  | "PRACTICE_LIST_SETS"
  | "PRACTICE_GET_SET"
  | "SPEAKING_PROMPTS"
  | "SPEAKING_EVALUATE"
  | "SPEECH_TO_TEXT"
  | "TEXT_TO_SPEECH"
  | "PRONUNCIATION"
  | "EMBEDDED_TOOL"
  | "EXTERNAL_LINK";

export interface PluginSource {
  homepage?: string;
  repository?: string;
  provider?: string;
  license?: string;
  attribution?: string;
}

export interface IeltsPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  kind: PluginKind;
  source: PluginSource;
  capabilities: PluginCapability[];
  builtin?: boolean;
  initialize?(): Promise<void>;
  healthCheck?(): Promise<PluginHealth>;
}

export type PluginHealthStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "not_configured";

export interface PluginHealth {
  status: PluginHealthStatus;
  message?: string;
  checkedAt: string;
}

export type PluginStatus = "disabled" | "enabled" | "configured" | "connected" | "error";

export interface PluginContext {
  config: Record<string, unknown>;
  cache: PluginCache;
}

export interface PluginCache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
