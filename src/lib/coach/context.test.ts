import { describe, it, expect, beforeEach } from "vitest";
import { resetDb, getDb } from "@/lib/storage/db";
import {
  createPracticeAttempt,
  completePracticeAttempt,
  createVocabCard,
  saveWritingSubmission,
  createSpeakingSession,
  createSpeakingTurn,
  updateSpeakingTurn,
  createStudyTask,
} from "@/lib/storage/repository";
import { buildLearnerContextSnapshot, estimateSnapshotSize, CONTEXT_BOUNDS } from "./context";

beforeEach(async () => {
  await resetDb();
});

async function seedAttempt(correct: number, total: number, questionIds: string[] = [], band: number | null = 5) {
  const id = await createPracticeAttempt("academic-reading-1", "reading", "academic", "practice", {});
  const qas = Array.from({ length: total }, (_, i) => ({
    questionId: questionIds[i] ?? `q-${i}`,
    userAnswer: i < correct ? "x" : null,
    correct: i < correct ? 1 : 0,
    timeSpentSeconds: 10,
    flagged: 0,
  }));
  await completePracticeAttempt(id, correct, band ?? 0, {}, qas, total * 10);
  if (band == null) await getDb().practiceAttempts.update(id, { band: null });
}

describe("practice accuracy semantics", () => {
  it("computes accuracy as correct/total (25/40 = 0.625)", async () => {
    await seedAttempt(25, 40);
    const snap = await buildLearnerContextSnapshot();
    const reading = snap.practice.accuracyBySkill.reading;
    expect(reading).toBeDefined();
    expect(reading.accuracy).toBeCloseTo(0.625, 3);
    expect(reading.attempts).toBe(1);
  });

  it("aggregates as total correct / total questions (1/1 + 0/40 = 1/41)", async () => {
    await seedAttempt(1, 1);
    await seedAttempt(0, 40);
    const snap = await buildLearnerContextSnapshot();
    expect(snap.practice.accuracyBySkill.reading.accuracy).toBeCloseTo(1 / 41, 4);
  });

  it("missing band does not drag avgBand toward zero", async () => {
    // First attempt completes without a band; second has band 6.
    await seedAttempt(2, 5, [], null);
    await seedAttempt(4, 5, [], 6);
    const snap = await buildLearnerContextSnapshot();
    expect(snap.practice.accuracyBySkill.reading.avgBand).toBeCloseTo(6, 3);
  });

  it("targeted drills contribute accuracy but never pollute avgBand", async () => {
    // Full attempt with real band 6.
    await seedAttempt(30, 40, [], 6);
    // Two targeted (band-less) attempts.
    await seedAttempt(2, 8, [], null);
    await seedAttempt(8, 8, [], null);
    const snap = await buildLearnerContextSnapshot();
    const reading = snap.practice.accuracyBySkill.reading;
    expect(reading.avgBand).toBeCloseTo(6, 3);
    // Accuracy includes all question attempts: (30+2+8) / (40+8+8) = 40/56.
    expect(reading.accuracy).toBeCloseTo(40 / 56, 4);
  });
});

describe("weak question types use real types, not question ids", () => {
  it("ranks matching_headings as weak from real question ids", async () => {
    // Real ids from the academic reading set: ar-p1-q1 = matching_headings.
    await seedAttempt(1, 4, ["ar-p1-q1", "ar-p1-q1", "ar-p1-q1", "ar-p1-q8"]);
    const snap = await buildLearnerContextSnapshot();
    expect(snap.practice.weakQuestionTypes).toContain("matching_headings");
    expect(snap.practice.weakQuestionTypes.some((t) => t.includes("ar-p1"))).toBe(false);
  });
});

describe("vocabulary weakness semantics", () => {
  it("derives weakTags from FSRS lapses, commonTags from frequency", async () => {
    const weakId = await createVocabCard({ word: "environment", tags: ["education"] });
    await createVocabCard({ word: "economy", tags: ["education"] });
    await createVocabCard({ word: "transport", tags: ["travel"] });
    // Give the weak card FSRS lapse evidence directly.
    const db = getDb();
    const card = await db.vocabulary.get(weakId);
    await db.vocabulary.update(weakId, { fsrs: { ...(card!.fsrs as object), lapses: 2, difficulty: 8, reps: 3 } as never });

    const snap = await buildLearnerContextSnapshot();
    expect(snap.vocabulary.commonTags).toContain("education");
    expect(snap.vocabulary.weakTags).toContain("education");
    expect(snap.vocabulary.weakTags).not.toContain("travel");
  });
});

describe("writing evaluation schema parsing", () => {
  it("extracts bands from array criterionScores and repeats lowest criterion", async () => {
    await saveWritingSubmission({
      promptId: "t2-agree", testType: "academic", task: 2, answer: "x", wordCount: 250,
      timeUsedSeconds: 600, evaluation: {
        criterionScores: [
          { criterion: "taskResponse", band: 6.0, rationale: "ok" },
          { criterion: "coherenceCohesion", band: 6.5, rationale: "ok" },
          { criterion: "lexicalResource", band: 6.0, rationale: "ok" },
          { criterion: "grammaticalRange", band: 5.5, rationale: "weak" },
        ],
      },
    });
    await saveWritingSubmission({
      promptId: "t2-both-views", testType: "academic", task: 2, answer: "x", wordCount: 260,
      timeUsedSeconds: 600, evaluation: {
        criterionScores: [
          { criterion: "taskResponse", band: 6.5, rationale: "ok" },
          { criterion: "coherenceCohesion", band: 6.5, rationale: "ok" },
          { criterion: "lexicalResource", band: 6.5, rationale: "ok" },
          { criterion: "grammaticalRange", band: 5.5, rationale: "weak" },
        ],
      },
    });
    const snap = await buildLearnerContextSnapshot();
    expect(snap.writing.recent[0].bands).toEqual([6.5, 6.5, 6.5, 5.5]);
    expect(snap.writing.repeatedWeaknesses).toContain("grammaticalRange");
  });
});

describe("speaking criteria from real evaluation", () => {
  it("excludes pronunciation when unsupported and includes repeated issues", async () => {
    const sessionId = await createSpeakingSession("practice", 1, "work");
    const turn = await createSpeakingTurn({ sessionId, part: 1, prompt: "Do you work?", transcript: "yes" });
    await updateSpeakingTurn(turn.id, {
      evaluation: {
        criterionScores: [
          { criterion: "fluencyCoherence", band: 6.0, rationale: "ok", supported: true },
          { criterion: "lexicalResource", band: 6.0, rationale: "ok", supported: true },
          { criterion: "grammaticalRange", band: 6.0, rationale: "ok", supported: true },
          { criterion: "pronunciation", band: 0, rationale: "n/a", supported: false },
        ],
        grammarIssues: ["subject-verb agreement"],
        weaknesses: ["limited connectors"],
        weakestCriterion: "grammaticalRange",
      },
    });
    const snap = await buildLearnerContextSnapshot();
    expect(snap.speaking.evaluatedCriteria).toContain("fluencyCoherence");
    expect(snap.speaking.evaluatedCriteria).not.toContain("pronunciation");
  });
});

describe("study plan next-7-days", () => {
  it("only includes tasks within today..today+7", async () => {
    const now = new Date();
    const iso = (offsetDays: number) => {
      const d = new Date(now);
      d.setDate(now.getDate() + offsetDays);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    await createStudyTask("today", "reading", iso(0));
    await createStudyTask("tomorrow", "reading", iso(1));
    await createStudyTask("plus6", "reading", iso(6));
    await createStudyTask("plus8", "reading", iso(8));
    await createStudyTask("plus30", "reading", iso(30));

    const snap = await buildLearnerContextSnapshot();
    const titles = snap.studyPlan.nextDays.map((t) => t.title);
    expect(titles).toContain("today");
    expect(titles).toContain("tomorrow");
    expect(titles).toContain("plus6");
    expect(titles).not.toContain("plus8");
    expect(titles).not.toContain("plus30");
  });
});

describe("bounded snapshot under load", () => {
  it("caps recent arrays and stays a reasonable size", async () => {
    for (let i = 0; i < 60; i++) await seedAttempt(3, 5);
    for (let i = 0; i < 200; i++) await createVocabCard({ word: `word${i}`, tags: ["t"] });
    for (let i = 0; i < 50; i++) {
      await saveWritingSubmission({ promptId: "p", testType: "academic", task: 2, answer: "a".repeat(200), wordCount: 200, timeUsedSeconds: 1, evaluation: null });
    }

    const snap = await buildLearnerContextSnapshot();
    expect(snap.practice.recentAttempts.length).toBeLessThanOrEqual(CONTEXT_BOUNDS.recentAttempts);
    expect(snap.writing.recent.length).toBeLessThanOrEqual(CONTEXT_BOUNDS.recentWriting);
    const size = estimateSnapshotSize(snap);
    expect(size).toBeLessThan(80_000);
    // No raw essays/audio in the snapshot.
    const json = JSON.stringify(snap);
    expect(json).not.toContain("a".repeat(200));
  });
});
