import { describe, it, expect } from "vitest";
import { scoreQuestionUnits, scorePracticeUnits, scoredUnitId } from "./scoring";
import type { Question } from "@/types/ielts";

function matchingQuestion(items: { id: string; correctOptionId: string }[]): Question {
  return {
    id: "m1",
    type: "matching_headings",
    answerType: "heading_matching",
    prompt: "Choose the correct heading for each paragraph.",
    explanation: "Each paragraph has a main idea.",
    skillTags: ["reading"],
    difficulty: 3,
    bandRange: { min: 5, max: 7.5 },
    options: [{ id: "i", label: "i", text: "Heading i" }, { id: "ii", label: "ii", text: "Heading ii" }, { id: "iii", label: "iii", text: "Heading iii" }],
    items: items.map((x) => ({ ...x, text: x.id })),
  };
}

function textQuestion(): Question {
  return {
    id: "t1",
    type: "sentence_completion",
    answerType: "text",
    prompt: "Complete the sentence.",
    correctAnswer: "tin",
    wordLimit: 1,
    explanation: "x",
    skillTags: ["reading"],
    difficulty: 2,
    bandRange: { min: 5, max: 7.5 },
  };
}

function choiceQuestion(): Question {
  return {
    id: "c1",
    type: "multiple_choice",
    answerType: "single_choice",
    prompt: "Choose one.",
    explanation: "x",
    skillTags: ["reading"],
    difficulty: 2,
    bandRange: { min: 5, max: 7.5 },
    options: [{ id: "A", label: "A", text: "a" }, { id: "B", label: "B", text: "b" }],
    correctAnswers: ["A"],
  };
}

describe("canonical scored units", () => {
  it("scores matching 7/7 as 7 correct units", () => {
    const q = matchingQuestion(["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id, correctOptionId: "i" })));
    const units = scoreQuestionUnits(q, { a: "i", b: "i", c: "i", d: "i", e: "i", f: "i", g: "i" });
    expect(units.length).toBe(7);
    expect(units.filter((u) => u.correct).length).toBe(7);
  });

  it("scores matching 6/7 as 6 correct + 1 incorrect", () => {
    const q = matchingQuestion(["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id, correctOptionId: "i" })));
    const units = scoreQuestionUnits(q, { a: "i", b: "i", c: "i", d: "i", e: "i", f: "i", g: "ii" });
    expect(units.filter((u) => u.correct).length).toBe(6);
    expect(units.find((u) => u.id === "m1::g")?.correct).toBe(false);
  });

  it("scores matching 0/7 as 0 correct", () => {
    const q = matchingQuestion(["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id, correctOptionId: "i" })));
    const units = scoreQuestionUnits(q, {});
    expect(units.filter((u) => u.correct).length).toBe(0);
  });

  it("text question produces one unit", () => {
    const units = scoreQuestionUnits(textQuestion(), "tin");
    expect(units.length).toBe(1);
    expect(units[0].correct).toBe(true);
    expect(units[0].id).toBe("t1");
  });

  it("single choice produces one unit", () => {
    const units = scoreQuestionUnits(choiceQuestion(), ["A"]);
    expect(units.length).toBe(1);
    expect(units[0].correct).toBe(true);
  });

  it("mixed practice totals all units", () => {
    const mq = matchingQuestion(["a", "b", "c"].map((id) => ({ id, correctOptionId: "i" })));
    const questions = [textQuestion(), choiceQuestion(), mq];
    const answers = { t1: "tin", c1: ["A"], m1: { a: "i", b: "ii", c: "i" } };
    const units = scorePracticeUnits(questions, answers);
    expect(units.length).toBe(5);
    expect(units.filter((u) => u.correct).length).toBe(4);
  });

  it("composite ids are deterministic", () => {
    expect(scoredUnitId("q", "item")).toBe("q::item");
    expect(scoredUnitId("q")).toBe("q");
  });
});

function multipleAnswerQuestion(selectCount: number, correct: string[]): Question {
  return {
    id: "ma1",
    type: "multiple_answer",
    answerType: "multiple_choice",
    prompt: "Choose the correct options.",
    explanation: "x",
    skillTags: ["listening"],
    difficulty: 3,
    bandRange: { min: 5, max: 7.5 },
    options: ["A", "B", "C", "D", "E"].map((id) => ({ id, label: id, text: `Option ${id}` })),
    correctAnswers: correct,
    selectCount,
  };
}

describe("multiple-answer scored units", () => {
  it("2/2 correct", () => {
    const units = scoreQuestionUnits(multipleAnswerQuestion(2, ["B", "D"]), ["B", "D"]);
    expect(units.length).toBe(2);
    expect(units.filter((u) => u.correct).length).toBe(2);
  });

  it("1/2 correct (partial credit)", () => {
    const units = scoreQuestionUnits(multipleAnswerQuestion(2, ["B", "D"]), ["B", "C"]);
    expect(units.length).toBe(2);
    expect(units.filter((u) => u.correct).length).toBe(1);
    expect(units.find((u) => u.id === "ma1::choice:B")?.correct).toBe(true);
    expect(units.find((u) => u.id === "ma1::choice:D")?.correct).toBe(false);
  });

  it("0/2 correct", () => {
    const units = scoreQuestionUnits(multipleAnswerQuestion(2, ["B", "D"]), ["A", "C"]);
    expect(units.filter((u) => u.correct).length).toBe(0);
  });

  it("3/3 and 2/3", () => {
    const q = multipleAnswerQuestion(3, ["A", "C", "E"]);
    expect(scoreQuestionUnits(q, ["A", "C", "E"]).filter((u) => u.correct).length).toBe(3);
    expect(scoreQuestionUnits(q, ["A", "C", "D"]).filter((u) => u.correct).length).toBe(2);
  });
});

describe("multiple-answer effective count + validation", () => {
  it("effectiveQuestionCount uses selectCount", async () => {
    const { effectiveQuestionCount } = await import("@/lib/content/practice-validation");
    const set = {
      questions: [multipleAnswerQuestion(3, ["A", "C", "E"])],
    } as never;
    expect(effectiveQuestionCount(set)).toBe(3);
  });

  it("validation rejects missing/duplicate/mismatched selectCount", async () => {
    const { getPracticeSetIssues } = await import("@/lib/content/practice-validation");
    const base = {
      meta: { id: "x", sourceType: "ORIGINAL", license: "CC0" },
      kind: "listening",
      passages: [],
      practiceMode: "targeted",
      targetQuestionType: "multiple_answer",
      questions: [],
    } as unknown as import("@/types/ielts").PracticeSet;
    const missing = getPracticeSetIssues({ ...base, questions: [{ ...multipleAnswerQuestion(0, ["B"]), selectCount: undefined }] } as unknown as import("@/types/ielts").PracticeSet, new Set());
    expect(missing.some((i) => i.message.includes("selectCount"))).toBe(true);
    const dup = getPracticeSetIssues({ ...base, questions: [{ ...multipleAnswerQuestion(2, ["B", "B"]), correctAnswers: ["B", "B"] }] } as unknown as import("@/types/ielts").PracticeSet, new Set());
    expect(dup.some((i) => i.message.includes("duplicate correctAnswers"))).toBe(true);
    const mismatch = getPracticeSetIssues({ ...base, questions: [{ ...multipleAnswerQuestion(3, ["B", "D"]) }] } as unknown as import("@/types/ielts").PracticeSet, new Set());
    expect(mismatch.some((i) => i.message.includes("selectCount 3"))).toBe(true);
    const wrongAnswerType = getPracticeSetIssues({ ...base, questions: [{ ...multipleAnswerQuestion(2, ["B", "D"]), answerType: "single_choice" }] } as unknown as import("@/types/ielts").PracticeSet, new Set());
    expect(wrongAnswerType.some((i) => i.message.includes("multiple_answer question must use"))).toBe(true);
  });
});
