"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, getLessonsByCategory } from "@/lib/content/curriculum";
import { getLessonProgress } from "@/lib/storage/repository";
import { Spinner } from "@/components/ui";

export default function LearnPage() {
  const [progress, setProgress] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    getLessonProgress().then(setProgress);
  }, []);

  if (!progress) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
      <p className="mt-1 text-sm text-muted">Master IELTS from zero to exam day.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const lessons = getLessonsByCategory(cat.id);
          if (lessons.length === 0) return null;
          const done = lessons.filter((l) => progress[l.id] === "completed").length;
          return (
            <section key={cat.id} className="card card-pad">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">{cat.labelEn}</h2>
                <span className="text-xs text-muted">{done}/{lessons.length} completed</span>
              </div>
              <ul className="space-y-1">
                {lessons.map((lesson) => {
                  const status = progress[lesson.id];
                  return (
                    <li key={lesson.id}>
                      <Link href={`/learn/${lesson.id}`} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50">
                        <span className="font-medium">{lesson.title.en}</span>
                        <span className="text-xs text-muted">
                          {status === "completed" ? "✓" : `${lesson.estimatedMinutes ?? 3} min`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
