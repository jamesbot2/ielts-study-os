import Link from "next/link";
import { listMockAttempts } from "@/lib/db/store";

export const dynamic = "force-dynamic";

const MOCKS = [
  { kind: "academic_full", title: "Academic Full Mock", desc: "Listening + Reading + Writing (Academic)", testType: "academic" },
  { kind: "general_full", title: "General Training Full Mock", desc: "Listening + Reading + Writing (General)", testType: "general" },
  { kind: "listening", title: "Listening Mock", desc: "4 parts · 40 questions", testType: "academic" },
  { kind: "reading", title: "Reading Mock (Academic)", desc: "3 passages · 40 questions · 60 min", testType: "academic" },
  { kind: "reading_general", title: "Reading Mock (General)", desc: "3 sections · 40 questions · 60 min", testType: "general" },
] as const;

export default function MockPage() {
  const attempts = listMockAttempts();

  return (
    <div className="container-page">
      <h1 className="text-2xl font-semibold tracking-tight">Mock Exams</h1>
      <p className="mt-1 text-sm text-muted">
        Realistic computer-delivered IELTS mock tests. Strict timing, no feedback
        until the end.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MOCKS.map((m) => (
          <Link key={m.kind} href={`/mock/run/${m.kind}`} className="card card-pad hover:border-accent">
            <p className="font-semibold">{m.title}</p>
            <p className="mt-1 text-sm text-muted">{m.desc}</p>
            <span className="btn-primary mt-3 inline-flex">Start mock</span>
          </Link>
        ))}
        <Link href="/practice/speaking" className="card card-pad hover:border-accent">
          <p className="font-semibold">Speaking Mock</p>
          <p className="mt-1 text-sm text-muted">Parts 1–3 practice and recording.</p>
          <span className="btn-primary mt-3 inline-flex">Start speaking</span>
        </Link>
      </div>

      {attempts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">Previous attempts</h2>
          <div className="card divide-y divide-border">
            {attempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{a.kind.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted">{new Date(a.started_at).toLocaleString()}</p>
                </div>
                <span className={`text-sm ${a.status === "completed" ? "font-semibold" : "text-muted"}`}>
                  {a.status === "completed" ? (a.overall_band != null ? `Band ${a.overall_band.toFixed(1)}` : "done") : "in progress"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
