"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import type { Lesson } from "@/lib/content/curriculum";
import { getAdjacentLessons, categories } from "@/lib/content/curriculum";
import type { Callout } from "@/lib/content/types";
import { getLessonProgress, setLessonProgress } from "@/lib/storage/repository";
import { useStudyProfile } from "@/components/study-profile-provider";
import { getSource } from "@/lib/content/sources";

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const { t, locale } = useI18n();
  const { testType } = useStudyProfile();
  const [status, setStatus] = useState("not_started");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLessonProgress().then((p) => setStatus(p[lesson.id] ?? "not_started"));
  }, [lesson.id]);

  const l = (s: { en: string; zh: string }) => s[locale];
  const { previous, next } = getAdjacentLessons(lesson.id, testType);
  const categoryLabel = categories.find((c) => c.id === lesson.category);

  async function markComplete() {
    setSaving(true);
    const nextStatus = status === "completed" ? "in_progress" : "completed";
    await setLessonProgress(lesson.id, nextStatus as "not_started" | "in_progress" | "completed");
    setStatus(nextStatus);
    setSaving(false);
  }

  const sources = (lesson.sourceIds ?? [])
    .map(getSource)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <Link href="/learn" className="text-sm text-muted underline">
          ← {locale === "zh" ? "返回学习" : "Learn"}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          {lesson.difficulty != null && <span>{"●".repeat(lesson.difficulty)}</span>}
          {lesson.estimatedMinutes != null && <span>~{lesson.estimatedMinutes} {t("common.minutes")}</span>}
        </div>
      </div>

      <p className="text-xs uppercase tracking-wide text-muted">
        {locale === "zh" ? categoryLabel?.labelZh ?? lesson.category : categoryLabel?.labelEn ?? lesson.category}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{l(lesson.title)}</h1>
      <p className="mt-2 text-[15px] text-muted">{l(lesson.summary)}</p>

      {lesson.testType !== "both" && (
        <span className="badge mt-3">{lesson.testType === "academic" ? "Academic" : "General Training"}</span>
      )}

      <article className="prose-ielts mt-6">
        {lesson.sections.map((section, i) => (
          <section key={i}>
            <h2>{l(section.heading)}</h2>
            {section.paragraphs?.map((p, j) => <p key={j}>{l(p)}</p>)}
            {section.bullets && (
              <ul>
                {section.bullets.map((b, j) => <li key={j}>{l(b)}</li>)}
              </ul>
            )}
            {section.table && (
              <table>
                <thead>
                  <tr>
                    {section.table.headers.map((h, j) => <th key={j}>{l(h)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => <td key={k}>{l(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {section.callouts?.map((c, j) => <CalloutBlock key={j} callout={c} l={l} />)}
          </section>
        ))}
      </article>

      {sources.length > 0 && (
        <div className="mt-8 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">{locale === "zh" ? "来源与延伸阅读" : "Sources & further reading"}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {sources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  {s.provider} — {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        {previous ? (
          <Link href={`/learn/${previous.id}`} className="btn-secondary">
            ← {l(previous.title)}
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
            {status === "completed" ? (locale === "zh" ? "✓ 已完成" : "✓ Completed") : t("learn.markComplete")}
          </button>
          {next ? (
            <Link href={`/learn/${next.id}`} className="btn-primary">
              {locale === "zh" ? "下一课" : "Next"} →
            </Link>
          ) : (
            <Link href="/practice" className="btn-primary">
              {locale === "zh" ? "开始练习" : "Start practice"} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function CalloutBlock({ callout, l }: { callout: Callout; l: (s: { en: string; zh: string }) => string }) {
  const kindClass = {
    examTip: "callout-tip",
    commonMistake: "callout-mistake",
    example: "callout-example",
    warning: "callout-warn",
    officialNote: "callout",
    checklist: "callout",
    bandComparison: "callout",
    vocabBox: "callout-example",
    grammarBox: "callout-example",
  }[callout.kind];

  const defaultTitle: Record<string, { en: string; zh: string }> = {
    examTip: { en: "Exam tip", zh: "考试技巧" },
    commonMistake: { en: "Common mistake", zh: "常见错误" },
    example: { en: "Example", zh: "示例" },
    warning: { en: "Watch out", zh: "注意" },
    officialNote: { en: "Official note", zh: "官方说明" },
    checklist: { en: "Checklist", zh: "清单" },
    bandComparison: { en: "Band comparison", zh: "分数对比" },
    vocabBox: { en: "Useful vocabulary", zh: "实用词汇" },
    grammarBox: { en: "Grammar", zh: "语法" },
  };

  const title = callout.title ? l(callout.title) : l(defaultTitle[callout.kind] ?? { en: "", zh: "" });

  return (
    <div className={`callout ${kindClass}`}>
      {title && <p className="callout-title">{title}</p>}
      {callout.text?.map((t, i) => <p key={i} className="mb-1">{l(t)}</p>)}
      {callout.items && (
        <ul className="list-disc pl-5">
          {callout.items.map((it, i) => <li key={i}>{l(it)}</li>)}
        </ul>
      )}
    </div>
  );
}
