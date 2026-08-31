import Link from "next/link";
import {
  getProfile,
  getDueVocabCards,
  listMistakes,
  listMockAttempts,
  practiceStats,
} from "@/lib/db/store";
import { categories, lessonCountByCategory } from "@/lib/content/curriculum";
import { BandBadge, StatCard } from "@/components/ui";

export const dynamic = "force-dynamic";

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(date);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
  return diff;
}

export default function DashboardPage() {
  const profile = getProfile();
  const due = getDueVocabCards();
  const mistakes = listMistakes();
  const mocks = listMockAttempts();
  const stats = practiceStats();
  const lessonCounts = lessonCountByCategory();

  const days = daysUntil(profile.testDate);

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            IELTS Study OS
          </h1>
          <p className="mt-1 text-sm text-muted">
            {profile.testType === "academic" ? "Academic" : "General Training"}
            {profile.targetBand ? ` · Target band ${profile.targetBand}` : ""}
          </p>
        </div>
        {!profile.onboardingComplete ? (
          <Link href="/onboarding" className="btn-primary">
            Set up my study profile
          </Link>
        ) : (
          <Link href="/settings" className="btn-secondary">
            Edit profile
          </Link>
        )}
      </div>

      {!profile.onboardingComplete && (
        <div className="card card-pad mb-6 border-blue-200 bg-blue-50">
          <p className="text-sm">
            Welcome! Complete a short setup to get a personalised study plan and
            targets. You can skip and change everything later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Target band"
          value={profile.targetBand ?? "—"}
          hint="overall"
        />
        <StatCard
          label="Current band"
          value={profile.currentBand ?? "—"}
          hint="estimated"
        />
        <StatCard
          label="Days to test"
          value={days == null ? "—" : Math.max(0, days)}
          hint={days != null && days < 0 ? "past test date" : profile.testDate ? "test day" : undefined}
        />
        <StatCard label="Weekly study" value={`${profile.weeklyHours}h`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">Learning progress</h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm">{c.labelEn}</span>
                <span className="text-sm text-muted">{lessonCounts[c.id]} lessons</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="mb-3 text-sm font-semibold">Your study</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Practice attempts</dt>
              <dd>{stats.totalAttempts}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Vocabulary due</dt>
              <dd>{due.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Mistakes recorded</dt>
              <dd>{mistakes.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Mock exams taken</dt>
              <dd>{mocks.filter((m) => m.status === "completed").length}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Recommended next</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/learn" className="card card-pad hover:border-accent">
            <p className="font-medium">1 · Learn the basics</p>
            <p className="mt-1 text-sm text-muted">
              Understand structure and scoring first.
            </p>
          </Link>
          <Link href="/practice/reading/academic-reading-1" className="card card-pad hover:border-accent">
            <p className="font-medium">2 · Reading practice</p>
            <p className="mt-1 text-sm text-muted">40-question Academic set.</p>
          </Link>
          <Link href="/practice/listening/listening-1" className="card card-pad hover:border-accent">
            <p className="font-medium">3 · Listening practice</p>
            <p className="mt-1 text-sm text-muted">Four parts with scripts.</p>
          </Link>
          <Link href="/mock" className="card card-pad hover:border-accent">
            <p className="font-medium">4 · Take a mock exam</p>
            <p className="mt-1 text-sm text-muted">Computer-style, timed.</p>
          </Link>
        </div>
      </section>

      {mocks.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Recent mock results</h2>
          <div className="card divide-y divide-border">
            {mocks.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{m.kind.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted">
                    {new Date(m.started_at).toLocaleDateString()}
                  </p>
                </div>
                {m.status === "completed" ? (
                  <BandBadge band={m.overall_band} />
                ) : (
                  <span className="text-xs text-muted">in progress</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
