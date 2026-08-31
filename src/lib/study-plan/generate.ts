import type { StudyProfile } from "@/lib/storage/types";

export interface GeneratedTask {
  title: string;
  category: string;
  scheduledFor: string | null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Deterministic study-plan generator. Produces a balanced weekly plan that
// weighs weakest skills more heavily and schedules mock exams before the test.
export function generatePlan(profile: StudyProfile): GeneratedTask[] {
  const tasks: GeneratedTask[] = [];
  const start = new Date();
  const targetDate = profile.testDate ? new Date(profile.testDate) : null;
  const weeks = targetDate
    ? Math.max(1, Math.ceil((targetDate.getTime() - start.getTime()) / (7 * 86_400_000)))
    : 8;

  const weakest = new Set(profile.weakestSkills ?? []);
  const allSkills = ["listening", "reading", "writing", "speaking"] as const;

  for (let w = 0; w < weeks; w++) {
    const weekStart = addDays(start, w * 7);

    // Weigh weakest skills with extra sessions
    for (const skill of allSkills) {
      const extra = weakest.has(skill) ? 1 : 0;
      const sessions = skill === "writing" || skill === "speaking" ? 2 + extra : 1 + extra;
      for (let i = 0; i < sessions; i++) {
        tasks.push({
          title: `${capitalize(skill)} practice session ${i + 1}`,
          category: skill,
          scheduledFor: iso(addDays(weekStart, i * 2)),
        });
      }
    }

    tasks.push({
      title: "Vocabulary review (spaced repetition)",
      category: "vocabulary",
      scheduledFor: iso(addDays(weekStart, 1)),
    });
    tasks.push({
      title: "Review mistake book",
      category: "review",
      scheduledFor: iso(addDays(weekStart, 3)),
    });

    if (w % 2 === 1) {
      tasks.push({
        title: `Mock exam (${w === weeks - 2 ? "final" : "timed"} full test)`,
        category: "mock",
        scheduledFor: iso(addDays(weekStart, 5)),
      });
    }
  }

  return tasks;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
