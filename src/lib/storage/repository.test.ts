import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "./db";
import {
  getProfile,
  saveProfile,
  createVocabCard,
  getDueVocabCards,
  recordVocabReview,
  listVocabCards,
  recordMistake,
  listMistakes,
  createMockAttempt,
  getMockAttempt,
  completeMockAttempt,
  listStudyTasks,
  createStudyTask,
  updateStudyTask,
} from "./repository";
import { DEFAULT_PROFILE } from "./types";

beforeEach(async () => {
  await resetDb();
});

describe("profile repository", () => {
  it("returns default profile when empty", async () => {
    const p = await getProfile();
    expect(p.targetBand).toBe(DEFAULT_PROFILE.targetBand);
  });

  it("persists and returns a profile", async () => {
    await saveProfile({ ...DEFAULT_PROFILE, targetBand: 7.5, testType: "general" });
    const p = await getProfile();
    expect(p.targetBand).toBe(7.5);
    expect(p.testType).toBe("general");
  });
});

describe("vocabulary repository", () => {
  it("creates a card due immediately", async () => {
    await createVocabCard({ word: "alleviate", chineseMeaning: "缓解" });
    const due = await getDueVocabCards();
    expect(due.length).toBe(1);
    expect(due[0].word).toBe("alleviate");
  });

  it("FSRS review schedules the card into the future", async () => {
    await createVocabCard({ word: "mitigate" });
    const cards = await listVocabCards();
    await recordVocabReview(cards[0].id, "good");
    const due = await getDueVocabCards();
    expect(due.length).toBe(0);
  });
});

describe("mistake repository", () => {
  it("records and lists mistakes with recurrence", async () => {
    await recordMistake({ source: "reading", skill: "reading", question: "Q1", userAnswer: "A", correctAnswer: "B" });
    await recordMistake({ source: "reading", skill: "reading", question: "Q1", userAnswer: "A", correctAnswer: "B" });
    const list = await listMistakes();
    expect(list.length).toBe(1);
    expect(list[0].recurrenceCount).toBe(2);
  });
});

describe("mock repository", () => {
  it("creates, updates and completes a mock attempt", async () => {
    const id = await createMockAttempt("reading", "academic");
    const attempt = await getMockAttempt(id);
    expect(attempt?.status).toBe("in_progress");
    await completeMockAttempt(id, 6.5);
    const done = await getMockAttempt(id);
    expect(done?.status).toBe("completed");
    expect(done?.gradedAverage).toBe(6.5);
  });
});

describe("study task repository", () => {
  it("creates, lists and completes tasks", async () => {
    await createStudyTask("Practice reading", "reading", "2026-06-01");
    const tasks = await listStudyTasks();
    expect(tasks.length).toBe(1);
    await updateStudyTask(tasks[0].id, { completed: 1 });
    const updated = await listStudyTasks();
    expect(updated[0].completed).toBe(1);
    expect(updated[0].completedAt).toBeTruthy();
  });
});
