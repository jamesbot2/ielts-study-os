"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import type { Lesson } from "@/lib/content/curriculum";
import { apiPost } from "@/lib/client/api";

export function LessonViewer({
  lesson,
  next,
  previous,
  initialStatus,
}: {
  lesson: Lesson;
  next: { id: string; title: string } | null;
  previous: { id: string; title: string } | null;
  initialStatus: string;
}) {
  const { locale } = useI18n();
  const [lang, setLang] = useState<"en" | "zh">(locale);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  const l = (s: { en: string; zh: string }) => s[lang];

  async function markComplete() {
    setSaving(true);
    const nextStatus = status === "completed" ? "in_progress" : "completed";
    await apiPost("/api/lessons", { lessonId: lesson.id, status: nextStatus });
    setStatus(nextStatus);
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <Link href="/learn" className="text-sm text-muted underline">
          ← Learn
        </Link>
        <div className="flex items-center gap-2 rounded-md border border-border p-0.5">
          {(["en", "zh"] as const).map((lg) => (
            <button
              key={lg}
              type="button"
              onClick={() => setLang(lg)}
              className={`rounded px-2 py-1 text-xs font-medium ${
                lang === lg ? "bg-accent text-white" : "text-muted"
              }`}
            >
              {lg === "en" ? "EN" : "中文"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs uppercase tracking-wide text-muted">{lesson.category}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{l(lesson.title)}</h1>
      <p className="mt-2 text-sm text-muted">{l(lesson.summary)}</p>

      {lesson.testType !== "both" && (
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-muted">
          {lesson.testType === "academic" ? "Academic" : "General Training"}
        </span>
      )}

      <article className="mt-6 space-y-6">
        {lesson.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold">{l(section.heading)}</h2>
            {section.paragraphs && (
              <div className="mt-2 space-y-3">
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-foreground">
                    {l(p)}
                  </p>
                ))}
              </div>
            )}
            {section.bullets && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
                {section.bullets.map((b, j) => (
                  <li key={j}>{l(b)}</li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="mt-3 overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-gray-50">
                      {section.table.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2 text-left font-semibold">
                          {l(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, j) => (
                      <tr key={j} className="border-b border-border last:border-0">
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2 align-top">
                            {l(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </article>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        {previous ? (
          <Link href={`/learn/${previous.id}`} className="btn-secondary">
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markComplete}
            disabled={saving}
            className={status === "completed" ? "btn-secondary" : "btn-primary"}
          >
            {status === "completed" ? "✓ Completed" : "Mark as complete"}
          </button>
          {next ? (
            <Link href={`/learn/${next.id}`} className="btn-primary">
              Next →
            </Link>
          ) : (
            <Link href="/practice" className="btn-primary">
              Start practice →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
