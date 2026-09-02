// Structural guardrails for the rebuilt Round 3B table/flow/short-answer content.

import { describe, it, expect } from "vitest";
import { targetedListeningSets } from "@/lib/content/practice/targeted/listening";
import { scoredUnitCountForSet } from "@/lib/scoring/units";

function set(id: string) {
  const s = targetedListeningSets.find((x) => x.meta.id === id);
  expect(s, `missing ${id}`).toBeTruthy();
  return s!;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

describe("table-completion structural guardrails", () => {
  for (const id of ["listening-targeted-table-completion-01", "listening-targeted-table-completion-02"]) {
    it(`${id}: 8 scored units, unique cells, no answer leakage`, () => {
      const s = set(id);
      expect(scoredUnitCountForSet(s)).toBe(8);
      expect(s.taskStimulus).toBeTruthy();

      const cells = s.questions.map((q) => (q as { tableCellId?: string }).tableCellId);
      expect(cells.every(Boolean)).toBe(true);
      expect(new Set(cells).size).toBe(8);

      // No canonical answer may already appear in the visible prefilled table.
      const stimulus = normalize(s.taskStimulus!);
      for (const q of s.questions) {
        const qa = q as { correctAnswer?: string };
        if (qa.correctAnswer) {
          expect(stimulus.includes(normalize(qa.correctAnswer)), `${q.id} answer "${qa.correctAnswer}" leaked`).toBe(false);
        }
      }
      // The table must contain blank placeholders for every scored unit.
      const blanks = (s.taskStimulus!.match(/_{3,}|________/g) ?? []).length;
      expect(blanks, `${id} visible blanks`).toBeGreaterThanOrEqual(8);
    });
  }
});

describe("flow-chart-completion structural guardrails", () => {
  for (const id of ["listening-targeted-flow-chart-completion-01", "listening-targeted-flow-chart-completion-02"]) {
    it(`${id}: 8 scored units, unique nodes, all part of the flow`, () => {
      const s = set(id);
      expect(scoredUnitCountForSet(s)).toBe(8);
      expect(s.taskStimulus).toBeTruthy();
      expect(s.taskStimulus).toContain("START");
      expect(s.taskStimulus).toContain("FINISH");

      const nodes = s.questions.map((q) => (q as { flowNodeId?: string }).flowNodeId);
      expect(nodes.every(Boolean)).toBe(true);
      expect(new Set(nodes).size).toBe(8);

      // Every question prompt mirrors a flow node with a blank placeholder.
      for (const q of s.questions) {
        expect((q as { prompt: string }).prompt).toContain("____");
      }
    });
  }
});

describe("short-answer boundary semantics", () => {
  it("q06 asks 'under what age' with answer 12, without implying 12 itself is free", () => {
    const s = set("listening-targeted-short-answer-02");
    const q = s.questions.find((x) => x.id === "listening-targeted-short-answer-02-q06")!;
    const qa = q as { prompt: string; correctAnswer: string };
    expect(qa.prompt).toMatch(/under what age/i);
    expect(qa.correctAnswer).toBe("12");
  });
});
