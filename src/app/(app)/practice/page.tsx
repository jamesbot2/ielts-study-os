"use client";

import Link from "next/link";
import { readingSets, listeningSets, targetedReadingSets } from "@/lib/content/practice";
import { effectiveQuestionCount } from "@/lib/content/practice-validation";
import { useStudyProfile } from "@/components/study-profile-provider";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui";

export default function PracticePage() {
  const { t, locale } = useI18n();
  const { testType, loading } = useStudyProfile();

  if (loading) return <div className="container-page"><Spinner /></div>;

  const reading = readingSets.filter((s) => s.meta.testType === testType || s.meta.testType === "both");

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">{t("practice.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("practice.subtitle")}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-1 text-base font-semibold">{t("practice.reading")}</h2>
          <p className="mb-3 text-xs text-muted">{testType === "academic" ? "Academic" : "General Training"}</p>
          <ul className="space-y-2">
            {reading.map((set) => (
              <li key={set.meta.id}>
                <Link
                  href={`/practice/reading/${set.meta.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
                >
                  <span className="font-medium">{set.meta.title}</span>
                  <span className="text-xs text-muted">{effectiveQuestionCount(set)} {t("mock.questions")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">{t("practice.listening")}</h2>
          <ul className="space-y-2">
            {listeningSets.map((set) => (
              <li key={set.meta.id}>
                <Link
                  href={`/practice/listening/${set.meta.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
                >
                  <span className="font-medium">{set.meta.title}</span>
                  <span className="text-xs text-muted">{effectiveQuestionCount(set)} {t("mock.questions")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {targetedReadingSets.length > 0 && (
        <section className="card card-pad mt-4">
          <h2 className="mb-1 text-base font-semibold">{locale === "zh" ? "阅读专项训练" : "Targeted Reading drills"}</h2>
          <p className="mb-3 text-xs text-muted">
            {locale === "zh" ? "按题型分类的短篇专项练习，每套 6–15 题。" : "Short question-type drills of 6–15 questions each."}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {targetedReadingSets.filter((s) => s.meta.testType === testType || s.meta.testType === "both").map((set) => (
              <li key={set.meta.id}>
                <Link
                  href={`/practice/reading/${set.meta.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
                >
                  <span className="font-medium">{set.meta.title}</span>
                  <span className="badge ml-2">{set.targetQuestionType?.replace(/_/g, " ")}</span>
                  <span className="text-xs text-muted">{effectiveQuestionCount(set)} {t("mock.questions")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">{t("practice.writing")}</h2>
          <p className="mb-3 text-sm text-muted">
            {testType === "academic"
              ? (locale === "zh" ? "学术类 Task 1 与 Task 2 作文" : "Academic Task 1 and Task 2 essays")
              : (locale === "zh" ? "培训类书信与 Task 2 作文" : "General Training letters and Task 2 essays")}
          </p>
          <Link href="/practice/writing" className="btn-primary">
            {locale === "zh" ? "开始写作" : "Start writing"}
          </Link>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">{t("practice.speaking")}</h2>
          <p className="mb-3 text-sm text-muted">
            {locale === "zh" ? "录音、手动输入逐字稿，并可在配置后获得 AI 反馈。" : "Record responses, enter transcripts manually, and get AI feedback when configured."}
          </p>
          <Link href="/practice/speaking" className="btn-primary">
            {locale === "zh" ? "开始口语" : "Start speaking"}
          </Link>
        </section>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">{t("practice.vocabulary")}</h2>
          <p className="mb-3 text-sm text-muted">
            {locale === "zh" ? "FSRS 间隔复习，内置词库与搭配库。" : "Spaced repetition with FSRS, a built-in library and collocations."}
          </p>
          <Link href="/vocabulary" className="btn-primary">
            {locale === "zh" ? "复习词汇" : "Review vocabulary"}
          </Link>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">{t("practice.grammar")}</h2>
          <p className="mb-3 text-sm text-muted">
            {locale === "zh" ? "面向雅思的语法课程与练习。" : "IELTS-oriented grammar lessons and practice."}
          </p>
          <div className="flex gap-3">
            <Link href="/practice/grammar" className="btn-primary">{locale === "zh" ? "语法练习" : "Grammar practice"}</Link>
            <Link href="/learn" className="btn-secondary">{locale === "zh" ? "课程" : "Lessons"}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
