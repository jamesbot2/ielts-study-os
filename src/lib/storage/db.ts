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
} from "./types";

export type ProfileRow = StudyProfile & { id: string };

export const DB_NAME = "ielts-study-os";
export const DB_VERSION = 2;

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
  }
}

// v1 -> v2 migration.
async function migrateToV2(tx: Transaction): Promise<void> {
  // 1. Migrate legacy SpeakingTranscript rows into canonical SpeakingTurn rows.
  const transcripts = await tx.table("speakingTranscripts").toArray() as (SpeakingTranscript & { id: string })[];
  const recordings = await tx.table("speakingRecordings").toArray() as (SpeakingRecording & { id: string })[];

  for (const t of transcripts) {
    // Resolve a real recording; legacy fake id "manual" becomes null.
    const recording = recordings.find((r) => r.id === t.recordingId && t.recordingId !== "manual");
    const turn: SpeakingTurn = {
      id: `turn-${t.id}`,
      sessionId: recording?.sessionId ?? t.recordingId,
      part: (recording?.part ?? 1) as 1 | 2 | 3,
      prompt: recording?.prompt ?? "",
      transcript: t.text ?? null,
      transcriptSource: (t.source === "stt" ? "stt" : "manual") as "manual" | "stt",
      recordingId: recording?.id ?? null,
      durationSeconds: recording?.durationSeconds ?? null,
      metrics: t.metrics ?? null,
      evaluation: null,
      createdAt: t.createdAt,
      updatedAt: t.createdAt,
    };
    await tx.table("speakingTurns").put(turn);
    // Link the recording back to the turn.
    if (recording) {
      await tx.table("speakingRecordings").update(recording.id, { turnId: turn.id });
    }
  }

  // 2. Migrate legacy mock overallBand (a partial L/R average) to gradedAverage.
  const mocks = await tx.table("mockAttempts").toArray() as (MockAttempt & { overallBand?: number | null } & { id: string })[];
  for (const m of mocks) {
    if ("overallBand" in m) {
      await tx.table("mockAttempts").update(m.id, {
        gradedAverage: m.overallBand ?? null,
        officialOverallBand: null,
      });
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
