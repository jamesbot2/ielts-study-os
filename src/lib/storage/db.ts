import Dexie, { type Table, type Transaction } from "dexie";
import type {
  StudyProfile,
  StudyTask,
  LessonProgress,
  VocabularyCard,
  VocabularyReview,
  PracticeAttempt,
  QuestionAttempt,
  Mistake,
  WritingDraft,
  WritingSubmission,
  SpeakingSession,
  SpeakingRecording,
  SpeakingTranscript,
  SpeakingTurn,
  MockAttempt,
  AiConversation,
  AiMessage,
  ImportedMaterial,
  UserSettings,
  ProviderConfig,
  ProviderCacheEntry,
} from "./types";

export type ProfileRow = StudyProfile & { id: string };

export const DB_NAME = "ielts-study-os";
export const DB_VERSION = 3;

class IeltsDatabase extends Dexie {
  profile!: Table<ProfileRow, string>;
  settings!: Table<UserSettings, string>;
  studyTasks!: Table<StudyTask, string>;
  lessonProgress!: Table<LessonProgress, string>;
  vocabulary!: Table<VocabularyCard, string>;
  vocabularyReviews!: Table<VocabularyReview, string>;
  practiceAttempts!: Table<PracticeAttempt, string>;
  questionAttempts!: Table<QuestionAttempt, string>;
  mistakes!: Table<Mistake, string>;
  writingDrafts!: Table<WritingDraft, string>;
  writingSubmissions!: Table<WritingSubmission, string>;
  speakingSessions!: Table<SpeakingSession, string>;
  speakingRecordings!: Table<SpeakingRecording, string>;
  speakingTranscripts!: Table<SpeakingTranscript, string>;
  speakingTurns!: Table<SpeakingTurn, string>;
  mockAttempts!: Table<MockAttempt, string>;
  aiConversations!: Table<AiConversation, string>;
  aiMessages!: Table<AiMessage, string>;
  importedMaterials!: Table<ImportedMaterial, string>;
  providerConfigs!: Table<ProviderConfig, string>;
  providerCache!: Table<ProviderCacheEntry, string>;

  constructor() {
    super(DB_NAME);

    this.version(1).stores({
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

    // v2: canonical SpeakingTurn model + honest mock score fields.
    this.version(2)
      .stores({
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
        speakingRecordings: "id, sessionId, turnId, part, createdAt",
        speakingTranscripts: "id, recordingId",
        speakingTurns: "id, sessionId, part, createdAt",
        mockAttempts: "id, status, startedAt",
        aiConversations: "id, kind, updatedAt",
        aiMessages: "id, conversationId, createdAt",
        importedMaterials: "id, createdAt",
      })
      .upgrade(async (tx) => {
        await migrateToV2(tx);
      });

    // v3: provider configuration and cache.
    this.version(3).stores({
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
      speakingRecordings: "id, sessionId, turnId, part, createdAt",
      speakingTranscripts: "id, recordingId",
      speakingTurns: "id, sessionId, part, createdAt",
      mockAttempts: "id, status, startedAt",
      aiConversations: "id, kind, updatedAt",
      aiMessages: "id, conversationId, createdAt",
      importedMaterials: "id, createdAt",
      providerConfigs: "id",
      providerCache: "id, fetchedAt",
    });
  }
}

// v1 -> v2 migration.
async function migrateToV2(tx: Transaction): Promise<void> {
  // 1. Migrate legacy SpeakingTranscript rows into canonical SpeakingTurn rows.
  const transcripts = await tx.table("speakingTranscripts").toArray() as (SpeakingTranscript & { id: string })[];
  const recordings = await tx.table("speakingRecordings").toArray() as (SpeakingRecording & { id: string; evaluation?: unknown })[];

  for (const t of transcripts) {
    // Resolve a real recording; legacy fake id "manual" becomes null.
    const recording = recordings.find((r) => r.id === t.recordingId && t.recordingId !== "manual");

    let sessionId = recording?.sessionId;
    // A legacy manual (text-only) transcript has no real recording; create a
    // deterministic legacy session so the turn references a real session row.
    if (!sessionId) {
      sessionId = `legacy-session-${t.id}`;
      await tx.table("speakingSessions").put({
        id: sessionId,
        mode: "practice",
        part: null,
        topic: null,
        createdAt: t.createdAt,
        completedAt: t.createdAt,
      });
    }

    const turn: SpeakingTurn = {
      id: `turn-${t.id}`,
      sessionId,
      part: (recording?.part ?? 1) as 1 | 2 | 3,
      prompt: recording?.prompt ?? "",
      transcript: t.text ?? null,
      transcriptSource: (t.source === "stt" ? "stt" : "manual") as "manual" | "stt",
      recordingId: recording?.id ?? null,
      durationSeconds: recording?.durationSeconds ?? null,
      metrics: t.metrics ?? null,
      evaluation: recording?.evaluation ?? null,
      createdAt: t.createdAt,
      updatedAt: t.createdAt,
    };
    await tx.table("speakingTurns").put(turn);
    // Link the recording back to the turn.
    if (recording) {
      await tx.table("speakingRecordings").update(recording.id, { turnId: turn.id });
    }
  }

  // 2. Migrate legacy mock overallBand (a partial L/R average) to gradedAverage,
  // and explicitly remove the legacy raw field from stored objects.
  const mocks = await tx.table("mockAttempts").toArray() as (MockAttempt & { overallBand?: number | null } & { id: string })[];
  for (const m of mocks) {
    if ("overallBand" in m) {
      const cleaned = { ...m } as Record<string, unknown>;
      cleaned.gradedAverage = m.overallBand ?? null;
      cleaned.officialOverallBand = null;
      delete cleaned.overallBand;
      await tx.table("mockAttempts").put(cleaned as unknown as MockAttempt);
    }
  }
}

let dbInstance: IeltsDatabase | null = null;

export function getDb(): IeltsDatabase {
  if (!dbInstance) dbInstance = new IeltsDatabase();
  return dbInstance;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

// Test/utility helper: delete the database and reset the singleton so the
// next getDb() call creates a fresh connection.
export async function resetDb(): Promise<void> {
  if (dbInstance) {
    try {
      await dbInstance.delete();
    } catch {
      // ignore
    }
    dbInstance = null;
  }
}
