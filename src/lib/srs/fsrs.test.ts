import { describe, it, expect } from "vitest";
import { emptyCard, scheduleReview, parseCard, type ReviewRating } from "./fsrs";

describe("FSRS scheduling", () => {
  it("new card + good moves to learning with reps 1", () => {
    const r = scheduleReview(emptyCard(), "good", new Date("2026-01-01T00:00:00Z"));
    expect(r.card.reps).toBe(1);
    expect(r.due.getTime()).toBeGreaterThan(new Date("2026-01-01T00:00:00Z").getTime());
  });

  it("again reschedules soon", () => {
    const r = scheduleReview(emptyCard(), "again", new Date("2026-01-01T00:00:00Z"));
    // due within 15 minutes
    expect(r.due.getTime() - new Date("2026-01-01T00:00:00Z").getTime()).toBeLessThan(15 * 60_000);
  });

  it("easy gives a longer interval than good", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const good = scheduleReview(emptyCard(), "good", now);
    const easy = scheduleReview(emptyCard(), "easy", now);
    expect(easy.due.getTime()).toBeGreaterThan(good.due.getTime());
  });

  it("schedules across multiple reviews", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    let card = emptyCard();
    for (const rating of ["good", "good", "easy"] as ReviewRating[]) {
      const r = scheduleReview(card, rating, now);
      card = r.card;
    }
    expect(card.reps).toBe(3);
  });

  it("parseCard round-trips a card", () => {
    const card = emptyCard();
    const parsed = parseCard(JSON.stringify(card));
    expect(parsed).not.toBeNull();
    expect(parsed!.reps).toBe(card.reps);
  });

  it("parseCard returns null for invalid input", () => {
    expect(parseCard(null)).toBeNull();
    expect(parseCard("not-json")).toBeNull();
  });
});
