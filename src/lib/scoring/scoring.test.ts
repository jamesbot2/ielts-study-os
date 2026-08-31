import { describe, it, expect } from "vitest";
import {
  normalizeAnswer,
  wordCount,
  checkInstruction,
  parseInstruction,
  exceedsWordLimit,
  checkTextAnswer,
  checkChoiceAnswer,
  checkMatchingAnswer,
  listeningBand,
  readingBand,
  roundBand,
  calculateOfficialOverallBand,
  calculateCompletedSkillsAverage,
  writingBandFromTasks,
  speakingBandFromCriteria,
  bandDescription,
  rawScoreForBand,
  LISTENING_BAND_TABLE,
  ACADEMIC_READING_BAND_TABLE,
  GENERAL_READING_BAND_TABLE,
} from "./scoring";
import type { TextQuestion, ChoiceQuestion, MatchingQuestion } from "@/types/ielts";

describe("normalizeAnswer (conservative)", () => {
  it("lowercases, trims and collapses whitespace", () => {
    expect(normalizeAnswer("  Answer ")).toBe("answer");
    expect(normalizeAnswer("a   b\t c")).toBe("a b c");
    expect(normalizeAnswer("Ａnswer")).toBe("answer"); // NFKC full-width
  });

  it("does NOT strip apostrophes / possessives", () => {
    expect(normalizeAnswer("book's")).toBe("book's");
    expect(normalizeAnswer("books")).toBe("books");
    expect(normalizeAnswer("book's") === normalizeAnswer("books")).toBe(false);
    expect(normalizeAnswer("St John's")).toBe("st john's");
  });

  it("does NOT strip hyphens", () => {
    expect(normalizeAnswer("mother-in-law")).toBe("mother-in-law");
    expect(normalizeAnswer("mother in law") === normalizeAnswer("mother-in-law")).toBe(false);
    expect(normalizeAnswer("twenty-one")).toBe("twenty-one");
  });

  it("preserves decimals, colons and symbols", () => {
    expect(normalizeAnswer("3.5")).toBe("3.5");
    expect(normalizeAnswer("10:30")).toBe("10:30");
    expect(normalizeAnswer("£50")).toBe("£50");
  });

  it("normalizes numeric thousands separators only for pure-number answers", () => {
    expect(normalizeAnswer("3,500")).toBe("3500");
    expect(normalizeAnswer("3 500")).toBe("3500");
    expect(normalizeAnswer("50,000")).toBe("50000");
    // but not when letters are present
    expect(normalizeAnswer("3,500 people")).toBe("3,500 people");
  });

  it("keeps dates and ordinal forms distinct", () => {
    expect(normalizeAnswer("21st")).toBe("21st");
    expect(normalizeAnswer("21st") === normalizeAnswer("21")).toBe(false);
  });

  it("handles multi-word proper nouns", () => {
    expect(normalizeAnswer("New Zealand")).toBe("new zealand");
  });
});

describe("wordCount / exceedsWordLimit", () => {
  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
    expect(wordCount("  ")).toBe(0);
    expect(wordCount("mother-in-law")).toBe(1);
  });
  it("enforces limits", () => {
    expect(exceedsWordLimit("one two three", 2)).toBe(true);
    expect(exceedsWordLimit("one two", 2)).toBe(false);
    expect(exceedsWordLimit("one two", undefined)).toBe(false);
  });
});

describe("checkInstruction", () => {
  it("ONE WORD ONLY", () => {
    const i = { maxWords: 1, allowNumber: false };
    expect(checkInstruction("table", i).compliant).toBe(true);
    expect(checkInstruction("a table", i).compliant).toBe(false);
    expect(checkInstruction("3", i).compliant).toBe(false); // number not allowed
  });
  it("NO MORE THAN TWO WORDS", () => {
    const i = { maxWords: 2, allowNumber: false };
    expect(checkInstruction("car park", i).compliant).toBe(true);
    expect(checkInstruction("a big car", i).compliant).toBe(false);
    expect(checkInstruction("15", i).compliant).toBe(false);
  });
  it("NO MORE THAN TWO WORDS AND/OR A NUMBER", () => {
    const i = { maxWords: 2, allowNumber: true };
    expect(checkInstruction("car park", i).compliant).toBe(true);
    expect(checkInstruction("15", i).compliant).toBe(true);
    expect(checkInstruction("15 minutes", i).compliant).toBe(true);
    expect(checkInstruction("about fifteen minutes", i).compliant).toBe(false); // 3 words
    expect(checkInstruction("3 5", i).compliant).toBe(false); // two numbers
  });
  it("ONE WORD AND/OR A NUMBER", () => {
    const i = { maxWords: 1, allowNumber: true };
    expect(checkInstruction("seven", i).compliant).toBe(true);
    expect(checkInstruction("7", i).compliant).toBe(true);
    expect(checkInstruction("seven o'clock", i).compliant).toBe(false);
  });
  it("parseInstruction", () => {
    expect(parseInstruction("NO MORE THAN TWO WORDS AND/OR A NUMBER")).toEqual({ maxWords: 2, allowNumber: true });
    expect(parseInstruction("ONE WORD ONLY")).toEqual({ maxWords: 1, allowNumber: false });
    expect(parseInstruction("ONE WORD AND/OR A NUMBER")).toEqual({ maxWords: 1, allowNumber: true });
    expect(parseInstruction("NO MORE THAN THREE WORDS AND/OR A NUMBER")).toEqual({ maxWords: 3, allowNumber: true });
  });
});

describe("checkTextAnswer", () => {
  const q: TextQuestion = {
    id: "q1", type: "short_answer", answerType: "text", prompt: "p",
    explanation: "e", skillTags: [], difficulty: 1, bandRange: { min: 4, max: 6 },
    correctAnswer: "15th Century", acceptableAnswers: ["fifteenth century"],
    wordLimit: 3, allowNumber: false,
  };
  it("accepts exact normalized answers", () => {
    expect(checkTextAnswer("15th century", q).correct).toBe(true);
    expect(checkTextAnswer("15TH CENTURY", q).correct).toBe(true);
    expect(checkTextAnswer("fifteenth century", q).correct).toBe(true);
  });
  it("rejects wrong and empty answers", () => {
    expect(checkTextAnswer("16th century", q).correct).toBe(false);
    expect(checkTextAnswer("", q).correct).toBe(false);
    expect(checkTextAnswer(undefined, q).correct).toBe(false);
  });
  it("rejects possessives that differ", () => {
    const q2: TextQuestion = { ...q, correctAnswer: "books", acceptableAnswers: [] };
    expect(checkTextAnswer("book's", q2).correct).toBe(false);
    expect(checkTextAnswer("books", q2).correct).toBe(true);
  });
  it("enforces word-limit instruction (violation => incorrect)", () => {
    const q3: TextQuestion = { ...q, correctAnswer: "the museum", wordLimit: 2, allowNumber: false };
    expect(checkTextAnswer("the museum", q3).correct).toBe(true);
    expect(checkTextAnswer("the national museum", q3).correct).toBe(false);
    expect(checkTextAnswer("the national museum", q3).instructionViolation).toBe(true);
  });
});

describe("checkChoiceAnswer", () => {
  const single: ChoiceQuestion = {
    id: "q1", type: "multiple_choice", answerType: "single_choice", prompt: "p",
    explanation: "e", skillTags: [], difficulty: 1, bandRange: { min: 4, max: 6 },
    options: [{ id: "A", label: "A", text: "a" }, { id: "B", label: "B", text: "b" }],
    correctAnswers: ["A"],
  };
  const multi: ChoiceQuestion = { ...single, answerType: "multiple_choice", correctAnswers: ["A", "C"] };
  it("single choice", () => {
    expect(checkChoiceAnswer(["A"], single)).toBe(true);
    expect(checkChoiceAnswer(["B"], single)).toBe(false);
    expect(checkChoiceAnswer(["A", "B"], single)).toBe(false);
    expect(checkChoiceAnswer([], single)).toBe(false);
  });
  it("multiple choice exact set", () => {
    expect(checkChoiceAnswer(["A", "C"], multi)).toBe(true);
    expect(checkChoiceAnswer(["C", "A"], multi)).toBe(true);
    expect(checkChoiceAnswer(["A"], multi)).toBe(false);
  });
});

describe("checkMatchingAnswer", () => {
  const q: MatchingQuestion = {
    id: "q1", type: "matching", answerType: "matching", prompt: "p",
    explanation: "e", skillTags: [], difficulty: 1, bandRange: { min: 4, max: 6 },
    options: [], items: [{ id: "i1", text: "a", correctOptionId: "H1" }, { id: "i2", text: "b", correctOptionId: "H2" }],
  };
  it("matches all items", () => {
    expect(checkMatchingAnswer({ i1: "H1", i2: "H2" }, q)).toBe(true);
    expect(checkMatchingAnswer({ i1: "H1", i2: "H1" }, q)).toBe(false);
    expect(checkMatchingAnswer({ i1: "H1" }, q)).toBe(false);
  });
});

describe("band tables", () => {
  it("listening boundaries", () => {
    expect(listeningBand(40)).toBe(9);
    expect(listeningBand(39)).toBe(9);
    expect(listeningBand(38)).toBe(8.5);
    expect(listeningBand(30)).toBe(7);
    expect(listeningBand(23)).toBe(6);
    expect(listeningBand(0)).toBe(0);
  });
  it("academic vs general reading", () => {
    expect(readingBand(30, "academic")).toBe(7);
    expect(readingBand(30, "general")).toBe(6);
    expect(readingBand(40, "general")).toBe(9);
    expect(readingBand(39, "general")).toBe(8.5);
  });
});

describe("roundBand (explicit quarter-band boundaries)", () => {
  it("rounds to nearest half band", () => {
    expect(roundBand(6.0)).toBe(6.0);
    expect(roundBand(6.125)).toBe(6.0);
    expect(roundBand(6.25)).toBe(6.5);
    expect(roundBand(6.375)).toBe(6.5);
    expect(roundBand(6.5)).toBe(6.5);
    expect(roundBand(6.625)).toBe(6.5);
    expect(roundBand(6.75)).toBe(7.0);
    expect(roundBand(6.875)).toBe(7.0);
  });
});

describe("official overall vs completed-skills average", () => {
  it("official overall requires all four skills", () => {
    expect(calculateOfficialOverallBand({ listening: 6.5, reading: 6.5, writing: 6, speaking: 6 })).toBe(6.5);
    expect(calculateOfficialOverallBand({ listening: 6.5, reading: 6.5, writing: null, speaking: 6 })).toBeNull();
    expect(calculateOfficialOverallBand({ listening: null, reading: null, writing: null, speaking: null })).toBeNull();
  });
  it("matches documented IELTS rounding examples", () => {
    // 6.5 + 6.5 + 6 + 6 = 25 / 4 = 6.25 -> 6.5
    expect(calculateOfficialOverallBand({ listening: 6.5, reading: 6.5, writing: 6, speaking: 6 })).toBe(6.5);
    // 6.5 + 6 + 6 + 6 = 24.5 / 4 = 6.125 -> 6.0
    expect(calculateOfficialOverallBand({ listening: 6.5, reading: 6, writing: 6, speaking: 6 })).toBe(6.0);
    // 7 + 7 + 7 + 7 = 7.0
    expect(calculateOfficialOverallBand({ listening: 7, reading: 7, writing: 7, speaking: 7 })).toBe(7.0);
  });
  it("completed-skills average works on partial data", () => {
    expect(calculateCompletedSkillsAverage({ listening: 6, reading: 7, writing: null, speaking: null })).toBe(6.5);
    expect(calculateCompletedSkillsAverage({ listening: null, reading: null, writing: null, speaking: null })).toBeNull();
  });
});

describe("writing aggregation", () => {
  it("weights task 2 double", () => {
    expect(writingBandFromTasks(6, 7)).toBe(6.5);
    expect(writingBandFromTasks(7, 6)).toBe(6.5);
    expect(writingBandFromTasks(6, 6)).toBe(6);
  });
});

describe("speaking aggregation", () => {
  it("averages four criteria", () => {
    expect(speakingBandFromCriteria([6, 6.5, 6, 6])).toBe(6);
    expect(speakingBandFromCriteria([7, 7, 7, 7])).toBe(7);
  });
});

describe("bandDescription", () => {
  it("maps bands", () => {
    expect(bandDescription(9)).toBe("Expert user");
    expect(bandDescription(6)).toBe("Competent user");
    expect(bandDescription(0)).toBe("Did not attempt the test");
  });
});

describe("rawScoreForBand", () => {
  it("listening band 7 requires 30", () => {
    expect(rawScoreForBand(LISTENING_BAND_TABLE, 7)).toBe(30);
  });
  it("academic reading band 7 requires 30", () => {
    expect(rawScoreForBand(ACADEMIC_READING_BAND_TABLE, 7)).toBe(30);
  });
  it("general reading band 7 requires 34", () => {
    expect(rawScoreForBand(GENERAL_READING_BAND_TABLE, 7)).toBe(34);
  });
});
