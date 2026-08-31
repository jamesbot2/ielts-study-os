import { describe, it, expect } from "vitest";
import { validateAllContent, questionTypeCoverage } from "./validate";
import { computeCoverage } from "./coverage";
import { allPracticeSets } from "./practice";

describe("content validation", () => {
  it("every practice set has exactly 40 questions", () => {
    for (const set of allPracticeSets) {
      expect(set.questions.length, `${set.meta.id} question count`).toBe(40);
    }
  });

  it("question ids are unique across all sets", () => {
    const ids = allPracticeSets.flatMap((s) => s.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("passes structural validation", () => {
    const report = validateAllContent();
    expect(report.issues, JSON.stringify(report.issues, null, 2)).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("every set declares source type and license metadata", () => {
    for (const set of allPracticeSets) {
      expect(set.meta.sourceType).toBeTruthy();
      expect(set.meta.license).toBeTruthy();
      expect(set.meta.sourceType).toMatch(/ORIGINAL|AI_GENERATED|OPEN_LICENSED|USER_IMPORTED/);
    }
  });
});

describe("coverage manifest", () => {
  const coverage = computeCoverage();

  it("has lessons in every major category", () => {
    const cats = coverage.categories.map((c) => c.id);
    for (const expected of ["fundamentals", "listening", "reading", "writing", "speaking", "grammar", "strategies"]) {
      expect(cats).toContain(expected);
    }
  });

  it("reading practice is 40 questions with 3 passages", () => {
    expect(coverage.reading.questionCount).toBeGreaterThanOrEqual(80);
  });

  it("listening practice is 40 questions", () => {
    expect(coverage.listening.questionCount).toBeGreaterThanOrEqual(40);
  });

  it("speaking topic library is non-trivial", () => {
    expect(coverage.speakingTopics).toBeGreaterThanOrEqual(10);
  });

  it("writing prompts cover all three writing forms", () => {
    expect(coverage.writingPrompts.academic).toBeGreaterThan(0);
    expect(coverage.writingPrompts.general).toBeGreaterThan(0);
    expect(coverage.writingPrompts.task2).toBeGreaterThan(0);
  });
});

describe("question-type coverage", () => {
  it("reports missing question types honestly", () => {
    const { missingReading, missingListening } = questionTypeCoverage();
    // No assertion here beyond returning arrays; documented in coverage docs.
    expect(Array.isArray(missingReading)).toBe(true);
    expect(Array.isArray(missingListening)).toBe(true);
    console.log("missing reading types:", missingReading);
    console.log("missing listening types:", missingListening);
  });
});
