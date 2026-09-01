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

export interface PluginConfigField {
  key: string;
  label: string;
  type: "text" | "url" | "number" | "boolean" | "select";
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface PluginContext {
  pluginId: string;
  config: Record<string, unknown>;
  cache: PluginCache;
}

export interface PluginCache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface IeltsPluginRuntime {
  healthCheck(): Promise<PluginHealth>;
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
  configFields?: PluginConfigField[];
  // Constructs the configured runtime provider (used for real health checks).
  createRuntime?(context: PluginContext): Promise<IeltsPluginRuntime>;
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
