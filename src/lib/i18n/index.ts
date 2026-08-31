import { en, type Dict } from "./en";
import { zh } from "./zh";

export type { Dict } from "./en";
export type Locale = "en" | "zh";

export const dictionaries: Record<Locale, Dict> = { en, zh };
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh";
}

// T helper: resolve a dotted key path from the active dictionary.
export function translate(
  dict: Dict,
  key: string,
  params?: Record<string, string | number>,
): string {
  let value: unknown = dict;
  for (const part of key.split(".")) {
    if (value && typeof value === "object") {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;
