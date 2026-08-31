// Domain types for browser-local persistence (IndexedDB via Dexie).
// These mirror the previous server store types but are browser-safe.

import type { Card } from "ts-fsrs";
import type { Skill, TestType } from "@/types/ielts";

export interface StudyProfile {
  uiLanguage: "en" | "zh";
  testType: TestType;
  currentBand: number | null;
  targetBand: number | null;
  targetListening: number | null;
  targetReading: number | null;
  targetWriting: number | null;
  targetSpeaking: number | null;
  testDate: string | null;
  weeklyHours: number;
  weakestSkills: Skill[];
  takenBefore: boolean | null;
  onboardingComplete: boolean;
}

export const DEFAULT_PROFILE: StudyProfile = {
  uiLanguage: "en",
  testType: "academic",
  currentBand: 4.5,
  targetBand: 6.5,
  targetListening: 6.5,
  targetReading: 6.5,
  targetWriting: 6.0,
  targetSpeaking: 6.5,
  testDate: null,
  weeklyHours: 6,
  weakestSkills: [],
  takenBefore: null,
  onboardingComplete: false,
};

export interface StudyTask {
  id: string;
  title: string;
  titleZh: string | null;
  category: string;
  scheduledFor: string | null;
  completed: number;
  completedAt: string | null;
  createdAt: string;
  href: string | null;
  estimatedMinutes: number | null;
}

export interface LessonProgress {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  updatedAt: string;
}

export interface VocabularyCard {
  id: string;
  word: string;
  lemma: string | null;
  partOfSpeech: string | null;
  chineseMeaning: string | null;
  englishDefinition: string | null;
  ipa: string | null;
  example: string | null;
  ieltsExample: string | null;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
  commonMistakes: string | null;
  sourceContext: string | null;
  personalNote: string | null;
  sourceSkill: string | null;
  tags: string[];
  fsrs: Card | null;
  due: string | null;
  createdAt: string;
  lastReviewedAt: string | null;
}

export interface VocabularyReview {
  id: string;
  cardId: string;
  rating: "again" | "hard" | "good" | "easy";
  reviewedAt: string;
  nextState: Card | null;
}

export type AnswerValue = string | string[] | Record<string, string>;

export interface PracticeAttempt {
  id: string;
  setId: string;
  skill: string;
  testType: TestType;
  mode: "practice" | "exam";
  startedAt: string;
  completedAt: string | null;
  rawScore: number | null;
  band: number | null;
  answers: Record<string, AnswerValue>;
  timeSpentSeconds: number | null;
}

export interface QuestionAttempt {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: AnswerValue | null;
  correct: number;
  timeSpentSeconds: number | null;
  flagged: number;
}

export interface Mistake {
  id: string;
  source: string;
  skill: string;
  question: string | null;
  userAnswer: string | null;
  correctAnswer: string | null;
  mistakeType: string | null;
  explanation: string | null;
  questionType: string | null;
  createdAt: string;
  recurrenceCount: number;
  mastery: "new" | "learning" | "reviewing" | "mastered";
  lastReviewedAt: string | null;
}

export interface WritingDraft {
  id: string;
  promptId: string;
  answer: string;
  wordCount: number;
  updatedAt: string;
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  testType: TestType;
  task: number;
  answer: string;
  wordCount: number;
  timeUsedSeconds: number | null;
  evaluation: unknown | null;
  createdAt: string;
}

export interface SpeakingSession {
  id: string;
  mode: string;
  part: number | null;
  topic: string | null;
  createdAt: string;
  completedAt: string | null;
}

// Canonical unit of a speaking response. Recording, transcript and evaluation
// are all OPTIONAL and attach to a turn, never the other way around.
export interface SpeakingTurn {
  id: string;
  sessionId: string;
  part: 1 | 2 | 3;
  prompt: string;
  transcript: string | null;
  transcriptSource: "manual" | "stt" | "none";
  recordingId: string | null;
  durationSeconds: number | null;
  metrics: unknown | null;
  evaluation: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export interface SpeakingRecording {
  id: string;
  sessionId: string;
  turnId: string | null;
  part: number;
  prompt: string;
  audioBlob: Blob | null;
  durationSeconds: number | null;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
}

export interface SpeakingTranscript {
  id: string;
  recordingId: string;
  text: string;
  source: "stt" | "manual";
  metrics: unknown;
  createdAt: string;
}

export interface MockAttempt {
  id: string;
  kind: string;
  testType: TestType;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  state: Record<string, unknown>;
  // Listening/Reading objective average (NOT an official four-skill overall).
  gradedAverage: number | null;
  // Only valid when Listening + Reading + Writing + Speaking all have scores.
  officialOverallBand: number | null;
}

export interface AiConversation {
  id: string;
  kind: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ImportedMaterial {
  id: string;
  title: string;
  skill: string;
  testType: TestType | "both";
  sourceType: "ORIGINAL" | "AI_GENERATED" | "OPEN_LICENSED" | "USER_IMPORTED";
  sourceName: string | null;
  sourceReference: string | null;
  license: string | null;
  copyrightStatus: string | null;
  format: string;
  content: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
}

export interface AiConfig {
  provider: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enableCritic: boolean;
  // For static mode: a public remote proxy URL (NOT a secret key).
  proxyUrl: string;
  configured: boolean;
}

export interface SpeechConfig {
  sttProvider: string;
  sttBaseUrl: string;
  sttModel: string;
  ttsProvider: string;
  ttsVoice: string;
  pronunciationProvider: string;
  configured: boolean;
}

export interface UserSettings {
  id: "app";
  theme: "light" | "dark";
  fontSize: number;
  ai: AiConfig;
  speech: SpeechConfig;
}
