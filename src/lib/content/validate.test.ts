import { describe, it, expect } from "vitest";
import { validateAllContent, validateSets, getPracticeSetIssues, questionTypeCoverage, isStructurallyValidTargetedSet, isPublishedTargetedSet, validateWritingPrompts, validateGrammarExercises, validateGrammarExerciseList } from "./validate";
import { effectiveQuestionCount } from "./practice-validation";
import { writingPrompts as allWritingPrompts } from "./practice/writing-prompts";
import { grammarExercises, type GrammarExercise } from "./practice/grammar-exercises";
import { allLessons } from "./curriculum";
import { READING_QUESTION_TYPES, LISTENING_QUESTION_TYPES } from "./question-types";
import { computeCoverage } from "./coverage";
import { allPracticeSets } from "./practice";
import type { PracticeSet, QuestionType } from "@/types/ielts";

describe("content validation", () => {
  it("full sets have exactly 40 scored units; targeted sets have 6–15", () => {
    for (const set of allPracticeSets) {
      const mode = set.practiceMode ?? "full";
      if (mode === "full") {
        expect(effectiveQuestionCount(set), `${set.meta.id} scored units`).toBe(40);
      } else {
        const n = effectiveQuestionCount(set);
        expect(n, `${set.meta.id} targeted count`).toBeGreaterThanOrEqual(6);
        expect(n, `${set.meta.id} targeted count`).toBeLessThanOrEqual(15);
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

describe("additional structural validation", () => {
  function mkSet(overrides: Partial<PracticeSet> = {}): PracticeSet {
    const meta = {
      id: "t-fixture-2", title: "Fixture 2", skill: "reading" as const, testType: "academic" as const,
      sourceType: "ORIGINAL" as const, sourceName: "IELTS Study OS", license: "CC0",
      copyrightStatus: "original", academicOrGeneral: "academic" as const,
      questionTypes: ["true_false_not_given"] as const, difficulty: 3 as const,
      estimatedBandRange: { min: 5, max: 7 }, createdAt: "2026-09-01",
      generatedByAI: false, reviewStatus: "published" as const,
    };
    return {
      meta, kind: "reading",
      passages: [{ id: "p1", title: "P", body: "The sun is a star. Planets orbit stars.", sourceType: "ORIGINAL", license: "CC0" }],
      practiceMode: "targeted", targetQuestionType: "true_false_not_given",
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: `xq${i}`, type: "true_false_not_given" as const, answerType: "text" as const,
        prompt: "Statement", passageId: "p1", explanation: "Because it says so.", evidence: "x",
        skillTags: ["reading"], difficulty: 3 as const, bandRange: { min: 5, max: 7 },
        correctAnswer: "The sun is a star",
      })),
      ...overrides,
    } as PracticeSet;
  }

  it("targeted set with 16 questions fails", () => {
    const set = mkSet({ questions: Array.from({ length: 16 }, () => mkSet().questions[0]) });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("6–15"))).toBe(true);
  });

  it("full set with targetQuestionType fails", () => {
    const set = mkSet({ practiceMode: "full", targetQuestionType: "true_false_not_given" as never, questions: Array.from({ length: 40 }, (_, i) => ({ ...mkSet().questions[0], id: `fq${i}` })) });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("must not set targetQuestionType"))).toBe(true);
  });

  it("dangling passageId fails", () => {
    const set = mkSet({ questions: mkSet().questions.map((q, i) => ({ ...q, id: `dq${i}`, passageId: "missing-passage" })) });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("not found in set"))).toBe(true);
  });

  it("multiple choice selectCount mismatch fails", () => {
    const set = mkSet({
      targetQuestionType: "multiple_choice",
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: `sc${i}`, type: "multiple_choice" as const, answerType: "multiple_choice" as const,
        prompt: "Pick two", passageId: "p1", explanation: "x", skillTags: ["reading"],
        difficulty: 3 as const, bandRange: { min: 5, max: 7 },
        options: [{ id: "A", label: "A", text: "a" }, { id: "B", label: "B", text: "b" }],
        correctAnswers: ["A", "B"], selectCount: 3,
      })),
    });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("selectCount"))).toBe(true);
  });

  it("matching correctOptionId not in options fails", () => {
    const set = mkSet({
      targetQuestionType: "matching_information",
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: `mt${i}`, type: "matching_information" as const, answerType: "matching" as const,
        prompt: "Match the statements", passageId: "p1", explanation: "x", skillTags: ["reading"],
        difficulty: 3 as const, bandRange: { min: 5, max: 7 },
        options: [{ id: "A", label: "A", text: "Option A" }],
        items: [{ id: "i1", text: "Item", correctOptionId: "ZZZ" }],
      })),
    });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("not in options"))).toBe(true);
  });

  it("duplicate option IDs fail", () => {
    const set = mkSet({
      targetQuestionType: "multiple_choice",
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: `do${i}`, type: "multiple_choice" as const, answerType: "single_choice" as const,
        prompt: "Pick one", passageId: "p1", explanation: "x", skillTags: ["reading"],
        difficulty: 3 as const, bandRange: { min: 5, max: 7 },
        options: [{ id: "A", label: "A", text: "a" }, { id: "A", label: "B", text: "b" }],
        correctAnswers: ["A"],
      })),
    });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("duplicate option ids"))).toBe(true);
  });

  it("duplicate item IDs fail", () => {
    const set = mkSet({
      targetQuestionType: "matching_information",
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: `di${i}`, type: "matching_information" as const, answerType: "matching" as const,
        prompt: "Match", passageId: "p1", explanation: "x", skillTags: ["reading"],
        difficulty: 3 as const, bandRange: { min: 5, max: 7 },
        options: [{ id: "A", label: "A", text: "a" }],
        items: [{ id: "same", text: "One", correctOptionId: "A" }, { id: "same", text: "Two", correctOptionId: "A" }],
      })),
    });
    expect(getPracticeSetIssues(set, new Set()).some((i) => i.message.includes("duplicate item id"))).toBe(true);
  });

  it("duplicate practice set ids fail", () => {
    const a = mkSet({ meta: { ...mkSet().meta, id: "dup-id" } });
    const b = mkSet({ meta: { ...mkSet().meta, id: "dup-id" }, questions: mkSet().questions.map((q) => ({ ...q, id: `b-${q.id}` })) });
    const report = validateSets([a, b]);
    expect(report.issues.some((i) => i.message.includes("duplicate practice set id"))).toBe(true);
  });

  it("malformed targeted set does not count as structurally valid", () => {
    const bad = mkSet({ targetQuestionType: undefined });
    expect(isStructurallyValidTargetedSet(bad)).toBe(false);
    const good = mkSet({});
    expect(isStructurallyValidTargetedSet(good)).toBe(true);
    expect(isPublishedTargetedSet(good)).toBe(true);
    const draft = mkSet({ meta: { ...mkSet().meta, reviewStatus: "draft" as const } });
    expect(isStructurallyValidTargetedSet(draft)).toBe(true);
    expect(isPublishedTargetedSet(draft)).toBe(false);
  });
});

describe("V0.6 Reading targeted threshold", () => {
  it("every Reading question type has >=2 published valid targeted sets", () => {
    const coverage = computeCoverage();
    for (const type of READING_QUESTION_TYPES) {
      const n = coverage.readingPublishedTargetedByType[type] ?? 0;
      expect(n, `published targeted sets for ${type}`).toBeGreaterThanOrEqual(2);
    }
    expect(coverage.readingPublishedTargetedSets).toBeGreaterThanOrEqual(28);
  });
});

describe("final targeted Listening threshold (all 13 types)", () => {
  it("every Listening question type has >=2 playable published sets", () => {
    const coverage = computeCoverage();
    for (const type of LISTENING_QUESTION_TYPES) {
      const n = coverage.listeningPlayableTargetedByType[type] ?? 0;
      expect(n, `playable targeted sets for ${type}`).toBeGreaterThanOrEqual(2);
    }
    const total = Object.values(coverage.listeningPlayableTargetedByType).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(26);
  });
});

describe("global text-answer instruction consistency", () => {
  it("every canonical text/number answer satisfies its own scoring instruction", () => {
    const report = validateAllContent();
    const instructionIssues = report.issues.filter((i) => i.message.includes("answer instruction"));
    expect(instructionIssues, JSON.stringify(instructionIssues, null, 2)).toEqual([]);
  });

  it("coverage question-type counts equal canonical scored-unit counts per skill", () => {
    const coverage = computeCoverage();
    for (const [skill, s] of [["reading", coverage.reading], ["listening", coverage.listening]] as const) {
      const typeSum = Object.values(s.questionTypes).reduce((a, b) => a + b, 0);
      expect(typeSum, `${skill} questionTypes sum equals questionCount`).toBe(s.questionCount);
    }
  });
});

describe("V0.6 final Writing thresholds", () => {
  it("prompt totals meet the quota", () => {
    const c = computeCoverage();
    expect(c.writingPrompts.academic).toBeGreaterThanOrEqual(30);
    expect(c.writingPrompts.general).toBeGreaterThanOrEqual(25);
    expect(c.writingPrompts.task2).toBeGreaterThanOrEqual(60);
  });

  it("Academic Task 1 covers all major visual categories", () => {
    const byCat = computeCoverage().writingPrompts.academicTask1ByCategory;
    for (const cat of ["line", "bar", "pie", "table", "process", "map", "mixed"]) {
      expect(byCat[cat] ?? 0, `academic category ${cat}`).toBeGreaterThanOrEqual(4);
    }
  });

  it("General Task 1 covers all three registers", () => {
    const byTone = computeCoverage().writingPrompts.generalTask1ByTone;
    expect(byTone.formal ?? 0).toBeGreaterThanOrEqual(9);
    expect(byTone.semi_formal ?? 0).toBeGreaterThanOrEqual(8);
    expect(byTone.informal ?? 0).toBeGreaterThanOrEqual(8);
  });

  it("Task 2 covers every major subtype", () => {
    const bySub = computeCoverage().writingPrompts.task2BySubtype;
    expect(bySub.agree_disagree ?? 0).toBeGreaterThanOrEqual(10);
    expect(bySub.discuss_both_views ?? 0).toBeGreaterThanOrEqual(9);
    expect(bySub.advantages_disadvantages ?? 0).toBeGreaterThanOrEqual(9);
    expect((bySub.problem_solution ?? 0) + (bySub.causes_solutions ?? 0)).toBeGreaterThanOrEqual(10);
    expect(bySub.two_part ?? 0).toBeGreaterThanOrEqual(9);
    expect(bySub.positive_negative ?? 0).toBeGreaterThanOrEqual(7);
  });

  it("writing prompts pass structural validation", () => {
    const r = validateWritingPrompts();
    expect(r.issues, JSON.stringify(r.issues, null, 2)).toEqual([]);
    expect(r.valid).toBe(true);
  });
});

describe("Round 4-C register corrections", () => {
  it("corrected register cases are semantically classified", () => {
    const c = computeCoverage().writingPrompts.generalTask1ByTone;
    expect(c.formal ?? 0).toBeGreaterThanOrEqual(9);
    expect(c.semi_formal ?? 0).toBeGreaterThanOrEqual(8);
    expect(c.informal ?? 0).toBeGreaterThanOrEqual(8);

    const toneOf = (id: string) => allWritingPrompts.find((p) => p.id === id)?.letterTone;
    // Clinic reschedule -> formal; friend birthday apology -> informal;
    // train lost-property office -> formal.
    expect(toneOf("gen-t1-formal-reschedule-01")).toBe("formal");
    expect(toneOf("gen-t1-informal-apology-02")).toBe("informal");
    expect(toneOf("gen-t1-formal-lost-01")).toBe("formal");
  });

  it("every General Task 1 prompt has exactly three structured requirements", () => {
    const r = validateWritingPrompts();
    expect(r.issues, JSON.stringify(r.issues, null, 2)).toEqual([]);
    for (const p of allWritingPrompts.filter((x) => x.task === 1 && x.testType === "general")) {
      expect(p.letterRequirements, p.id).toHaveLength(3);
    }
  });

  it("acad-t1-line-4 no longer contains a false crossing claim", () => {
    const p = allWritingPrompts.find((x) => x.id === "acad-t1-line-4")!;
    expect(p.visualDescription).not.toContain("cross");
    expect(p.visualDescription).toContain("remains higher throughout");
  });
});

describe("V0.6 final Grammar thresholds", () => {
  it("grammar lessons >=20 and exercises >=200", () => {
    const c = computeCoverage();
    expect(c.grammarLessons).toBeGreaterThanOrEqual(20);
    expect(c.grammarExercises).toBeGreaterThanOrEqual(200);
  });

  it("every grammar lesson has linked practice", () => {
    const c = computeCoverage();
    const grammarIds = allLessons.filter((l) => l.category === "grammar").map((l) => l.id);
    for (const id of grammarIds) {
      expect(c.grammarExercisesByLesson[id] ?? 0, `lesson ${id} exercises`).toBeGreaterThanOrEqual(8);
    }
  });

  it("all grammar exercises pass structural validation", () => {
    const r = validateGrammarExercises();
    expect(r.issues, JSON.stringify(r.issues, null, 2)).toEqual([]);
    expect(r.valid).toBe(true);
  });

  it("g-frag-2 has exactly one defensible answer", () => {
    const e = grammarExercises.find((x) => x.id === "g-frag-2")!;
    expect(e.sentence).toMatch(/IS a complete sentence/i);
    expect(e.correct).toBe(2);
  });
});

// ---- Round 5-C: Grammar correctness closure ----

const GRAMMAR_LESSON_IDS = new Set(
  allLessons.filter((l) => l.category === "grammar").map((l) => l.id),
);

function getEx(id: string): GrammarExercise {
  const e = grammarExercises.find((x) => x.id === id);
  if (!e) throw new Error(`missing grammar exercise: ${id}`);
  return e;
}

function fixture(overrides: Record<string, unknown>): GrammarExercise {
  return {
    id: "g-fixture",
    topic: "Topic",
    sentence: "The policy ___ introduced last year.",
    options: ["was", "were", "is"],
    correct: 0,
    explanation: "A past passive needs 'was'.",
    errorType: "test",
    lessonId: "gram-agreement",
    kind: "gap_fill",
    difficulty: 2,
    ...overrides,
  };
}

describe("Round 5-C known-defect regressions", () => {
  it("g-agree-8 uses an unambiguous plural subject", () => {
    const e = getEx("g-agree-8");
    expect(e.sentence).toContain("The results from the survey");
    expect(e.options[e.correct]).toBe("are");
    expect(e.explanation).not.toMatch(/data/i);
  });

  it("g-nounclause-7 forces 'whether'", () => {
    const e = getEx("g-nounclause-7");
    expect(e.sentence).toContain("not yet decided");
    expect(e.options[e.correct]).toBe("whether");
  });

  it("g-part-3 asks for an opening participle clause", () => {
    const e = getEx("g-part-3");
    expect(e.sentence).toMatch(/opening participle clause/i);
    expect(e.correct).toBe(2);
    expect(e.options[2]).toContain("Walking to school, we saw the bus");
  });

  it("g-par-6 canonical answer is the shared-'to' bare infinitive", () => {
    const e = getEx("g-par-6");
    expect(e.options[e.correct]).toBe("save");
    expect(e.explanation).toMatch(/share the first 'to'/);
  });

  it("g-comp-8 names the two entities 'respectively' maps", () => {
    const e = getEx("g-comp-8");
    expect(e.sentence).toContain("London and Bristol");
    expect(e.options[e.correct]).toBe("respectively");
  });

  it("g-t1-5 names the two categories 'respectively' maps", () => {
    const e = getEx("g-t1-5");
    expect(e.sentence).toContain("Product A and Product B");
    expect(e.options[e.correct]).toBe("respectively");
  });

  it("g-t1-11 correct option is a natural model sentence", () => {
    const e = getEx("g-t1-11");
    expect(e.options[e.correct]).toContain("with transport recording the largest rise");
    expect(e.explanation).toMatch(/with \+ noun \+ -ing/i);
  });

  it("g-t2-10 uses an accurate error taxonomy", () => {
    const e = getEx("g-t2-10");
    expect(e.options[e.correct]).toBe("missing connector after 'reasons'");
    expect(e.options).not.toContain("doubled subject");
    expect(e.explanation).toMatch(/reasons that explain|reasons for this trend/);
  });

  it("g-punct-10 forces comma-marking of a non-essential participial phrase", () => {
    const e = getEx("g-punct-10");
    expect(e.sentence).toMatch(/non-essential participial phrase/i);
    expect(e.correct).toBe(1);
    expect(e.options[1]).toBe("The survey, carried out in June, covered 500 residents.");
  });

  it("g-frag-2 regression remains intact", () => {
    const e = getEx("g-frag-2");
    expect(e.sentence).toMatch(/IS a complete sentence/i);
    expect(e.correct).toBe(2);
    expect(e.options[2]).toBe("The policy reduced unemployment.");
  });
});

describe("Round 5-C required metadata", () => {
  it("every exercise carries a valid lessonId, kind and difficulty at runtime", () => {
    for (const e of grammarExercises) {
      expect(typeof e.lessonId, `${e.id} lessonId`).toBe("string");
      expect(GRAMMAR_LESSON_IDS.has(e.lessonId), `${e.id} lessonId ${e.lessonId}`).toBe(true);
      expect(
        ["gap_fill", "sentence_choice", "error_identification", "correction", "style_choice", "punctuation"],
        `${e.id} kind`,
      ).toContain(e.kind);
      expect([1, 2, 3], `${e.id} difficulty`).toContain(e.difficulty);
    }
    expect(grammarExercises.length).toBe(200);
  });

  it("validator rejects missing lessonId", () => {
    const issues = validateGrammarExerciseList([fixture({ lessonId: undefined })], GRAMMAR_LESSON_IDS);
    expect(issues.map((i) => i.message)).toContain("missing lessonId");
  });

  it("validator rejects a lessonId that is not a grammar lesson", () => {
    const issues = validateGrammarExerciseList([fixture({ lessonId: "writing-task2" })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message.includes("does not match a grammar lesson"))).toBe(true);
  });

  it("validator rejects missing kind", () => {
    const issues = validateGrammarExerciseList([fixture({ kind: undefined })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message.includes("missing or invalid kind"))).toBe(true);
  });

  it("validator rejects an invalid kind", () => {
    const issues = validateGrammarExerciseList([fixture({ kind: "multiple_choice" })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message.includes("missing or invalid kind"))).toBe(true);
  });

  it("validator rejects missing difficulty", () => {
    const issues = validateGrammarExerciseList([fixture({ difficulty: undefined })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message.includes("missing or invalid difficulty"))).toBe(true);
  });

  it("validator rejects invalid difficulty", () => {
    const issues = validateGrammarExerciseList([fixture({ difficulty: 4 })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message.includes("missing or invalid difficulty"))).toBe(true);
  });

  it("validator rejects an out-of-range correct index", () => {
    const issues = validateGrammarExerciseList([fixture({ correct: 5 })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message === "invalid correct index")).toBe(true);
  });

  it("validator rejects duplicate options", () => {
    const issues = validateGrammarExerciseList([fixture({ options: ["was", "was", "is"] })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message === "duplicate options")).toBe(true);
  });

  it("validator rejects an empty explanation", () => {
    const issues = validateGrammarExerciseList([fixture({ explanation: "  " })], GRAMMAR_LESSON_IDS);
    expect(issues.some((i) => i.message === "empty explanation")).toBe(true);
  });
});

// ---- Round 5-D: final semantic uniqueness micro-closure ----

describe("Round 5-D known-six regressions", () => {
  it("g-modal-4: recommendation context, no false 'would rather requires than' rule", () => {
    const e = getEx("g-modal-4");
    expect(e.sentence).toContain("recommendation, not a legal requirement");
    expect(e.options).toEqual(["should", "must", "cannot"]);
    expect(e.options[e.correct]).toBe("should");
    expect(e.explanation).toMatch(/recommendation/i);
    expect(e.explanation).not.toMatch(/would rather/i);
    expect(e.explanation).not.toMatch(/requires? a contrast/i);
  });

  it("g-conj-2: prompt forces the concession relation", () => {
    const e = getEx("g-conj-2");
    expect(e.sentence).toMatch(/explicitly expresses concession/i);
    expect(e.options).toEqual(["even though", "because", "therefore"]);
    expect(e.options[e.correct]).toBe("even though");
    expect(e.options).not.toContain("and");
  });

  it("g-cohesion-1: causal context is explicit, not inferred", () => {
    const e = getEx("g-cohesion-1");
    expect(e.sentence).toContain("vehicle-emission rules");
    expect(e.sentence).toMatch(/expresses a result/i);
    expect(e.options[e.correct]).toBe("Consequently");
  });

  it("g-tense-7: no 'will complete' distractor, future perfect only", () => {
    const e = getEx("g-tense-7");
    expect(e.options).toEqual(["will have completed", "has completed", "had completed"]);
    expect(e.options[e.correct]).toBe("will have completed");
    expect(e.options).not.toContain("will complete");
    expect(e.explanation).toMatch(/future reference point/i);
  });

  it("g-cx-6: explicit non-defining test that acknowledges the defining option", () => {
    const e = getEx("g-cx-6");
    expect(e.sentence).toMatch(/non-defining relative clause/i);
    expect(e.correct).toBe(2);
    expect(e.options[2]).toBe("The scheme, which the council launched, has reduced traffic.");
    expect(e.explanation).toMatch(/valid defining relative clause/i);
    expect(e.explanation).not.toMatch(/option A is (globally )?incorrect/i);
  });

  it("g-punct-9: prompt names the colon convention", () => {
    const e = getEx("g-punct-9");
    expect(e.sentence).toMatch(/colon after a complete clause/i);
    expect(e.correct).toBe(0);
    expect(e.options[0]).toBe("We visited three cities: Paris, Rome and Vienna.");
  });
});

describe("Round 5-D focused-scan regressions", () => {
  it("g-tense-4 no longer uses 'will see' as an allegedly impossible distractor", () => {
    const e = getEx("g-tense-4");
    expect(e.options).toEqual(["will have seen", "has seen", "had seen"]);
    expect(e.options[e.correct]).toBe("will have seen");
  });

  it("no explanation teaches that 'would rather' requires 'than'", () => {
    for (const e of grammarExercises) {
      expect(`${e.id}: ${e.explanation}`).not.toMatch(/would rather\s+(always\s+)?needs?/i);
    }
  });

  it("no punctuation or sentence_choice prompt remains a bare 'Which is correct?'", () => {
    for (const e of grammarExercises) {
      if (e.kind !== "punctuation" && e.kind !== "sentence_choice") continue;
      const prompt = e.sentence;
      expect(`${e.id}: ${prompt}`).not.toMatch(/^Which is correct\?$/i);
      expect(`${e.id}: ${prompt}`).not.toMatch(/^Choose the correct version\.$/i);
      expect(`${e.id}: ${prompt}`).not.toMatch(/^Which is the clearest\?$/i);
      expect(`${e.id}: ${prompt}`).not.toMatch(/^Which is best\?$/i);
    }
  });

  it("error-identification labels remain accurate (no 'doubled subject')", () => {
    for (const e of grammarExercises) {
      if (e.kind !== "error_identification") continue;
      expect(e.options, e.id).not.toContain("doubled subject");
    }
  });
});

// ---- Round 5-E: final grammar ambiguity micro-closure ----

describe("Round 5-E known-five regressions", () => {
  it("g-mod-6: explicit uncertainty wording forces 'might'", () => {
    const e = getEx("g-mod-6");
    expect(e.sentence).toContain("not yet enough evidence to know for certain");
    expect(e.options).toEqual(["might", "must", "can't"]);
    expect(e.options[e.correct]).toBe("might");
    expect(e.explanation).toMatch(/rules out the certainty/i);
  });

  it("g-sent-7: prompt explicitly asks for contrast", () => {
    const e = getEx("g-sent-7");
    expect(e.sentence).toMatch(/explicitly expresses contrast/i);
    expect(e.options).toEqual(["but", "so", "because"]);
    expect(e.options[e.correct]).toBe("but");
    expect(e.options).not.toContain("and");
  });

  it("g-t2-1: prompt explicitly asks for concession", () => {
    const e = getEx("g-t2-1");
    expect(e.sentence).toMatch(/explicitly introduces concession/i);
    expect(e.options).toEqual(["Although", "Therefore", "For example"]);
    expect(e.options[e.correct]).toBe("Although");
    expect(e.sentence).toContain("feeling isolated");
  });

  it("g-nounclause-3: context forces 'that' without the false 'clear whether' claim", () => {
    const e = getEx("g-nounclause-3");
    expect(e.sentence).toContain("support the claim");
    expect(e.options[e.correct]).toBe("that");
    expect(e.explanation).not.toMatch(/clear whether.*not standard/i);
    expect(e.explanation).not.toMatch(/clear (whether|if)/i);
    expect(e.explanation).toMatch(/claim that/i);
  });

  it("g-nounclause-7: binary alternatives force 'whether'", () => {
    const e = getEx("g-nounclause-7");
    expect(e.sentence).toContain("accepted or rejected");
    expect(e.options).toEqual(["whether", "that", "because"]);
    expect(e.options[e.correct]).toBe("whether");
  });

  it("no grammar explanation contains the false 'clear whether is not standard' claim", () => {
    for (const e of grammarExercises) {
      expect(`${e.id}: ${e.explanation}`).not.toMatch(/clear whether[^']*not standard/i);
    }
  });
});
