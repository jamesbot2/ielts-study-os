import type { StudyProfile } from "@/lib/storage/types";

export interface GeneratedTask {
  title: string;
  titleZh: string;
  category: string;
  scheduledFor: string | null;
  estimatedMinutes: number;
  href: string | null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Deterministic study-plan generator. Personalised by test type, target/current
// band gap, per-skill targets, weak skills, weekly hours and test date.

export function generatePlan(profile: StudyProfile): GeneratedTask[] {
  const tasks: GeneratedTask[] = [];
  const start = new Date();
  const targetDate = profile.testDate ? new Date(profile.testDate) : null;
  const weeks = targetDate
    ? Math.max(1, Math.ceil((targetDate.getTime() - start.getTime()) / (7 * 86_400_000)))
    : 8;

  // Weekly time budget in minutes.
  const weeklyMinutes = Math.max(60, (profile.weeklyHours || 6) * 60);

  const weakest = new Set(profile.weakestSkills ?? []);

  // Skill priority from the target/current gap plus explicit weakness.
  const current = (profile.currentBand ?? profile.targetBand ?? 5) as number;
  const target = profile.targetBand ?? 6.5;
  const overallGap = Math.max(0, target - current);

  function skillGap(skill: "listening" | "reading" | "writing" | "speaking"): number {
    const targetMap = {
      listening: profile.targetListening,
      reading: profile.targetReading,
      writing: profile.targetWriting,
      speaking: profile.targetSpeaking,
    } as const;
    const t = targetMap[skill] ?? target;
    return Math.max(0, t - current);
  }

  // Base sessions per skill per week, boosted by gap and explicit weakness.
  function weeklySessions(skill: "listening" | "reading" | "writing" | "speaking"): number {
    let n = skill === "writing" || skill === "speaking" ? 2 : 1;
    if (weakest.has(skill)) n += 1;
    if (skillGap(skill) >= 1) n += 1;
    if (skillGap(skill) >= 2) n += 1;
    return Math.min(n, 4);
  }

  const readingHref =
    profile.testType === "general" ? "/practice/reading/general-reading-1" : "/practice/reading/academic-reading-1";
  const writingHref = "/practice/writing";
  const fullMockHref = profile.testType === "general" ? "/mock/run/general_full" : "/mock/run/academic_full";

  const sessionMinutes: Record<string, number> = {
    listening: 35,
    reading: 45,
    writing: 45,
    speaking: 30,
    vocabulary: 15,
    review: 20,
    mock: 120,
  };

  for (let w = 0; w < weeks; w++) {
    const weekStart = addDays(start, w * 7);

    // Build candidate tasks with REAL, fixed durations and a priority.
    const candidates: { task: Omit<GeneratedTask, "scheduledFor">; priority: number; required: boolean }[] = [];

    for (const skill of ["listening", "reading", "writing", "speaking"] as const) {
      const n = weeklySessions(skill);
      for (let i = 0; i < n; i++) {
        const isWriting = skill === "writing";
        const isReading = skill === "reading";
        const priority =
          100 +
          skillGap(skill) * 20 +
          (weakest.has(skill) ? 40 : 0) +
          (i === 0 ? 10 : 0); // first session of a skill slightly higher
        candidates.push({
          task: {
            title: `${capitalize(skill)} practice ${i + 1}${isWriting ? (profile.testType === "general" ? " (letter)" : " (Task 1/2)") : ""}`,
            titleZh: `${skillZh(skill)}练习 ${i + 1}${isWriting ? (profile.testType === "general" ? "（书信）" : "（Task 1/2）") : ""}`,
            category: skill,
            estimatedMinutes: sessionMinutes[skill],
            href: isReading ? readingHref : isWriting ? writingHref : skill === "listening" ? "/practice/listening/listening-1" : "/practice/speaking",
          },
          priority,
          required: false,
        });
      }
    }

    candidates.push({
      task: {
        title: "Vocabulary review (spaced repetition)",
        titleZh: "词汇复习（间隔重复）",
        category: "vocabulary",
        estimatedMinutes: sessionMinutes.vocabulary,
        href: "/vocabulary",
      },
      priority: 90,
      required: true,
    });
    candidates.push({
      task: {
        title: "Review mistake book",
        titleZh: "复习错题本",
        category: "review",
        estimatedMinutes: sessionMinutes.review,
        href: "/mistakes",
      },
      priority: 85,
      required: true,
    });

    // Mock scheduling: more frequent in the final weeks if budget allows.
    const weeksUntilExam = weeks - w;
    const mockThisWeek = weeksUntilExam <= 6 && w % 2 === 1;
    if (mockThisWeek) {
      candidates.push({
        task: {
          title: `Full mock exam (${profile.testType === "general" ? "General Training" : "Academic"})`,
          titleZh: `全真模拟考试（${profile.testType === "general" ? "培训类" : "学术类"}）`,
          category: "mock",
          estimatedMinutes: sessionMinutes.mock,
          href: fullMockHref,
        },
        priority: weeksUntilExam <= 4 ? 95 : 70,
        required: weeksUntilExam <= 2,
      });
    }

    // Budget allocator: pick the highest-priority tasks that fit within the
    // weekly time budget. Task durations are NEVER shortened.
    candidates.sort((a, b) => b.priority - a.priority);
    let remaining = weeklyMinutes;
    const weekTasks: GeneratedTask[] = [];
    for (const c of candidates) {
      if (c.required || c.task.estimatedMinutes <= remaining) {
        weekTasks.push({ ...c.task, scheduledFor: iso(addDays(weekStart, weekTasks.length % 6)) });
        remaining -= c.task.estimatedMinutes;
      }
    }

    tasks.push(...weekTasks);
  }

  return tasks;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function skillZh(skill: string): string {
  return { listening: "听力", reading: "阅读", writing: "写作", speaking: "口语" }[skill] ?? skill;
}
