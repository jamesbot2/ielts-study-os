import { describe, it, expect } from "vitest";
import { getOrderedLessons, getAdjacentLessons, allLessons } from "./curriculum";

describe("curriculum sequencing", () => {
  it("orders by category then order (not insertion order)", () => {
    const ordered = getOrderedLessons();
    const cats = ordered.map((l) => l.category);
    // The sequence must never place a later category before an earlier one.
    const firstFund = cats.indexOf("fundamentals");
    const firstListening = cats.indexOf("listening");
    const firstReading = cats.indexOf("reading");
    expect(firstFund).toBeLessThan(firstListening);
    expect(firstListening).toBeLessThan(firstReading);
  });

  it("filters by test type", () => {
    const academic = getOrderedLessons({ testType: "academic" });
    const general = getOrderedLessons({ testType: "general" });
    expect(academic.every((l) => l.testType !== "general")).toBe(true);
    expect(general.every((l) => l.testType !== "academic")).toBe(true);
  });

  it("adjacent lessons stay within the same test-type sequence", () => {
    const { next, previous } = getAdjacentLessons("fund-scoring", "academic");
    expect(previous?.id).toBe("fund-test-structure");
    expect(next?.id).toBe("fund-listening-scoring");
  });

  it("every lesson appears exactly once", () => {
    const ordered = getOrderedLessons();
    expect(ordered.length).toBe(allLessons.length);
    expect(new Set(ordered.map((l) => l.id)).size).toBe(allLessons.length);
  });
});
