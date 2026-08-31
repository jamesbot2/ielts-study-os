import { describe, it, expect } from "vitest";
import { generatePlan } from "./generate";
import type { StudyProfile } from "@/lib/storage/types";

const base: StudyProfile = {
  uiLanguage: "en",
  testType: "academic",
  currentBand: 5.5,
  targetBand: 7,
  targetListening: 7,
  targetReading: 7,
  targetWriting: 6.5,
  targetSpeaking: 7,
  testDate: null,
  weeklyHours: 8,
  weakestSkills: ["writing", "speaking"],
  takenBefore: false,
  onboardingComplete: true,
};

describe("study plan generator", () => {
  it("generates a non-empty plan", () => {
    const plan = generatePlan(base);
    expect(plan.length).toBeGreaterThan(0);
  });

  it("schedules more sessions for weakest skills", () => {
    const plan = generatePlan(base);
    const writing = plan.filter((t) => t.category === "writing").length;
    const reading = plan.filter((t) => t.category === "reading").length;
    expect(writing).toBeGreaterThan(reading);
  });

  it("includes vocabulary, review and mock tasks", () => {
    const plan = generatePlan(base);
    const categories = new Set(plan.map((t) => t.category));
    expect(categories.has("vocabulary")).toBe(true);
    expect(categories.has("review")).toBe(true);
    expect(categories.has("mock")).toBe(true);
  });

  it("schedules more weeks for a later test date", () => {
    const near = generatePlan({ ...base, testDate: addDays(30) });
    const far = generatePlan({ ...base, testDate: addDays(120) });
    expect(far.length).toBeGreaterThan(near.length);
  });

  it("produces valid ISO dates", () => {
    const plan = generatePlan(base);
    for (const t of plan) {
      expect(t.scheduledFor).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
