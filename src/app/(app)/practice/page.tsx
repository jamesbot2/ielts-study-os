import Link from "next/link";
import { readingSets, listeningSets } from "@/lib/content/practice";
import { writingPrompts } from "@/lib/content/practice/writing-prompts";

export default function PracticePage() {
  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
      <p className="mt-1 text-sm text-muted">
        Choose a skill or question type to practice.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Reading</h2>
          <ul className="space-y-2">
            {readingSets.map((set) => (
              <li key={set.meta.id}>
                <Link
                  href={`/practice/reading/${set.meta.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
                >
                  <span className="font-medium">{set.meta.title}</span>
                  <span className="text-xs text-muted">
                    {set.questions.length} questions ·{" "}
                    {set.meta.testType === "academic" ? "Academic" : "General"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Listening</h2>
          <ul className="space-y-2">
            {listeningSets.map((set) => (
              <li key={set.meta.id}>
                <Link
                  href={`/practice/listening/${set.meta.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
                >
                  <span className="font-medium">{set.meta.title}</span>
                  <span className="text-xs text-muted">{set.questions.length} questions</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Writing</h2>
          <p className="mb-3 text-sm text-muted">
            {writingPrompts.length} prompts: Academic Task 1, General Training
            letters, and Task 2 essays.
          </p>
          <div className="flex gap-3">
            <Link href="/practice/writing" className="btn-primary">
              Start writing
            </Link>
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Speaking</h2>
          <p className="mb-3 text-sm text-muted">
            Record responses, enter transcripts manually, and get AI feedback when
            configured.
          </p>
          <div className="flex gap-3">
            <Link href="/practice/speaking" className="btn-primary">
              Start speaking
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Vocabulary</h2>
          <p className="mb-3 text-sm text-muted">
            Spaced repetition with FSRS. Review due cards or add your own words.
          </p>
          <Link href="/vocabulary" className="btn-primary">
            Review vocabulary
          </Link>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-base font-semibold">Grammar</h2>
          <p className="mb-3 text-sm text-muted">
            IELTS-oriented grammar lessons and practice exercises linked to your writing and speaking.
          </p>
          <div className="flex gap-3">
            <Link href="/practice/grammar" className="btn-primary">
              Grammar practice
            </Link>
            <Link href="/learn" className="btn-secondary">
              Lessons
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
