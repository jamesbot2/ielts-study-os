import { describe, it, expect } from "vitest";
import { coerceConfigFieldValue, sanitizeProviderConfig } from "./config";
import type { IeltsPlugin, PluginConfigField } from "./types";

const field = (partial: Partial<PluginConfigField> & Pick<PluginConfigField, "key" | "type">): PluginConfigField =>
  ({ label: partial.key, ...partial }) as PluginConfigField;

describe("coerceConfigFieldValue", () => {
  it("coerces text/url to string", () => {
    expect(coerceConfigFieldValue(field({ key: "a", type: "text" }), 123)).toBe("123");
    expect(coerceConfigFieldValue(field({ key: "a", type: "url" }), "https://x")).toBe("https://x");
  });

  it("coerces number", () => {
    expect(coerceConfigFieldValue(field({ key: "a", type: "number" }), "5")).toBe(5);
    expect(coerceConfigFieldValue(field({ key: "a", type: "number" }), "")).toBeUndefined();
    expect(coerceConfigFieldValue(field({ key: "a", type: "number" }), "abc")).toBeUndefined();
  });

  it("coerces boolean", () => {
    expect(coerceConfigFieldValue(field({ key: "a", type: "boolean" }), true)).toBe(true);
    expect(coerceConfigFieldValue(field({ key: "a", type: "boolean" }), "true")).toBe(true);
    expect(coerceConfigFieldValue(field({ key: "a", type: "boolean" }), false)).toBe(false);
  });

  it("coerces select to string", () => {
    expect(coerceConfigFieldValue(field({ key: "a", type: "select" }), "opt")).toBe("opt");
  });
});

describe("sanitizeProviderConfig", () => {
  const plugin = {
    id: "x",
    name: "X",
    configFields: [
      { key: "baseUrl", label: "URL", type: "url" },
      { key: "apiKey", label: "API Key", type: "text", secret: true },
      { key: "limit", label: "Limit", type: "number" },
      { key: "enabledFlag", label: "Flag", type: "boolean" },
    ],
  } as unknown as IeltsPlugin;

  it("drops secret fields", () => {
    const out = sanitizeProviderConfig(plugin, { baseUrl: "https://x", apiKey: "hush", limit: "3", enabledFlag: "true" });
    expect(out.apiKey).toBeUndefined();
    expect(out.baseUrl).toBe("https://x");
  });

  it("coerces typed values", () => {
    const out = sanitizeProviderConfig(plugin, { limit: "3", enabledFlag: "true" });
    expect(out.limit).toBe(3);
    expect(out.enabledFlag).toBe(true);
  });

  it("handles plugins without configFields", () => {
    expect(sanitizeProviderConfig(undefined, { a: "b" })).toEqual({ a: "b" });
  });
});
