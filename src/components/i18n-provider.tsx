"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dictionaries,
  DEFAULT_LOCALE,
  isLocale,
  translate,
  type Dict,
  type Locale,
  type TranslateFn,
} from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  dict: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("locale="))
    ?.split("=")[1];
  if (isLocale(cookie)) return cookie;
  const stored = localStorage.getItem("locale");
  if (isLocale(stored)) return stored;
  return DEFAULT_LOCALE;
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const resolved = readInitialLocale();
    if (resolved !== initialLocale) setLocaleState(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("locale", locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const dict = useMemo(() => dictionaries[locale], [locale]);

  const t = useCallback<TranslateFn>(
    (key, params) => translate(dict, key, params),
    [dict],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, dict }),
    [locale, setLocale, t, dict],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
