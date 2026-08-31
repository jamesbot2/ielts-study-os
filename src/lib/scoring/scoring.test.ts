import { describe, it, expect } from "vitest";
import {
  normalizeAnswer,
  wordCount,
  exceedsWordLimit,
  checkTextAnswer,
  checkChoiceAnswer,
  checkMatchingAnswer,
  listeningBand,
  readingBand,
  overallBandFromSections,
  writingBandFromTasks,
  speakingBandFromCriteria,
  roundBand,
  bandDescription,
  rawScoreForBand,
  LISTENING_BAND_TABLE,
  ACADEMIC_READING_BAND_TABLE,
  GENERAL_READING_BAND_TABLE,
} from "./scoring";
import type { TextQuestion, ChoiceQuestion, MatchingQuestion } from "@/types/ielts";

describe("normalizeAnswer", () => {
  it("lowercases and trims", () => {
    expect(normalizeAnswer("  Answer ")).toBe("answer");
  });
  it("normalizes full-width and punctuation", () => {
    expect(normalizeAnswer("Ａnswer.")).toBe("answer");
    expect(normalizeAnswer("book's")).toBe("books");
  });
  it("collapses whitespace", () => {
    expect(normalizeAnswer("a   b\t c")).toBe("a b c");
  });
});

describe("wordCount / exceedsWordLimit", () => {
  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
    expect(wordCount("  ")).toBe(0);
  });
  it("enforces limits", () => {
    expect(exceedsWordLimit("one two three", 2)).toBe(true);
    expect(exceedsWordLimit("one two", 2)).toBe(false);
    expect(exceedsWordLimit("one two", undefined)).toBe(false);
  });
});

describe("checkTextAnswer", () => {
  const q: TextQuestion = {
    id: "q1",
    type: "short_answer",
    answerType: "text",
    prompt: "p",
    explanation: "e",
    skillTags: [],
    difficulty: 1,
    bandRange: { min: 4, max: 6 },
    correctAnswer: "15th Century",
    acceptableAnswers: ["fifteenth century"],
    wordLimit: 3,
  };
  it("accepts exact normalized answers", () => {
    expect(checkTextAnswer("15th century", q).correct).toBe(true);
    expect(checkTextAnswer("15TH CENTURY", q).correct).toBe(true);
    expect(checkTextAnswer("fifteenth century", q).correct).toBe(true);
  });
  it("rejects wrong answers", () => {
    expect(checkTextAnswer("16th century", q).correct).toBe(false);
    expect(checkTextAnswer("", q).correct).toBe(false);
    expect(checkTextAnswer(undefined, q).correct).toBe(false);
  });
  it("detects word limit exceedance", () => {
    expect(checkTextAnswer("one two three four", q).wordLimitExceeded).toBe(true);
  });
});

describe("checkChoiceAnswer", () => {
  const single: ChoiceQuestion = {
    id: "q1",
    type: "multiple_choice",
    answerType: "single_choice",
    prompt: "p",
    explanation: "e",
    skillTags: [],
    difficulty: 1,
    bandRange: { min: 4, max: 6 },
    options: [
      { id: "A", label: "A", text: "a" },
      { id: "B", label: "B", text: "b" },
    ],
    correctAnswers: ["A"],
  };
  const multi: ChoiceQuestion = {
    ...single,
    answerType: "multiple_choice",
    correctAnswers: ["A", "C"],
  };
  it("single choice", () => {
    expect(checkChoiceAnswer(["A"], single)).toBe(true);
    expect(checkChoiceAnswer(["B"], single)).toBe(false);
    expect(checkChoiceAnswer(["A", "B"], single)).toBe(false);
    expect(checkChoiceAnswer([], single)).toBe(false);
  });
  it("multiple choice requires exact set", () => {
    expect(checkChoiceAnswer(["A", "C"], multi)).toBe(true);
    expect(checkChoiceAnswer(["C", "A"], multi)).toBe(true);
    expect(checkChoiceAnswer(["A"], multi)).toBe(false);
    expect(checkChoiceAnswer(["A", "C", "B"], multi)).toBe(false);
  });
});

describe("checkMatchingAnswer", () => {
  const q: MatchingQuestion = {
    id: "q1",
    type: "matching",
    answerType: "matching",
    prompt: "p",
    explanation: "e",
    skillTags: [],
    difficulty: 1,
    bandRange: { min: 4, max: 6 },
    options: [],
    items: [
      { id: "i1", text: "a", correctOptionId: "H1" },
      { id: "i2", text: "b", correctOptionId: "H2" },
    ],
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
  it("academic reading boundaries", () => {
    expect(readingBand(39, "academic")).toBe(9);
    expect(readingBand(30, "academic")).toBe(7);
    expect(readingBand(23, "academic")).toBe(6);
  });
  it("general reading is stricter", () => {
    expect(readingBand(30, "general")).toBe(6);
    expect(readingBand(40, "general")).toBe(9);
    expect(readingBand(30, "academic")).toBe(7);
  });
});

describe("overall rounding", () => {
  it("rounds to nearest half band", () => {
    expect(roundBand(6.25)).toBe(6.5);
    expect(roundBand(6.75)).toBe(7);
    expect(roundBand(6.0)).toBe(6);
    expect(roundBand(6.1)).toBe(6);
    expect(roundBand(6.4)).toBe(6.5);
  });
  it("computes overall from sections", () => {
    // 6 + 6.5 + 6 + 6 = 24.5 / 4 = 6.125 -> 6.0
    expect(overallBandFromSections([6, 6.5, 6, 6])).toBe(6);
    // 6.5 * 4 = 6.5
    expect(overallBandFromSections([6.5, 6.5, 6.5, 6.5])).toBe(6.5);
    // 7 + 6.5 + 6.5 + 6 = 26 / 4 = 6.5
    expect(overallBandFromSections([7, 6.5, 6.5, 6])).toBe(6.5);
    // 7.75 -> 8.0
    expect(overallBandFromSections([8, 8, 7.5, 7.5])).toBe(8);
  });
  it("ignores missing sections", () => {
    expect(overallBandFromSections([6.5, null, null, null])).toBe(6.5);
  });
});

describe("writing aggregation", () => {
  it("weights task 2 double", () => {
    // (6 + 7*2)/3 = 6.666 -> 6.5
    expect(writingBandFromTasks(6, 7)).toBe(6.5);
    // (7 + 6*2)/3 = 6.333 -> 6.5
    expect(writingBandFromTasks(7, 6)).toBe(6.5);
    // (6 + 6*2)/3 = 6
    expect(writingBandFromTasks(6, 6)).toBe(6);
  });
});

describe("speaking aggregation", () => {
  it("averages four criteria", () => {
    // (6 + 6.5 + 6 + 6)/4 = 6.125 -> 6.0
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
