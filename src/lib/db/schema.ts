// SQLite schema (via node:sqlite). Local-first; swap for Postgres/Supabase later.

export const SCHEMA_VERSION = 1;

export const SCHEMA_SQL = /* sql */ `
-- Study profile (single-user local-first)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started | in_progress | completed
  updated_at TEXT NOT NULL
);

-- Vocabulary + FSRS scheduling
CREATE TABLE IF NOT EXISTS vocabulary_cards (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  lemma TEXT,
  part_of_speech TEXT,
  chinese_meaning TEXT,
  english_definition TEXT,
  ipa TEXT,
  example TEXT,
  ielts_example TEXT,
  collocations TEXT, -- JSON array
  synonyms TEXT,     -- JSON array
  antonyms TEXT,     -- JSON array
  word_family TEXT,  -- JSON array
  common_mistakes TEXT,
  source_context TEXT,
  personal_note TEXT,
  source_skill TEXT,
  fsrs_state TEXT,   -- JSON card state from ts-fsrs
  due_at TEXT,
  created_at TEXT NOT NULL,
  last_review_at TEXT
);

CREATE TABLE IF NOT EXISTS vocabulary_reviews (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  rating TEXT NOT NULL, -- again | hard | good | easy
  reviewed_at TEXT NOT NULL,
  previous_state TEXT,
  next_state TEXT
);

-- Practice attempts
CREATE TABLE IF NOT EXISTS practice_attempts (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  test_type TEXT NOT NULL,
  mode TEXT NOT NULL, -- practice | exam
  started_at TEXT NOT NULL,
  completed_at TEXT,
  raw_score INTEGER,
  band_score REAL,
  answers TEXT NOT NULL DEFAULT '{}', -- JSON questionId -> answer
  time_spent_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS question_attempts (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  user_answer TEXT,
  correct INTEGER,
  time_spent_seconds INTEGER,
  flagged INTEGER DEFAULT 0
);

-- Mistakes
CREATE TABLE IF NOT EXISTS mistakes (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL, -- reading | listening | writing | speaking | vocabulary | grammar | mock
  skill TEXT NOT NULL,
  question TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  mistake_type TEXT,
  explanation TEXT,
  question_type TEXT,
  created_at TEXT NOT NULL,
  recurrence_count INTEGER DEFAULT 1,
  mastery TEXT DEFAULT 'new', -- new | learning | reviewing | mastered
  last_reviewed_at TEXT
);

-- Writing
CREATE TABLE IF NOT EXISTS writing_submissions (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  test_type TEXT NOT NULL,
  task INTEGER NOT NULL,
  answer TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  time_used_seconds INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS writing_evaluations (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON WritingEvaluation
  model TEXT,
  created_at TEXT NOT NULL
);

-- Speaking
CREATE TABLE IF NOT EXISTS speaking_sessions (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL, -- practice | exam
  part INTEGER,
  topic TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS speaking_recordings (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  part INTEGER,
  prompt TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS speaking_transcripts (
  id TEXT PRIMARY KEY,
  recording_id TEXT NOT NULL,
  text TEXT NOT NULL,
  source TEXT NOT NULL, -- stt | manual
  metrics TEXT, -- JSON TranscriptMetrics
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS speaking_evaluations (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  recording_id TEXT,
  payload TEXT NOT NULL, -- JSON SpeakingEvaluation
  model TEXT,
  created_at TEXT NOT NULL
);

-- Mock exams
CREATE TABLE IF NOT EXISTS mock_attempts (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL, -- academic_full | general_full | listening | reading | writing | speaking | custom
  test_type TEXT NOT NULL,
  status TEXT NOT NULL, -- in_progress | completed
  started_at TEXT NOT NULL,
  completed_at TEXT,
  state TEXT NOT NULL DEFAULT '{}', -- JSON: section progress, answers, timers
  overall_band REAL
);

CREATE TABLE IF NOT EXISTS mock_sections (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  raw_score INTEGER,
  band_score REAL,
  answers TEXT NOT NULL DEFAULT '{}',
  time_spent_seconds INTEGER
);

-- AI conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL, -- coach | speaking_examiner
  title TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL, -- user | assistant | system
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Study plan
CREATE TABLE IF NOT EXISTS study_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- daily | weekly | review | mock | writing | speaking | vocabulary | grammar | reading | listening
  scheduled_for TEXT,
  completed INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT NOT NULL
);

-- Imported materials (text-based; binary files referenced by path, gitignored)
CREATE TABLE IF NOT EXISTS imported_materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  skill TEXT NOT NULL,
  test_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_name TEXT,
  source_reference TEXT,
  license TEXT,
  copyright_status TEXT,
  format TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  meta TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_attempts_attempt ON question_attempts(attempt_id);
CREATE INDEX IF NOT EXISTS idx_vocab_due ON vocabulary_cards(due_at);
CREATE INDEX IF NOT EXISTS idx_mistakes_skill ON mistakes(skill);
CREATE INDEX IF NOT EXISTS idx_study_tasks_due ON study_tasks(scheduled_for);
`;
