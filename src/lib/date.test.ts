import { describe, it, expect } from "vitest";
import { parseLocalDate, daysUntil, localDateOffset } from "./date";

describe("date helpers (local calendar, no UTC off-by-one)", () => {
  it("parses a date-only string as local midnight", () => {
    const d = parseLocalDate("2026-03-14");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(2); // March
    expect(d.getDate()).toBe(14);
    expect(d.getHours()).toBe(0);
  });

  it("daysUntil is 0 for today", () => {
    const today = localDateOffset(0);
    expect(daysUntil(today)).toBe(0);
  });

  it("daysUntil is 1 for tomorrow", () => {
    const tomorrow = localDateOffset(1);
    expect(daysUntil(tomorrow)).toBe(1);
  });

  it("daysUntil is negative for the past", () => {
    const yesterday = localDateOffset(-1);
    expect(daysUntil(yesterday)).toBe(-1);
  });

  it("daysUntil returns null for no date", () => {
    expect(daysUntil(null)).toBeNull();
  });
});
