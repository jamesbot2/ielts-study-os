"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  PenLine,
  Timer,
  Sparkles,
  BookX,
  Library,
  BarChart3,
  CalendarClock,
  FolderOpen,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/learn", key: "learn", icon: GraduationCap },
  { href: "/practice", key: "practice", icon: PenLine },
  { href: "/mock", key: "mockExams", icon: Timer },
  { href: "/coach", key: "coach", icon: Sparkles },
  { href: "/mistakes", key: "mistakes", icon: BookX },
  { href: "/vocabulary", key: "vocabulary", icon: Library },
  { href: "/analytics", key: "analytics", icon: BarChart3 },
  { href: "/plan", key: "studyPlan", icon: CalendarClock },
  { href: "/library", key: "library", icon: FolderOpen },
  { href: "/settings", key: "settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-gray-100 hover:text-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {t(`nav.${item.key}`)}
          </Link>
        );
      })}
    </nav>
  );

  const langToggle = (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded px-2 py-1 text-xs font-medium ${
          locale === "en" ? "bg-accent text-white" : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`rounded px-2 py-1 text-xs font-medium ${
          locale === "zh" ? "bg-accent text-white" : "text-muted hover:text-foreground"
        }`}
      >
        中文
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <span className="text-base font-semibold tracking-tight">
            {t("common.appName")}
          </span>
        </div>
        {navContent}
        <div className="border-t border-border p-3">
          <div className="mb-2 flex justify-center">{langToggle}</div>
          <p className="px-1 text-[11px] leading-snug text-muted">
            {t("common.disclaimer")}
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="text-sm font-semibold">{t("common.appName")}</span>
        {langToggle}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface pt-14">
            {navContent}
          </aside>
        </div>
      )}

      <main className="flex-1 md:pl-60">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
