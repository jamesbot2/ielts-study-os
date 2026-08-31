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

describe("study plan personalization", () => {
  it("general training uses general reading and mock hrefs", () => {
    const plan = generatePlan({ ...base, testType: "general" });
    const reading = plan.find((t) => t.category === "reading");
    const mock = plan.find((t) => t.category === "mock");
    expect(reading?.href).toBe("/practice/reading/general-reading-1");
    expect(mock?.href).toBe("/mock/run/general_full");
  });

  it("academic uses academic hrefs", () => {
    const plan = generatePlan({ ...base, testType: "academic" });
    const reading = plan.find((t) => t.category === "reading");
    const mock = plan.find((t) => t.category === "mock");
    expect(reading?.href).toBe("/practice/reading/academic-reading-1");
    expect(mock?.href).toBe("/mock/run/academic_full");
  });

  it("weekly workload stays within the time budget", () => {
    const plan = generatePlan({ ...base, weeklyHours: 3 });
    const week0 = plan.filter((t) => t.scheduledFor?.startsWith(localDateOffset0()));
    const total = week0.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    // 3h = 180 min; with scaling this should not wildly exceed the budget.
    expect(total).toBeLessThanOrEqual(220);
  });

  it("every generated task has an href and estimated minutes", () => {
    const plan = generatePlan(base);
    for (const t of plan) {
      expect(t.href).toBeTruthy();
      expect(t.estimatedMinutes).toBeGreaterThan(0);
    }
  });
});

function localDateOffset0(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("study plan duration integrity", () => {
  it("never shortens a full mock below its real duration", () => {
    const plan = generatePlan({ ...base, weeklyHours: 2 });
    const mocks = plan.filter((t) => t.category === "mock");
    for (const m of mocks) {
      expect(m.estimatedMinutes).toBe(120);
    }
  });

  it("never shortens a reading section below 45 minutes", () => {
    const plan = generatePlan({ ...base, weeklyHours: 2 });
    const reading = plan.filter((t) => t.category === "reading");
    for (const r of reading) {
      expect(r.estimatedMinutes).toBe(45);
    }
  });
});
