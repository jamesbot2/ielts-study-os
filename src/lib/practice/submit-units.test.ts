import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/storage/db";
import { getQuestionAttempts, listMistakes } from "@/lib/storage/repository";
import { submitPractice } from "./submit";
import { matchingHeadingsSet01 } from "@/lib/content/practice/targeted/reading/matching-headings";
import type { Question } from "@/types/ielts";

beforeEach(async () => {
  await resetDb();
});

describe("scored-unit persistence", () => {
  it("persists a 6/7 matching block as 6 correct + 1 incorrect unit attempts", async () => {
    const set = matchingHeadingsSet01; // 7 matching_headings items, one top-level group
    const q = set.questions[0] as Extract<Question, { answerType: "heading_matching" | "matching" }>;
    const answers: Record<string, import("@/lib/storage/types").AnswerValue> = { [q.id]: {} };
    const itemAnswers = answers[q.id] as Record<string, string>;
    for (const item of q.items) itemAnswers[item.id] = item.correctOptionId;
    // Make the last item wrong.
    const last = q.items[q.items.length - 1];
    itemAnswers[last.id] = q.options.find((o) => o.id !== last.correctOptionId)!.id;

    const res = await submitPractice(set, "practice", answers, 300);
    expect(res.total).toBe(7);
    expect(res.rawScore).toBe(6);
    expect(res.band).toBeNull();

    const attempts = await getQuestionAttempts(res.attemptId);
    expect(attempts.length).toBe(7);
    expect(attempts.filter((a) => a.correct === 1).length).toBe(6);
    expect(attempts.filter((a) => a.correct === 0).length).toBe(1);
    // Composite deterministic ids, not group-level id.
    expect(attempts.some((a) => a.questionId === `${q.id}::${last.id}`)).toBe(true);

    // Exactly one mistake recorded, for the wrong item.
    const mistakes = await listMistakes();
    expect(mistakes.length).toBe(1);
    expect(mistakes[0].questionType).toBe("matching_headings");
  });
});
