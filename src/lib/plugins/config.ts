// Config-field coercion + sanitization. Shared by ProviderManager (UI) and
// manager.setConfig (persistence) so secret fields can never reach IndexedDB.

import type { IeltsPlugin, PluginConfigField } from "./types";

// Convert a raw form value to the typed value the plugin expects.
export function coerceConfigFieldValue(field: PluginConfigField, raw: unknown): unknown {
  switch (field.type) {
    case "number": {
      if (raw === "" || raw === null || raw === undefined) return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    }
    case "boolean":
      return raw === true || raw === "true";
    default:
      return String(raw ?? "");
  }
}

// Drop secret fields and coerce values. The returned object is safe to persist.
export function sanitizeProviderConfig(plugin: IeltsPlugin | undefined, config: Record<string, unknown>): Record<string, unknown> {
  const fields = plugin?.configFields ?? [];
  const secret = new Set(fields.filter((f) => f.secret).map((f) => f.key));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (secret.has(key)) continue;
    const field = fields.find((f) => f.key === key);
    out[key] = field ? coerceConfigFieldValue(field, value) : value;
  }
  return out;
}
