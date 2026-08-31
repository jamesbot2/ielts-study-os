import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import type { TestType, Skill } from "@/types/ielts";

// ---------- Types ----------
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

// ---------- Profile ----------
export function getProfile(): StudyProfile {
  const stored = getDb()
    .prepare("SELECT value FROM settings WHERE key = 'study_profile'")
    .get() as { value: string } | undefined;
  if (!stored) return { ...DEFAULT_PROFILE };
  try {
    return { ...DEFAULT_PROFILE, ...(JSON.parse(stored.value) as StudyProfile) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: StudyProfile): StudyProfile {
  getDb()
    .prepare(
      "INSERT INTO settings(key, value) VALUES('study_profile', ?) " +
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(JSON.stringify(profile));
  return profile;
}

// ---------- Lesson progress ----------
export function getLessonProgress(): Record<string, string> {
  const rows = getDb()
    .prepare("SELECT lesson_id, status FROM lesson_progress")
    .all() as { lesson_id: string; status: string }[];
  return Object.fromEntries(rows.map((r) => [r.lesson_id, r.status]));
}

export function setLessonProgress(lessonId: string, status: string): void {
  getDb()
    .prepare(
      "INSERT INTO lesson_progress(lesson_id, status, updated_at) VALUES(?, ?, ?) " +
        "ON CONFLICT(lesson_id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at",
    )
    .run(lessonId, status, new Date().toISOString());
}

// ---------- Vocabulary ----------
export interface VocabRow {
  id: string;
  word: string;
  lemma: string | null;
  part_of_speech: string | null;
  chinese_meaning: string | null;
  english_definition: string | null;
  ipa: string | null;
  example: string | null;
  ielts_example: string | null;
  collocations: string | null;
  synonyms: string | null;
  antonyms: string | null;
  word_family: string | null;
  common_mistakes: string | null;
  source_context: string | null;
  personal_note: string | null;
  source_skill: string | null;
  fsrs_state: string | null;
  due_at: string | null;
  created_at: string;
  last_review_at: string | null;
}

export function listVocabCards(): VocabRow[] {
  return getDb()
    .prepare("SELECT * FROM vocabulary_cards ORDER BY due_at ASC NULLS LAST, created_at DESC")
    .all() as unknown as VocabRow[];
}

export function getVocabCard(id: string): VocabRow | undefined {
  return getDb().prepare("SELECT * FROM vocabulary_cards WHERE id = ?").get(id) as
    | VocabRow
    | undefined;
}

export function getDueVocabCards(now = new Date()): VocabRow[] {
  return getDb()
    .prepare(
      "SELECT * FROM vocabulary_cards WHERE due_at IS NULL OR due_at <= ? ORDER BY due_at ASC",
    )
    .all(now.toISOString()) as unknown as VocabRow[];
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
}

function jsonOr(value: string[] | undefined): string | null {
  return value && value.length ? JSON.stringify(value) : null;
}

export function createVocabCard(input: VocabInput, fsrsState?: unknown, dueAt?: string): VocabRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  const row: VocabRow = {
    id,
    word: input.word,
    lemma: input.lemma ?? null,
    part_of_speech: input.partOfSpeech ?? null,
    chinese_meaning: input.chineseMeaning ?? null,
    english_definition: input.englishDefinition ?? null,
    ipa: input.ipa ?? null,
    example: input.example ?? null,
    ielts_example: input.ieltsExample ?? null,
    collocations: jsonOr(input.collocations),
    synonyms: jsonOr(input.synonyms),
    antonyms: jsonOr(input.antonyms),
    word_family: jsonOr(input.wordFamily),
    common_mistakes: input.commonMistakes ?? null,
    source_context: input.sourceContext ?? null,
    personal_note: input.personalNote ?? null,
    source_skill: input.sourceSkill ?? null,
    fsrs_state: fsrsState ? JSON.stringify(fsrsState) : null,
    due_at: dueAt ?? null,
    created_at: now,
    last_review_at: null,
  };
  getDb()
    .prepare(
      `INSERT INTO vocabulary_cards(id, word, lemma, part_of_speech, chinese_meaning,
        english_definition, ipa, example, ielts_example, collocations, synonyms, antonyms,
        word_family, common_mistakes, source_context, personal_note, source_skill,
        fsrs_state, due_at, created_at, last_review_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      row.id, row.word, row.lemma, row.part_of_speech, row.chinese_meaning,
      row.english_definition, row.ipa, row.example, row.ielts_example, row.collocations,
      row.synonyms, row.antonyms, row.word_family, row.common_mistakes, row.source_context,
      row.personal_note, row.source_skill, row.fsrs_state, row.due_at, row.created_at,
      row.last_review_at,
    );
  return row;
}

export function updateVocabCard(id: string, patch: Partial<VocabInput>): void {
  const existing = getVocabCard(id);
  if (!existing) return;
  getDb()
    .prepare(
      `UPDATE vocabulary_cards SET word=?, lemma=?, part_of_speech=?, chinese_meaning=?,
        english_definition=?, ipa=?, example=?, ielts_example=?, collocations=?, synonyms=?,
        antonyms=?, word_family=?, common_mistakes=?, source_context=?, personal_note=?,
        source_skill=? WHERE id=?`,
    )
    .run(
      patch.word ?? existing.word,
      patch.lemma ?? existing.lemma,
      patch.partOfSpeech ?? existing.part_of_speech,
      patch.chineseMeaning ?? existing.chinese_meaning,
      patch.englishDefinition ?? existing.english_definition,
      patch.ipa ?? existing.ipa,
      patch.example ?? existing.example,
      patch.ieltsExample ?? existing.ielts_example,
      jsonOr(patch.collocations ?? parseJsonArray(existing.collocations)),
      jsonOr(patch.synonyms ?? parseJsonArray(existing.synonyms)),
      jsonOr(patch.antonyms ?? parseJsonArray(existing.antonyms)),
      jsonOr(patch.wordFamily ?? parseJsonArray(existing.word_family)),
      patch.commonMistakes ?? existing.common_mistakes,
      patch.sourceContext ?? existing.source_context,
      patch.personalNote ?? existing.personal_note,
      patch.sourceSkill ?? existing.source_skill,
      id,
    );
}

function parseJsonArray(value: string | null): string[] | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as string[];
  } catch {
    return undefined;
  }
}

export function recordVocabReview(
  cardId: string,
  rating: string,
  nextFsrsState: unknown,
  dueAt: string,
): void {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      "UPDATE vocabulary_cards SET fsrs_state = ?, due_at = ?, last_review_at = ? WHERE id = ?",
    )
    .run(JSON.stringify(nextFsrsState), dueAt, now, cardId);
  getDb()
    .prepare(
      `INSERT INTO vocabulary_reviews(id, card_id, rating, reviewed_at, previous_state, next_state)
       VALUES(?,?,?,?,?,?)`,
    )
    .run(randomUUID(), cardId, rating, now, null, JSON.stringify(nextFsrsState));
}

// ---------- Practice attempts ----------
export interface PracticeAttemptRow {
  id: string;
  set_id: string;
  skill: string;
  test_type: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  raw_score: number | null;
  band_score: number | null;
  answers: string;
  time_spent_seconds: number | null;
}

export function createPracticeAttempt(
  setId: string,
  skill: string,
  testType: string,
  mode: string,
  answers: Record<string, unknown> = {},
): PracticeAttemptRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO practice_attempts(id, set_id, skill, test_type, mode, started_at, answers)
       VALUES(?,?,?,?,?,?,?)`,
    )
    .run(id, setId, skill, testType, mode, now, JSON.stringify(answers));
  return getPracticeAttempt(id)!;
}

export function getPracticeAttempt(id: string): PracticeAttemptRow | undefined {
  return getDb()
    .prepare("SELECT * FROM practice_attempts WHERE id = ?")
    .get(id) as unknown as PracticeAttemptRow | undefined;
}

export function listPracticeAttempts(limit = 50): PracticeAttemptRow[] {
  return getDb()
    .prepare("SELECT * FROM practice_attempts ORDER BY started_at DESC LIMIT ?")
    .all(limit) as unknown as PracticeAttemptRow[];
}

export function completePracticeAttempt(
  id: string,
  rawScore: number,
  bandScore: number,
  answers: Record<string, unknown>,
  questionAttempts: {
    questionId: string;
    userAnswer: unknown;
    correct: boolean;
    timeSpentSeconds: number;
    flagged: boolean;
  }[],
  timeSpentSeconds: number,
): void {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `UPDATE practice_attempts SET completed_at=?, raw_score=?, band_score=?, answers=?, time_spent_seconds=? WHERE id=?`,
    )
    .run(now, rawScore, bandScore, JSON.stringify(answers), timeSpentSeconds, id);

  const insert = getDb().prepare(
    `INSERT INTO question_attempts(id, attempt_id, question_id, user_answer, correct, time_spent_seconds, flagged)
     VALUES(?,?,?,?,?,?,?)`,
  );
  for (const qa of questionAttempts) {
    insert.run(
      randomUUID(),
      id,
      qa.questionId,
      qa.userAnswer == null ? null : JSON.stringify(qa.userAnswer),
      qa.correct ? 1 : 0,
      qa.timeSpentSeconds,
      qa.flagged ? 1 : 0,
    );
  }
}

export function getQuestionAttempts(attemptId: string) {
  return getDb()
    .prepare("SELECT * FROM question_attempts WHERE attempt_id = ?")
    .all(attemptId) as {
    id: string;
    attempt_id: string;
    question_id: string;
    user_answer: string | null;
    correct: number;
    time_spent_seconds: number | null;
    flagged: number;
  }[];
}

// ---------- Mistakes ----------
export interface MistakeRow {
  id: string;
  source: string;
  skill: string;
  question: string | null;
  user_answer: string | null;
  correct_answer: string | null;
  mistake_type: string | null;
  explanation: string | null;
  question_type: string | null;
  created_at: string;
  recurrence_count: number;
  mastery: string;
  last_reviewed_at: string | null;
}

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

export function recordMistake(input: MistakeInput): MistakeRow {
  // increment recurrence if the same mistake already exists
  const existing = getDb()
    .prepare(
      "SELECT * FROM mistakes WHERE source=? AND skill=? AND question=? AND user_answer=? ORDER BY created_at DESC LIMIT 1",
    )
    .get(input.source, input.skill, input.question ?? "", input.userAnswer ?? "") as
    | MistakeRow
    | undefined;

  if (existing) {
    getDb()
      .prepare(
        "UPDATE mistakes SET recurrence_count = recurrence_count + 1, created_at = ? WHERE id = ?",
      )
      .run(new Date().toISOString(), existing.id);
    return { ...existing, recurrence_count: existing.recurrence_count + 1 };
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const row: MistakeRow = {
    id,
    source: input.source,
    skill: input.skill,
    question: input.question ?? null,
    user_answer: input.userAnswer ?? null,
    correct_answer: input.correctAnswer ?? null,
    mistake_type: input.mistakeType ?? null,
    explanation: input.explanation ?? null,
    question_type: input.questionType ?? null,
    created_at: now,
    recurrence_count: 1,
    mastery: "new",
    last_reviewed_at: null,
  };
  getDb()
    .prepare(
      `INSERT INTO mistakes(id, source, skill, question, user_answer, correct_answer,
        mistake_type, explanation, question_type, created_at, recurrence_count, mastery, last_reviewed_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      row.id, row.source, row.skill, row.question, row.user_answer, row.correct_answer,
      row.mistake_type, row.explanation, row.question_type, row.created_at,
      row.recurrence_count, row.mastery, row.last_reviewed_at,
    );
  return row;
}

export function listMistakes(): MistakeRow[] {
  return getDb()
    .prepare("SELECT * FROM mistakes ORDER BY created_at DESC")
    .all() as unknown as MistakeRow[];
}

export function updateMistake(id: string, patch: Partial<MistakeRow>): void {
  const existing = getDb()
    .prepare("SELECT * FROM mistakes WHERE id = ?")
    .get(id) as unknown as MistakeRow | undefined;
  if (!existing) return;
  const next = { ...existing, ...patch };
  getDb()
    .prepare(
      "UPDATE mistakes SET mastery=?, last_reviewed_at=? WHERE id=?",
    )
    .run(next.mastery, next.last_reviewed_at ?? new Date().toISOString(), id);
}

// ---------- Writing ----------
export interface WritingSubmissionRow {
  id: string;
  prompt_id: string;
  test_type: string;
  task: number;
  answer: string;
  word_count: number;
  time_used_seconds: number | null;
  created_at: string;
}

export function createWritingSubmission(
  promptId: string,
  testType: string,
  task: number,
  answer: string,
  wordCount: number,
  timeUsedSeconds: number | null,
): WritingSubmissionRow {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO writing_submissions(id, prompt_id, test_type, task, answer, word_count, time_used_seconds, created_at)
       VALUES(?,?,?,?,?,?,?,?)`,
    )
    .run(id, promptId, testType, task, answer, wordCount, timeUsedSeconds, new Date().toISOString());
  return getWritingSubmission(id)!;
}

export function getWritingSubmission(id: string): WritingSubmissionRow | undefined {
  return getDb()
    .prepare("SELECT * FROM writing_submissions WHERE id = ?")
    .get(id) as unknown as WritingSubmissionRow | undefined;
}

export function listWritingSubmissions(limit = 50): WritingSubmissionRow[] {
  return getDb()
    .prepare("SELECT * FROM writing_submissions ORDER BY created_at DESC LIMIT ?")
    .all(limit) as unknown as WritingSubmissionRow[];
}

export function saveWritingEvaluation(submissionId: string, payload: unknown, model?: string): void {
  getDb()
    .prepare(
      `INSERT INTO writing_evaluations(id, submission_id, payload, model, created_at)
       VALUES(?,?,?,?,?)`,
    )
    .run(randomUUID(), submissionId, JSON.stringify(payload), model ?? null, new Date().toISOString());
}

export function getWritingEvaluation(submissionId: string): unknown | undefined {
  const row = getDb()
    .prepare("SELECT payload FROM writing_evaluations WHERE submission_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(submissionId) as { payload?: string } | undefined;
  if (!row?.payload) return undefined;
  try {
    return JSON.parse(row.payload);
  } catch {
    return undefined;
  }
}

// ---------- Speaking ----------
export function createSpeakingSession(mode: string, part: number | null, topic: string | null) {
  const id = randomUUID();
  getDb()
    .prepare(
      "INSERT INTO speaking_sessions(id, mode, part, topic, created_at) VALUES(?,?,?,?,?)",
    )
    .run(id, mode, part, topic, new Date().toISOString());
  return id;
}

export function addSpeakingRecording(
  sessionId: string,
  part: number,
  prompt: string,
  audioUrl: string | null,
  durationSeconds: number | null,
) {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO speaking_recordings(id, session_id, part, prompt, audio_url, duration_seconds, created_at)
       VALUES(?,?,?,?,?,?,?)`,
    )
    .run(id, sessionId, part, prompt, audioUrl, durationSeconds, new Date().toISOString());
  return id;
}

export function addSpeakingTranscript(
  recordingId: string,
  text: string,
  source: string,
  metrics?: unknown,
) {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO speaking_transcripts(id, recording_id, text, source, metrics, created_at)
       VALUES(?,?,?,?,?,?)`,
    )
    .run(id, recordingId, text, source, metrics ? JSON.stringify(metrics) : null, new Date().toISOString());
  return id;
}

export function saveSpeakingEvaluation(sessionId: string, recordingId: string | null, payload: unknown, model?: string) {
  getDb()
    .prepare(
      `INSERT INTO speaking_evaluations(id, session_id, recording_id, payload, model, created_at)
       VALUES(?,?,?,?,?,?)`,
    )
    .run(randomUUID(), sessionId, recordingId, JSON.stringify(payload), model ?? null, new Date().toISOString());
}

// ---------- Mock exams ----------
export function createMockAttempt(kind: string, testType: string): string {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO mock_attempts(id, kind, test_type, status, started_at, state)
       VALUES(?,?,?,'in_progress',?,?)`,
    )
    .run(id, kind, testType, new Date().toISOString(), "{}");
  return id;
}

export function getMockAttempt(id: string) {
  return getDb().prepare("SELECT * FROM mock_attempts WHERE id = ?").get(id) as
    | {
        id: string;
        kind: string;
        test_type: string;
        status: string;
        started_at: string;
        completed_at: string | null;
        state: string;
        overall_band: number | null;
      }
    | undefined;
}

export function updateMockState(id: string, state: Record<string, unknown>): void {
  getDb()
    .prepare("UPDATE mock_attempts SET state = ? WHERE id = ?")
    .run(JSON.stringify(state), id);
}

export function completeMockAttempt(id: string, overallBand: number): void {
  getDb()
    .prepare("UPDATE mock_attempts SET status='completed', completed_at=?, overall_band=? WHERE id=?")
    .run(new Date().toISOString(), overallBand, id);
}

export function listMockAttempts(): {
  id: string;
  kind: string;
  test_type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  overall_band: number | null;
}[] {
  return getDb()
    .prepare("SELECT * FROM mock_attempts ORDER BY started_at DESC LIMIT 50")
    .all() as {
    id: string;
    kind: string;
    test_type: string;
    status: string;
    started_at: string;
    completed_at: string | null;
    overall_band: number | null;
  }[];
}

// ---------- AI conversations ----------
export function createConversation(kind: string, title?: string): string {
  const id = randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare("INSERT INTO ai_conversations(id, kind, title, created_at, updated_at) VALUES(?,?,?,?,?)")
    .run(id, kind, title ?? null, now, now);
  return id;
}

export function addMessage(conversationId: string, role: string, content: string): void {
  const now = new Date().toISOString();
  getDb()
    .prepare("INSERT INTO ai_messages(id, conversation_id, role, content, created_at) VALUES(?,?,?,?,?)")
    .run(randomUUID(), conversationId, role, content, now);
  getDb()
    .prepare("UPDATE ai_conversations SET updated_at = ? WHERE id = ?")
    .run(now, conversationId);
}

export function listMessages(conversationId: string): { role: string; content: string }[] {
  return getDb()
    .prepare("SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC")
    .all(conversationId) as { role: string; content: string }[];
}

export function listConversations(kind?: string): {
  id: string;
  kind: string;
  title: string | null;
  updated_at: string;
}[] {
  const rows = kind
    ? getDb().prepare("SELECT id, kind, title, updated_at FROM ai_conversations WHERE kind = ? ORDER BY updated_at DESC").all(kind)
    : getDb().prepare("SELECT id, kind, title, updated_at FROM ai_conversations ORDER BY updated_at DESC").all();
  return rows as { id: string; kind: string; title: string | null; updated_at: string }[];
}

// ---------- Study plan ----------
export interface StudyTaskRow {
  id: string;
  title: string;
  category: string;
  scheduled_for: string | null;
  completed: number;
  completed_at: string | null;
  created_at: string;
}

export function listStudyTasks(): StudyTaskRow[] {
  return getDb()
    .prepare("SELECT * FROM study_tasks ORDER BY scheduled_for ASC, created_at ASC")
    .all() as unknown as StudyTaskRow[];
}

export function createStudyTask(title: string, category: string, scheduledFor?: string): StudyTaskRow {
  const id = randomUUID();
  getDb()
    .prepare("INSERT INTO study_tasks(id, title, category, scheduled_for, completed, created_at) VALUES(?,?,?,?,0,?)")
    .run(id, title, category, scheduledFor ?? null, new Date().toISOString());
  return getDb().prepare("SELECT * FROM study_tasks WHERE id = ?").get(id) as unknown as StudyTaskRow;
}

export function updateStudyTask(id: string, patch: Partial<StudyTaskRow>): void {
  const existing = getDb().prepare("SELECT * FROM study_tasks WHERE id = ?").get(id) as unknown as StudyTaskRow | undefined;
  if (!existing) return;
  const next = { ...existing, ...patch };
  getDb()
    .prepare("UPDATE study_tasks SET title=?, category=?, scheduled_for=?, completed=?, completed_at=? WHERE id=?")
    .run(
      next.title,
      next.category,
      next.scheduled_for,
      next.completed,
      next.completed ? new Date().toISOString() : null,
      id,
    );
}

export function deleteStudyTask(id: string): void {
  getDb().prepare("DELETE FROM study_tasks WHERE id = ?").run(id);
}

// ---------- Imported materials ----------
export interface ImportedMaterialRow {
  id: string;
  title: string;
  skill: string;
  test_type: string;
  source_type: string;
  source_name: string | null;
  source_reference: string | null;
  license: string | null;
  copyright_status: string | null;
  format: string;
  content: string | null;
  file_path: string | null;
  meta: string;
  created_at: string;
}

export function createImportedMaterial(input: {
  title: string;
  skill: string;
  testType: string;
  sourceType: string;
  sourceName?: string;
  sourceReference?: string;
  license?: string;
  copyrightStatus?: string;
  format: string;
  content?: string;
  filePath?: string;
}): ImportedMaterialRow {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO imported_materials(id, title, skill, test_type, source_type, source_name,
        source_reference, license, copyright_status, format, content, file_path, meta, created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      id,
      input.title,
      input.skill,
      input.testType,
      input.sourceType,
      input.sourceName ?? null,
      input.sourceReference ?? null,
      input.license ?? null,
      input.copyrightStatus ?? null,
      input.format,
      input.content ?? null,
      input.filePath ?? null,
      "{}",
      new Date().toISOString(),
    );
  return getImportedMaterial(id)!;
}

export function getImportedMaterial(id: string): ImportedMaterialRow | undefined {
  return getDb().prepare("SELECT * FROM imported_materials WHERE id = ?").get(id) as
    | ImportedMaterialRow
    | undefined;
}

export function listImportedMaterials(): ImportedMaterialRow[] {
  return getDb()
    .prepare("SELECT * FROM imported_materials ORDER BY created_at DESC")
    .all() as unknown as ImportedMaterialRow[];
}

// ---------- Analytics aggregates ----------
export function practiceStats(): {
  totalAttempts: number;
  bySkill: Record<string, { attempts: number; avgAccuracy: number }>;
  recent: PracticeAttemptRow[];
} {
  const attempts = listPracticeAttempts(500);
  const completed = attempts.filter((a) => a.completed_at);
  const bySkill: Record<string, { attempts: number; avgAccuracy: number }> = {};
  for (const a of completed) {
    const qa = getQuestionAttempts(a.id);
    const acc = qa.length ? qa.filter((q) => q.correct).length / qa.length : 0;
    const entry = bySkill[a.skill] ?? { attempts: 0, avgAccuracy: 0 };
    entry.attempts += 1;
    entry.avgAccuracy = (entry.avgAccuracy * (entry.attempts - 1) + acc) / entry.attempts;
    bySkill[a.skill] = entry;
  }
  return { totalAttempts: attempts.length, bySkill, recent: attempts.slice(0, 10) };
}

export function questionTypeStats(): { questionType: string; correct: number; total: number; avgTime: number }[] {
  const rows = getDb()
    .prepare(
      `SELECT q.question_id, q.correct, q.time_spent_seconds, p.skill
       FROM question_attempts q JOIN practice_attempts p ON p.id = q.attempt_id
       WHERE p.completed_at IS NOT NULL`,
    )
    .all() as { question_id: string; correct: number; time_spent_seconds: number | null }[];
  // question type needs content lookup; returned raw here, aggregated by caller
  const map = new Map<string, { correct: number; total: number; timeSum: number; timeCount: number }>();
  for (const r of rows) {
    const key = r.question_id;
    const e = map.get(key) ?? { correct: 0, total: 0, timeSum: 0, timeCount: 0 };
    e.total += 1;
    e.correct += r.correct;
    if (r.time_spent_seconds != null) {
      e.timeSum += r.time_spent_seconds;
      e.timeCount += 1;
    }
    map.set(key, e);
  }
  return [...map.entries()].map(([questionType, v]) => ({
    questionType,
    correct: v.correct,
    total: v.total,
    avgTime: v.timeCount ? Math.round(v.timeSum / v.timeCount) : 0,
  }));
}
