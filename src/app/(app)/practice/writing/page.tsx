import Link from "next/link";
import { writingPrompts } from "@/lib/content/practice/writing-prompts";

export default function WritingPage() {
  const acadTask1 = writingPrompts.filter((p) => p.testType === "academic" && p.task === 1);
  const genTask1 = writingPrompts.filter((p) => p.testType === "general" && p.task === 1);
  const task2 = writingPrompts.filter((p) => p.task === 2);

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-1 text-sm text-muted">
        Task 1 (Academic/General) and Task 2 essays with timer, word count and AI feedback.
      </p>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">Academic Task 1</h2>
        <PromptList prompts={acadTask1} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">General Training Task 1 (letters)</h2>
        <PromptList prompts={genTask1} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">Task 2 (essays)</h2>
        <PromptList prompts={task2} />
      </section>
    </div>
  );
}

function PromptList({ prompts }: { prompts: typeof writingPrompts }) {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {prompts.map((p) => (
        <li key={p.id}>
          <Link
            href={`/practice/writing/${p.id}`}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:border-accent"
          >
            <span className="font-medium">{p.title}</span>
            <span className="text-xs text-muted">{p.visualType ? `${p.visualType} · ` : ""}{p.wordLimit} words</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
