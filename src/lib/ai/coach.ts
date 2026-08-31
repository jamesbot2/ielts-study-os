import "server-only";
import { getProfile, listMistakes, practiceStats } from "@/lib/db/store";

// Builds a compact, bounded context for the AI coach. Never sends the user's
// entire history; only the most relevant recent signals.
export interface CoachContext {
  targetBand: number | null;
  testType: string;
  currentBand: number | null;
  testDate: string | null;
  recentMistakes: { skill: string; questionType: string | null; question: string | null }[];
  weakSkills: string[];
}

export function buildCoachContext(): CoachContext {
  const profile = getProfile();
  const mistakes = listMistakes().slice(0, 12).map((m) => ({
    skill: m.skill,
    questionType: m.question_type,
    question: m.question ? m.question.slice(0, 200) : null,
  }));
  const stats = practiceStats();
  const weakSkills = Object.entries(stats.bySkill)
    .filter(([, v]) => v.attempts >= 2 && v.avgAccuracy < 0.6)
    .map(([skill]) => skill);

  return {
    targetBand: profile.targetBand,
    testType: profile.testType,
    currentBand: profile.currentBand,
    testDate: profile.testDate,
    recentMistakes: mistakes,
    weakSkills,
  };
}

export function coachSystemPrompt(ctx: CoachContext): string {
  const parts: string[] = [
    "You are a patient, expert IELTS coach. You help the learner understand questions, strategies, vocabulary, grammar, and their own mistakes.",
    "You are NOT an official examiner; never claim to issue official scores.",
  ];
  parts.push(
    `Learner context: test type = ${ctx.testType}, target band = ${ctx.targetBand ?? "unknown"}, current estimated band = ${ctx.currentBand ?? "unknown"}.`,
  );
  if (ctx.testDate) parts.push(`Test date = ${ctx.testDate}.`);
  if (ctx.weakSkills.length) parts.push(`Weakest skills = ${ctx.weakSkills.join(", ")}.`);
  if (ctx.recentMistakes.length) {
    const mistakeSummary = ctx.recentMistakes
      .map((m) => `${m.skill}${m.questionType ? ` (${m.questionType})` : ""}: ${m.question ?? ""}`)
      .slice(0, 6)
      .join(" | ");
    parts.push(`Recent mistakes (for reference): ${mistakeSummary}`);
  }
  parts.push(
    "Answer in the learner's preferred language when the learner writes in Chinese; otherwise answer in English. Be concise and specific.",
  );
  return parts.join("\n");
}
