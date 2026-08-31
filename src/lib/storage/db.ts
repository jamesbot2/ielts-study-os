import Dexie, { type Table } from "dexie";
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
  MockAttempt,
  AiConversation,
  AiMessage,
  ImportedMaterial,
  UserSettings,
} from "./types";

export type ProfileRow = StudyProfile & { id: string };

export const DB_NAME = "ielts-study-os";
export const DB_VERSION = 1;

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
  mockAttempts!: Table<MockAttempt, string>;
  aiConversations!: Table<AiConversation, string>;
  aiMessages!: Table<AiMessage, string>;
  importedMaterials!: Table<ImportedMaterial, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
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
