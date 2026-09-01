// Deterministic next-activity recommendation. Pure function over the learner
// snapshot — no model call, no hallucination. The agent may use this same
// logic or its own grounded reasoning; this guarantees a sane fallback.

import type { LearnerContextSnapshot } from "./context";
import type { ActionProposal } from "./types";

export function recommendNextActivity(s: LearnerContextSnapshot): ActionProposal[] {
  const out: ActionProposal[] = [];

  // 1. Due vocabulary is always a cheap win.
  if (s.vocabulary.dueNow >= 10) {
    out.push({ type: "open_vocabulary", title: `Review ${s.vocabulary.dueNow} due vocabulary cards`, href: "/vocabulary", estimatedMinutes: 10 });
  }

  // 2. Weak skill with hard evidence.
  const weakest = Object.entries(s.practice.accuracyBySkill)
    .filter(([, v]) => v.attempts >= 2)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)[0];
  if (weakest) {
    const [skill, v] = weakest;
    if (v.accuracy < 0.7) {
      const skillPath = skill === "listening" ? "/practice/listening" : skill === "reading" ? "/practice/reading" : skill === "writing" ? "/practice/writing" : "/practice/speaking";
      out.push({
        type: "open_practice",
        title: `Targeted ${skill} practice (recent accuracy ${Math.round(v.accuracy * 100)}%)`,
        href: skillPath,
        estimatedMinutes: 20,
      });
    }
  }

  // 3. Repeated mistakes deserve a lesson revisit.
  if (s.mistakes.recurring.length > 0) {
    out.push({ type: "open_lesson", title: "Revisit a strategy lesson for your recurring mistakes", href: "/learn", estimatedMinutes: 15 });
  }

  // 4. Nothing learned yet → diagnostic.
  if (out.length === 0 && s.practice.recentAttempts.length === 0) {
    out.push({ type: "open_practice", title: "Start with a diagnostic practice set", href: "/practice", estimatedMinutes: 20 });
  }

  return out.slice(0, 3);
}
