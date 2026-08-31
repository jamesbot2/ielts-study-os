"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin`} aria-hidden />;
}

export function BandBadge({ band }: { band: number | null | undefined }) {
  if (band == null || !Number.isFinite(band)) return null;
  const color =
    band >= 7 ? "bg-green-100 text-green-800" : band >= 6 ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold ${color}`}
    >
      {band.toFixed(1)}
    </span>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="card card-pad flex min-h-[160px] items-center justify-center text-center">
      <p className="muted">{text}</p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="card card-pad">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
