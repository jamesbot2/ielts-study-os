import { describe, it, expect, beforeEach } from "vitest";
import Dexie from "dexie";
import { DB_NAME, resetDb } from "./db";

// Create a v1 database with legacy data, then open the real (v2) DB and assert
// the migration moved data to the new model without loss.
async function seedV1LegacyData() {
  const legacy = new Dexie(DB_NAME) as Dexie;
  legacy.version(1).stores({
    profile: "id",
    settings: "id",
    studyTasks: "id, scheduledFor, completed, createdAt",
    lessonProgress: "lessonId, updatedAt",
    vocabulary: "id, due, createdAt, word",
    vocabularyReviews: "id, cardId, reviewedAt",
    practiceAttempts: "id, setId, skill, startedAt, completedAt",
    questionAttempts: "id, attemptId, questionId",
    mistakes: "id, skill, questionType, createdAt",
    writingDrafts: "id, promptId, updatedAt",
    writingSubmissions: "id, promptId, createdAt",
    speakingSessions: "id, createdAt",
    speakingRecordings: "id, sessionId, part, createdAt",
    speakingTranscripts: "id, recordingId",
    mockAttempts: "id, status, startedAt",
    aiConversations: "id, kind, updatedAt",
    aiMessages: "id, conversationId, createdAt",
    importedMaterials: "id, createdAt",
  });

  await legacy.open();
  await legacy.table("mockAttempts").add({
    id: "mock-legacy",
    kind: "reading",
    testType: "academic",
    status: "completed",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-01T01:00:00.000Z",
    state: {},
    overallBand: 6.5,
  });
  await legacy.table("speakingRecordings").add({
    id: "rec-legacy",
    sessionId: "sess-legacy",
    part: 1,
    prompt: "Describe your hometown.",
    audioBlob: null,
    durationSeconds: 30,
    mimeType: null,
    size: null,
    evaluation: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  });
  await legacy.table("speakingTranscripts").add({
    id: "trans-legacy",
    recordingId: "rec-legacy",
    text: "My hometown is small.",
    source: "manual",
    metrics: { wordCount: 4 },
    createdAt: "2026-01-01T00:01:00.000Z",
  });
  await legacy.close();
}

describe("v1 → v2 migration", () => {
  beforeEach(async () => {
    await resetDb();
    await seedV1LegacyData();
  });

  it("moves legacy mock overallBand to gradedAverage (not official overall)", async () => {
    const { getDb } = await import("./db");
    const db = getDb();
    const mock = await db.mockAttempts.get("mock-legacy");
    expect(mock).toBeTruthy();
    expect(mock!.gradedAverage).toBe(6.5);
    expect(mock!.officialOverallBand).toBeNull();
  });

  it("migrates legacy transcripts into speaking turns with real recording link", async () => {
    const { getDb } = await import("./db");
    const db = getDb();
    const turns = await db.speakingTurns.toArray();
    expect(turns.length).toBe(1);
    expect(turns[0].transcript).toBe("My hometown is small.");
    expect(turns[0].transcriptSource).toBe("manual");
    expect(turns[0].recordingId).toBe("rec-legacy");
    expect(turns[0].sessionId).toBe("sess-legacy");
    // recording is linked back to the turn
    const rec = await db.speakingRecordings.get("rec-legacy");
    expect(rec!.turnId).toBe(turns[0].id);
  });

  it("does not use a fake 'manual' recording id for transcripts without audio", async () => {
    // Add a transcript with no recording in v1 via a fresh seed
    await resetDb();
    const legacy = new Dexie(DB_NAME) as Dexie;
    legacy.version(1).stores({ speakingSessions: "id, createdAt", speakingRecordings: "id, sessionId, part, createdAt", speakingTranscripts: "id, recordingId", mockAttempts: "id, status, startedAt", profile: "id", settings: "id", studyTasks: "id", lessonProgress: "lessonId", vocabulary: "id", vocabularyReviews: "id", practiceAttempts: "id", questionAttempts: "id", mistakes: "id", writingDrafts: "id", writingSubmissions: "id", aiConversations: "id", aiMessages: "id", importedMaterials: "id" });
    await legacy.open();
    await legacy.table("speakingTranscripts").add({
      id: "trans-norec",
      recordingId: "manual",
      text: "Text only answer.",
      source: "manual",
      metrics: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    await legacy.close();

    const { getDb } = await import("./db");
    const db = getDb();
    const turn = (await db.speakingTurns.toArray()).find((t) => t.transcript === "Text only answer.");
    expect(turn).toBeTruthy();
    expect(turn!.recordingId).toBeNull();
  });
});
