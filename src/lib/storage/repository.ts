// Domain repository over IndexedDB (Dexie). All functions are async.
// Components must not touch Dexie/IndexedDB directly; use this module.

import { getDb, newId, nowIso } from "./db";
import { emptyCard, scheduleReview, type ReviewRating } from "@/lib/srs/fsrs";
import type { Card } from "ts-fsrs";
import type {
  StudyProfile,
  StudyTask,
  LessonProgress,
  VocabularyCard,
  PracticeAttempt,
  QuestionAttempt,
  Mistake,
  WritingDraft,
  WritingSubmission,
  SpeakingRecording,
  SpeakingTranscript,
  SpeakingTurn,
  MockAttempt,
  AiMessage,
  AiConversation,
  ImportedMaterial,
  UserSettings,
  ProviderConfig,
  PersonalVocabularySource,
  AnswerValue,
} from "./types";
import type { CitationRef, ActionProposal } from "@/lib/coach/types";
import { DEFAULT_PROFILE } from "./types";

const db = () => getDb();

// ---------- Profile ----------
export async function getProfile(): Promise<StudyProfile> {
  const row = await db().profile.get("default");
  if (!row) return { ...DEFAULT_PROFILE };
  return { ...DEFAULT_PROFILE, ...row };
}

export async function saveProfile(profile: StudyProfile): Promise<StudyProfile> {
  await db().profile.put({ ...profile, id: "default" });
  return profile;
}

// ---------- Settings ----------
export const DEFAULT_SETTINGS: UserSettings = {
  id: "app",
  theme: "light",
  fontSize: 1,
  ai: {
    provider: "openai-compatible",
    baseUrl: "",
    model: "gpt-4o-mini",
    temperature: 0.4,
    maxTokens: 2048,
    enableCritic: false,
    proxyUrl: "",
    configured: false,
  },
  speech: {
    sttProvider: "",
    sttBaseUrl: "",
    sttModel: "whisper-1",
    ttsProvider: "",
    ttsVoice: "",
    pronunciationProvider: "",
    configured: false,
  },
};

export async function getSettings(): Promise<UserSettings> {
  const row = await db().settings.get("app");
  if (!row) return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...row, ai: { ...DEFAULT_SETTINGS.ai, ...row.ai }, speech: { ...DEFAULT_SETTINGS.speech, ...row.speech } };
}

export async function saveSettings(patch: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const next: UserSettings = { ...current, ...patch };
  await db().settings.put(next);
  return next;
}

// ---------- Lesson progress ----------
export async function getLessonProgress(): Promise<Record<string, string>> {
  const rows = await db().lessonProgress.toArray();
  return Object.fromEntries(rows.map((r) => [r.lessonId, r.status]));
}

export async function setLessonProgress(lessonId: string, status: LessonProgress["status"]): Promise<void> {
  await db().lessonProgress.put({ lessonId, status, updatedAt: nowIso() });
}

// ---------- Vocabulary ----------
export async function listVocabCards(): Promise<VocabularyCard[]> {
  return db().vocabulary.orderBy("due").reverse().toArray();
}

export async function getVocabCard(id: string): Promise<VocabularyCard | undefined> {
  return db().vocabulary.get(id);
}

export async function getDueVocabCards(now = new Date()): Promise<VocabularyCard[]> {
  const iso = now.toISOString();
  const all = await db().vocabulary.toArray();
  return all.filter((c) => !c.due || c.due <= iso).sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));
}

export interface VocabInput {
  word: string;
  lemma?: string;
  partOfSpeech?: string;
  chineseMeaning?: string;
  englishDefinition?: string;
  ipa?: string;
  example?: string;
  ieltsExample?: string;
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  wordFamily?: string[];
  commonMistakes?: string;
  sourceContext?: string;
  personalNote?: string;
  sourceSkill?: string;
  tags?: string[];
  source?: PersonalVocabularySource;
}

export async function createVocabCard(input: VocabInput): Promise<string> {
  const id = newId();
  const card: VocabularyCard = {
    id,
    word: input.word,
    lemma: input.lemma ?? null,
    partOfSpeech: input.partOfSpeech ?? null,
    chineseMeaning: input.chineseMeaning ?? null,
    englishDefinition: input.englishDefinition ?? null,
    ipa: input.ipa ?? null,
    example: input.example ?? null,
    ieltsExample: input.ieltsExample ?? null,
    collocations: input.collocations ?? [],
    synonyms: input.synonyms ?? [],
    antonyms: input.antonyms ?? [],
    wordFamily: input.wordFamily ?? [],
    commonMistakes: input.commonMistakes ?? null,
    sourceContext: input.sourceContext ?? null,
    personalNote: input.personalNote ?? null,
    sourceSkill: input.sourceSkill ?? null,
    tags: input.tags ?? [],
    source: input.source ?? null,
    fsrs: emptyCard(),
    due: nowIso(),
    createdAt: nowIso(),
    lastReviewedAt: null,
  };
  await db().vocabulary.put(card);
  return id;
}

export async function updateVocabCard(id: string, patch: Partial<VocabInput>): Promise<void> {
  const existing = await db().vocabulary.get(id);
  if (!existing) return;
  await db().vocabulary.update(id, {
    word: patch.word ?? existing.word,
    lemma: patch.lemma ?? existing.lemma,
    partOfSpeech: patch.partOfSpeech ?? existing.partOfSpeech,
    chineseMeaning: patch.chineseMeaning ?? existing.chineseMeaning,
    englishDefinition: patch.englishDefinition ?? existing.englishDefinition,
    ipa: patch.ipa ?? existing.ipa,
    example: patch.example ?? existing.example,
    ieltsExample: patch.ieltsExample ?? existing.ieltsExample,
    collocations: patch.collocations ?? existing.collocations,
    synonyms: patch.synonyms ?? existing.synonyms,
    antonyms: patch.antonyms ?? existing.antonyms,
    wordFamily: patch.wordFamily ?? existing.wordFamily,
    commonMistakes: patch.commonMistakes ?? existing.commonMistakes,
    sourceContext: patch.sourceContext ?? existing.sourceContext,
    personalNote: patch.personalNote ?? existing.personalNote,
    sourceSkill: patch.sourceSkill ?? existing.sourceSkill,
    tags: patch.tags ?? existing.tags,
    source: patch.source ?? existing.source,
  });
}

export async function recordVocabReview(
  cardId: string,
  rating: ReviewRating,
): Promise<{ due: string; stability: number; difficulty: number; reps: number }> {
  const card = await getVocabCard(cardId);
  if (!card) throw new Error("Card not found");
  const result = scheduleReview(parseCardJson(card.fsrs), rating);
  await db().vocabulary.update(cardId, {
    fsrs: result.card as unknown as Card,
    due: result.due.toISOString(),
    lastReviewedAt: nowIso(),
  });
  await db().vocabularyReviews.add({
    id: newId(),
    cardId,
    rating,
    reviewedAt: nowIso(),
    nextState: result.card as unknown as Card,
  });
  return {
    due: result.due.toISOString(),
    stability: Math.round(result.card.stability * 10) / 10,
    difficulty: Math.round(result.card.difficulty * 10) / 10,
    reps: result.card.reps,
  };
}

function parseCardJson(card: Card | null): Card | null {
  return card;
}

// ---------- Practice attempts ----------
export async function createPracticeAttempt(
  setId: string,
  skill: string,
  testType: string,
  mode: "practice" | "exam",
  answers: Record<string, AnswerValue> = {},
): Promise<string> {
  const id = newId();
  await db().practiceAttempts.add({
    id,
    setId,
    skill,
    testType: testType as PracticeAttempt["testType"],
    mode,
    startedAt: nowIso(),
    completedAt: null,
    rawScore: null,
    band: null,
    answers,
    timeSpentSeconds: null,
  });
  return id;
}

export async function completePracticeAttempt(
  id: string,
  rawScore: number,
  band: number,
  answers: Record<string, AnswerValue>,
  questionAttempts: Omit<QuestionAttempt, "id" | "attemptId">[],
  timeSpentSeconds: number,
): Promise<void> {
  await db().practiceAttempts.update(id, {
    completedAt: nowIso(),
    rawScore,
    band,
    answers,
    timeSpentSeconds,
  });
  for (const qa of questionAttempts) {
    await db().questionAttempts.add({ ...qa, id: newId(), attemptId: id });
  }
}

export async function listPracticeAttempts(limit = 100): Promise<PracticeAttempt[]> {
  const all = await db().practiceAttempts.orderBy("startedAt").reverse().toArray();
  return all.slice(0, limit);
}

export async function getQuestionAttempts(attemptId: string): Promise<QuestionAttempt[]> {
  return db().questionAttempts.where("attemptId").equals(attemptId).toArray();
}

// ---------- Mistakes ----------
export interface MistakeInput {
  source: string;
  skill: string;
  question?: string;
  userAnswer?: string;
  correctAnswer?: string;
  mistakeType?: string;
  explanation?: string;
  questionType?: string;
}

export async function recordMistake(input: MistakeInput): Promise<void> {
  const existing = await db().mistakes
    .where("skill")
    .equals(input.skill)
    .and((m) => m.question === (input.question ?? ""))
    .first();
  if (existing && existing.question === (input.question ?? "") && existing.userAnswer === (input.userAnswer ?? "")) {
    await db().mistakes.update(existing.id, {
      recurrenceCount: (existing.recurrenceCount ?? 1) + 1,
      createdAt: nowIso(),
    });
    return;
  }
  await db().mistakes.add({
    id: newId(),
    source: input.source,
    skill: input.skill,
    question: input.question ?? null,
    userAnswer: input.userAnswer ?? null,
    correctAnswer: input.correctAnswer ?? null,
    mistakeType: input.mistakeType ?? null,
    explanation: input.explanation ?? null,
    questionType: input.questionType ?? null,
    createdAt: nowIso(),
    recurrenceCount: 1,
    mastery: "new",
    lastReviewedAt: null,
  });
}

export async function listMistakes(): Promise<Mistake[]> {
  return db().mistakes.orderBy("createdAt").reverse().toArray();
}

export async function updateMistake(id: string, patch: Partial<Mistake>): Promise<void> {
  await db().mistakes.update(id, { ...patch, lastReviewedAt: nowIso() });
}

// ---------- Writing ----------
export async function getWritingDraft(promptId: string): Promise<WritingDraft | undefined> {
  return db().writingDrafts.where("promptId").equals(promptId).first();
}

export async function saveWritingDraft(promptId: string, answer: string): Promise<void> {
  const existing = await getWritingDraft(promptId);
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  if (existing) {
    await db().writingDrafts.update(existing.id, { answer, wordCount, updatedAt: nowIso() });
  } else {
    await db().writingDrafts.add({ id: newId(), promptId, answer, wordCount, updatedAt: nowIso() });
  }
}

export async function listWritingSubmissions(limit = 50): Promise<WritingSubmission[]> {
  const all = await db().writingSubmissions.orderBy("createdAt").reverse().toArray();
  return all.slice(0, limit);
}

export async function saveWritingSubmission(submission: Omit<WritingSubmission, "id" | "createdAt">): Promise<string> {
  const id = newId();
  await db().writingSubmissions.add({ ...submission, id, createdAt: nowIso() });
  return id;
}

export async function updateWritingEvaluation(submissionId: string, evaluation: unknown): Promise<void> {
  await db().writingSubmissions.update(submissionId, { evaluation });
}

// ---------- Speaking ----------
export async function createSpeakingSession(mode: string, part: number | null, topic: string | null): Promise<string> {
  const id = newId();
  await db().speakingSessions.add({ id, mode, part, topic, createdAt: nowIso(), completedAt: null });
  return id;
}

export async function completeSpeakingSession(id: string): Promise<void> {
  await db().speakingSessions.update(id, { completedAt: nowIso() });
}

export async function addSpeakingRecording(
  recording: Omit<SpeakingRecording, "id" | "createdAt" | "turnId"> & { turnId?: string | null },
): Promise<string> {
  const id = newId();
  await db().speakingRecordings.add({ ...recording, turnId: recording.turnId ?? null, id, createdAt: nowIso() });
  return id;
}

export async function listSpeakingRecordings(): Promise<SpeakingRecording[]> {
  return db().speakingRecordings.orderBy("createdAt").reverse().toArray();
}

export async function deleteSpeakingRecording(id: string): Promise<void> {
  await db().speakingRecordings.delete(id);
  await db().speakingTranscripts.where("recordingId").equals(id).delete();
}

export async function addSpeakingTranscript(t: Omit<SpeakingTranscript, "id" | "createdAt">): Promise<string> {
  const id = newId();
  await db().speakingTranscripts.add({ ...t, id, createdAt: nowIso() });
  return id;
}

export async function getSpeakingTranscript(recordingId: string): Promise<SpeakingTranscript | undefined> {
  return db().speakingTranscripts.where("recordingId").equals(recordingId).first();
}

// ---------- Speaking turns (canonical unit) ----------
export async function createSpeakingTurn(input: {
  sessionId: string;
  part: 1 | 2 | 3;
  prompt: string;
  transcript?: string | null;
  transcriptSource?: "manual" | "stt" | "none";
  recordingId?: string | null;
  durationSeconds?: number | null;
  metrics?: unknown;
}): Promise<SpeakingTurn> {
  const id = newId();
  const now = nowIso();
  const turn: SpeakingTurn = {
    id,
    sessionId: input.sessionId,
    part: input.part,
    prompt: input.prompt,
    transcript: input.transcript ?? null,
    transcriptSource: input.transcriptSource ?? "none",
    recordingId: input.recordingId ?? null,
    durationSeconds: input.durationSeconds ?? null,
    metrics: input.metrics ?? null,
    evaluation: null,
    createdAt: now,
    updatedAt: now,
  };
  await db().speakingTurns.add(turn);
  return turn;
}

export async function updateSpeakingTurn(id: string, patch: Partial<SpeakingTurn>): Promise<void> {
  await db().speakingTurns.update(id, { ...patch, updatedAt: nowIso() });
}

export async function getSpeakingTurn(id: string): Promise<SpeakingTurn | undefined> {
  return db().speakingTurns.get(id);
}

export async function listSpeakingTurns(): Promise<SpeakingTurn[]> {
  return db().speakingTurns.orderBy("createdAt").reverse().toArray();
}

export async function deleteSpeakingTurn(id: string): Promise<void> {
  const turn = await db().speakingTurns.get(id);
  if (turn?.recordingId) {
    await db().speakingRecordings.delete(turn.recordingId);
  }
  await db().speakingTurns.delete(id);
}

// ---------- Mock attempts ----------
export async function createMockAttempt(kind: string, testType: string): Promise<string> {
  const id = newId();
  await db().mockAttempts.add({
    id,
    kind,
    testType: testType as MockAttempt["testType"],
    status: "in_progress",
    startedAt: nowIso(),
    completedAt: null,
    state: {},
    gradedAverage: null,
    officialOverallBand: null,
  });
  return id;
}

export async function getMockAttempt(id: string): Promise<MockAttempt | undefined> {
  return db().mockAttempts.get(id);
}

export async function updateMockState(id: string, state: Record<string, unknown>): Promise<void> {
  await db().mockAttempts.update(id, { state });
}

export async function completeMockAttempt(id: string, gradedAverage: number): Promise<void> {
  await db().mockAttempts.update(id, { status: "completed", completedAt: nowIso(), gradedAverage });
}

export async function abandonMockAttempt(id: string): Promise<void> {
  await db().mockAttempts.update(id, { status: "abandoned", completedAt: nowIso() });
}

export async function deleteMockAttempt(id: string): Promise<void> {
  await db().mockAttempts.delete(id);
}

export async function listMockAttempts(): Promise<MockAttempt[]> {
  return db().mockAttempts.orderBy("startedAt").reverse().toArray();
}

// ---------- AI conversations ----------
export async function createConversation(kind: string, title?: string): Promise<string> {
  const id = newId();
  await db().aiConversations.add({ id, kind, title: title ?? null, createdAt: nowIso(), updatedAt: nowIso() });
  return id;
}

export async function listConversations(kind?: string): Promise<AiConversation[]> {
  const all = await db().aiConversations.orderBy("updatedAt").reverse().toArray();
  return kind ? all.filter((c) => c.kind === kind) : all;
}

export async function getConversation(id: string): Promise<AiConversation | undefined> {
  return db().aiConversations.get(id);
}

export async function renameConversation(id: string, title: string): Promise<void> {
  await db().aiConversations.update(id, { title, updatedAt: nowIso() });
}

export async function deleteConversation(id: string): Promise<void> {
  await db().transaction("rw", [db().aiConversations, db().aiMessages], async () => {
    await db().aiMessages.where("conversationId").equals(id).delete();
    await db().aiConversations.delete(id);
  });
}

export async function addMessage(
  conversationId: string,
  role: AiMessage["role"],
  content: string,
  extra?: { citations?: CitationRef[]; actions?: ActionProposal[] },
): Promise<void> {
  await db().aiMessages.add({
    id: newId(),
    conversationId,
    role,
    content,
    createdAt: nowIso(),
    citations: extra?.citations,
    actions: extra?.actions,
  });
  await db().aiConversations.update(conversationId, { updatedAt: nowIso() });
}

export async function listMessages(conversationId: string): Promise<AiMessage[]> {
  return db().aiMessages.where("conversationId").equals(conversationId).sortBy("createdAt");
}

// ---------- Study plan ----------
export async function listStudyTasks(): Promise<StudyTask[]> {
  return db().studyTasks.orderBy("scheduledFor").toArray();
}

export async function createStudyTask(
  title: string,
  category: string,
  scheduledFor?: string,
  options?: { titleZh?: string; href?: string; estimatedMinutes?: number },
): Promise<StudyTask> {
  const task: StudyTask = {
    id: newId(),
    title,
    titleZh: options?.titleZh ?? null,
    category,
    scheduledFor: scheduledFor ?? null,
    completed: 0,
    completedAt: null,
    createdAt: nowIso(),
    href: options?.href ?? null,
    estimatedMinutes: options?.estimatedMinutes ?? null,
  };
  await db().studyTasks.add(task);
  return task;
}

export async function updateStudyTask(id: string, patch: Partial<StudyTask>): Promise<void> {
  const existing = await db().studyTasks.get(id);
  if (!existing) return;
  await db().studyTasks.update(id, {
    ...patch,
    completedAt: patch.completed ? nowIso() : existing.completedAt,
  });
}

export async function deleteStudyTask(id: string): Promise<void> {
  await db().studyTasks.delete(id);
}

// ---------- Imported materials ----------
export async function listImportedMaterials(): Promise<ImportedMaterial[]> {
  return db().importedMaterials.orderBy("createdAt").reverse().toArray();
}

export async function createImportedMaterial(input: {
  title: string;
  skill: string;
  testType: ImportedMaterial["testType"];
  sourceType: ImportedMaterial["sourceType"];
  sourceName?: string | null;
  sourceReference?: string | null;
  license?: string | null;
  copyrightStatus?: string | null;
  format: string;
  content?: string | null;
}): Promise<string> {
  const id = newId();
  await db().importedMaterials.add({
    title: input.title,
    skill: input.skill,
    testType: input.testType,
    sourceType: input.sourceType,
    sourceName: input.sourceName ?? null,
    sourceReference: input.sourceReference ?? null,
    license: input.license ?? null,
    copyrightStatus: input.copyrightStatus ?? null,
    format: input.format,
    content: input.content ?? null,
    meta: {},
    id,
    createdAt: nowIso(),
  });
  return id;
}

export async function deleteImportedMaterial(id: string): Promise<void> {
  await db().importedMaterials.delete(id);
}

// ---------- Provider config & cache ----------
export async function getProviderConfig(pluginId: string): Promise<ProviderConfig | undefined> {
  return db().providerConfigs.get(pluginId);
}

export async function saveProviderConfig(config: ProviderConfig): Promise<void> {
  await db().providerConfigs.put(config);
}

export async function listProviderConfigs(): Promise<ProviderConfig[]> {
  return db().providerConfigs.toArray();
}

export async function getProviderCache<T>(key: string): Promise<T | undefined> {
  const row = await db().providerCache.get(key);
  if (!row) return undefined;
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) {
    await db().providerCache.delete(key);
    return undefined;
  }
  return row.value as T;
}

export async function setProviderCache<T>(key: string, value: T, ttlMs?: number): Promise<void> {
  await db().providerCache.put({
    id: key,
    value,
    fetchedAt: nowIso(),
    expiresAt: ttlMs ? new Date(Date.now() + ttlMs).toISOString() : null,
  });
}

export async function deleteProviderCache(key: string): Promise<void> {
  await db().providerCache.delete(key);
}
