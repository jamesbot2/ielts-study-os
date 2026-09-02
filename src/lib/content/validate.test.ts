import { describe, it, expect } from "vitest";
import { validateAllContent, getPracticeSetIssues, questionTypeCoverage } from "./validate";
import { computeCoverage } from "./coverage";
import { allPracticeSets } from "./practice";
import type { PracticeSet, QuestionType } from "@/types/ielts";

describe("content validation", () => {
  it("full sets have exactly 40 questions; targeted sets have 6–15", () => {
    for (const set of allPracticeSets) {
      const mode = set.practiceMode ?? "full";
      if (mode === "full") {
        expect(set.questions.length, `${set.meta.id} question count`).toBe(40);
      } else {
        expect(set.questions.length, `${set.meta.id} targeted count`).toBeGreaterThanOrEqual(6);
        expect(set.questions.length, `${set.meta.id} targeted count`).toBeLessThanOrEqual(15);
      }
    }
  });

  it("question ids are unique across all sets", () => {
    const ids = allPracticeSets.flatMap((s) => s.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("practice set ids are unique", () => {
    const ids = allPracticeSets.map((s) => s.meta.id);
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
    expect(Array.isArray(missingReading)).toBe(true);
    expect(Array.isArray(missingListening)).toBe(true);
  });
});

describe("getPracticeSetIssues (pure)", () => {
  function baseSet(overrides: Partial<PracticeSet> = {}): PracticeSet {
    const meta = {
      id: "t-fixture", title: "Fixture", skill: "reading" as const, testType: "academic" as const,
      sourceType: "ORIGINAL" as const, sourceName: "IELTS Study OS", license: "CC0",
      copyrightStatus: "original", academicOrGeneral: "academic" as const,
      questionTypes: ["true_false_not_given"] as const, difficulty: 3 as const,
      estimatedBandRange: { min: 5, max: 7 }, createdAt: "2026-09-01",
      generatedByAI: false, reviewStatus: "published" as const,
    };
    return {
      meta,
      kind: "reading",
      passages: [{ id: "p1", title: "Passage", body: "The sun is a star. It provides light and heat. Planets orbit stars.", sourceType: "ORIGINAL", license: "CC0" }],
      practiceMode: "targeted",
      targetQuestionType: "true_false_not_given",
      questions: [],
      ...overrides,
    } as PracticeSet;
  }

  function tfng(id: string, correctAnswer: string, type: QuestionType = "true_false_not_given") {
    return {
      id, type, answerType: "text" as const, prompt: `Statement ${id}`, passageId: "p1",
      explanation: "Because the passage says so.", evidence: "line 1", skillTags: ["reading"],
      difficulty: 3 as const, bandRange: { min: 5, max: 7 }, correctAnswer,
    };
  }

  it("valid targeted set passes", () => {
    const set = baseSet({ questions: Array.from({ length: 8 }, (_, i) => tfng(`q${i}`, "The sun is a star")) });
    const issues = getPracticeSetIssues(set, new Set());
    expect(issues).toEqual([]);
  });

  it("targeted set without targetQuestionType fails", () => {
    const set = baseSet({ targetQuestionType: undefined, questions: Array.from({ length: 8 }, (_, i) => tfng(`q${i}`, "The sun is a star")) });
    const issues = getPracticeSetIssues(set, new Set());
    expect(issues.some((i) => i.message.includes("missing targetQuestionType"))).toBe(true);
  });

  it("targeted set with 5 questions fails", () => {
    const set = baseSet({ questions: Array.from({ length: 5 }, (_, i) => tfng(`q${i}`, "The sun is a star")) });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("6–15"))).toBe(true);
  });

  it("targeted set with mismatched question type fails", () => {
    const set = baseSet({ questions: Array.from({ length: 8 }, (_, i) => tfng(`q${i}`, "The sun is a star", "multiple_choice")) });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("not matching"))).toBe(true);
  });

  it("choice question with dangling correctAnswer id fails", () => {
    const set = baseSet({
      targetQuestionType: "multiple_choice",
      questions: [
        {
          id: "mc1", type: "multiple_choice" as const, answerType: "single_choice", prompt: "Pick one", passageId: "p1",
          explanation: "x", skillTags: ["reading"], difficulty: 3 as const, bandRange: { min: 5, max: 7 } as const,
          options: [{ id: "A", label: "A", text: "a" }], correctAnswers: ["ZZZ"],
        },
        ...Array.from({ length: 7 }, (_, i) => ({
          id: `mc${i + 2}`, type: "multiple_choice" as const, answerType: "single_choice" as const, prompt: "Pick one", passageId: "p1",
          explanation: "x", skillTags: ["reading"], difficulty: 3 as const, bandRange: { min: 5, max: 7 } as const,
          options: [{ id: "A", label: "A", text: "a" }], correctAnswers: ["A"],
        })),
      ],
    });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("not in options"))).toBe(true);
  });
});
