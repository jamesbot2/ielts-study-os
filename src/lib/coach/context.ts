// LearnerContextSnapshot: a bounded, purpose-specific summary of the learner's
// local IndexedDB state, built right before each Coach request.
//
// Privacy rules:
// - Never include audio blobs, recordings, full essays, full lesson text, or
//   provider secrets.
// - Everything is summarized and capped.
// - The snapshot is rebuilt per request, never persisted as a chat message.

import {
  getProfile,
  getLessonProgress,
  listPracticeAttempts,
  getQuestionAttempts,
  listMistakes,
  listVocabCards,
  getDueVocabCards,
  listMockAttempts,
  listWritingSubmissions,
  listSpeakingTurns,
  listStudyTasks,
} from "@/lib/storage/repository";
import { allLessons } from "@/lib/content/curriculum";
import type { Skill, TestType } from "@/types/ielts";

// ---- Bounds (size budget) ----
export const CONTEXT_BOUNDS = {
  recentAttempts: 20,
  recentMistakes: 20,
  recentMocks: 10,
  recentWriting: 5,
  recentSpeaking: 10,
  studyDays: 7,
} as const;

export interface ProfileContext {
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
}

export interface LessonProgressContext {
  totalApplicable: number;
  completed: number;
  inProgress: number;
  byCategory: Record<string, { completed: number; total: number }>;
  recentlyCompleted: string[];
  nextUnfinished: string[];
}

export interface SkillAccuracy {
  attempts: number;
  accuracy: number;
  avgBand: number;
}

export interface PracticeContext {
  recentAttempts: { id: string; skill: string; band: number | null; rawScore: number | null; startedAt: string }[];
  accuracyBySkill: Record<string, SkillAccuracy>;
  weakQuestionTypes: string[];
  frequentIncorrectTypes: string[];
}

export interface MistakeContext {
  totalActive: number;
  bySkill: Record<string, number>;
  byQuestionType: Record<string, number>;
  recurring: { id: string; skill: string; questionType: string | null; question: string | null; recurrenceCount: number; mastery: string }[];
  recent: { id: string; skill: string; questionType: string | null; question: string | null }[];
}

export interface VocabularyContext {
  total: number;
  dueNow: number;
  reviewedRecently: number;
  lowRepetition: number;
  weakTags: string[];
  sources: string[];
}

export interface MockContext {
  completed: { id: string; kind: string; gradedAverage: number | null; status: string; startedAt: string }[];
  listeningTrend: number[];
  readingTrend: number[];
}

export interface WritingContext {
  recent: { id: string; promptId: string; testType: string; task: number; wordCount: number; createdAt: string; bands: number[] | null }[];
  repeatedWeaknesses: string[];
}

export interface SpeakingContext {
  recentParts: number[];
  totalTurns: number;
  hasTranscript: boolean;
  evaluatedCriteria: string[];
  repeatedIssues: string[];
}

export interface StudyPlanContext {
  today: { title: string; completed: boolean; href: string | null }[];
  completedToday: number;
  nextDays: { title: string; scheduledFor: string | null; completed: boolean }[];
  overdue: number;
  categoryDistribution: Record<string, number>;
  estimatedMinutes: number;
}

export interface PageContext {
  route: string;
  kind?: "lesson" | "practice" | "writing" | "mistake" | "vocabulary" | "speaking";
  lessonId?: string;
  practiceSetId?: string;
  questionId?: string;
  questionType?: string;
  question?: string;
  userAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
  writingPromptId?: string;
  speakingPrompt?: string;
  vocabularyWord?: string;
  mistakeId?: string;
}

export interface LearnerContextSnapshot {
  generatedAt: string;
  profile: ProfileContext;
  lessons: LessonProgressContext;
  practice: PracticeContext;
  mistakes: MistakeContext;
  vocabulary: VocabularyContext;
  mocks: MockContext;
  writing: WritingContext;
  speaking: SpeakingContext;
  studyPlan: StudyPlanContext;
  page?: PageContext;
}

function skillAccuracy(rows: { skill: string; correct: number; band: number | null }[]): Record<string, SkillAccuracy> {
  const out: Record<string, SkillAccuracy> = {};
  for (const r of rows) {
    const e = out[r.skill] ?? { attempts: 0, accuracy: 0, avgBand: 0 };
    e.attempts += 1;
    e.accuracy = (e.accuracy * (e.attempts - 1) + r.correct) / e.attempts;
    e.avgBand = (e.avgBand * (e.attempts - 1) + (r.band ?? 0)) / e.attempts;
    out[r.skill] = e;
  }
  return out;
}

export async function buildLearnerContextSnapshot(page?: PageContext): Promise<LearnerContextSnapshot> {
  const profile = await getProfile();
  const [progress, attempts, mistakes, cards, due, mocks, writing, speaking, tasks] = await Promise.all([
    getLessonProgress(),
    listPracticeAttempts(500),
    listMistakes(),
    listVocabCards(),
    getDueVocabCards(),
    listMockAttempts(),
    listWritingSubmissions(50),
    listSpeakingTurns(),
    listStudyTasks(),
  ]);

  // ---- Lessons ----
  const applicable = allLessons.filter((l) => l.testType === "both" || l.testType === profile.testType);
  const byCategory: Record<string, { completed: number; total: number }> = {};
  const completedLessons: string[] = [];
  const unfinished: string[] = [];
  for (const l of applicable) {
    const c = byCategory[l.category] ?? { completed: 0, total: 0 };
    c.total += 1;
    const status = progress[l.id] ?? "not_started";
    if (status === "completed") {
      c.completed += 1;
      completedLessons.push(l.id);
    } else {
      unfinished.push(l.id);
    }
    byCategory[l.category] = c;
  }
  const recentlyCompleted = [...completedLessons].reverse().slice(0, 5);

  // ---- Practice ----
  const completedAttempts = attempts.filter((a) => a.completedAt);
  const qaRows: { skill: string; correct: number; band: number | null }[] = [];
  const qTypeCounts: Record<string, number> = {};
  const qTypeWrong: Record<string, number> = {};
  for (const a of completedAttempts.slice(0, CONTEXT_BOUNDS.recentAttempts)) {
    const qas = await getQuestionAttempts(a.id);
    const correct = qas.filter((q) => q.correct === 1).length;
    qaRows.push({ skill: a.skill, correct, band: a.band });
    for (const q of qas) {
      const t = (q.questionId || "unknown");
      qTypeCounts[t] = (qTypeCounts[t] ?? 0) + 1;
      if (q.correct !== 1) qTypeWrong[t] = (qTypeWrong[t] ?? 0) + 1;
    }
  }
  const weakQuestionTypes = Object.entries(qTypeWrong)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t]) => t);
  const frequentIncorrectTypes = Object.entries(qTypeWrong)
    .sort((a, b) => (b[1] / (qTypeCounts[b[0]] || 1)) - (a[1] / (qTypeCounts[a[0]] || 1)))
    .slice(0, 6)
    .map(([t]) => t);

  // ---- Mistakes ----
  const activeMistakes = mistakes.filter((m) => m.mastery !== "mastered");
  const recurring = activeMistakes
    .filter((m) => m.recurrenceCount > 1)
    .sort((a, b) => b.recurrenceCount - a.recurrenceCount)
    .slice(0, CONTEXT_BOUNDS.recentMistakes)
    .map((m) => ({
      id: m.id,
      skill: m.skill,
      questionType: m.questionType,
      question: m.question ? m.question.slice(0, 200) : null,
      recurrenceCount: m.recurrenceCount,
      mastery: m.mastery,
    }));

  // ---- Vocabulary ----
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const reviewedRecently = cards.filter((c) => c.lastReviewedAt && new Date(c.lastReviewedAt).getTime() > weekAgo).length;
  const lowRepetition = cards.filter((c) => c.fsrs && c.fsrs.reps < 3).length;
  const tagCounts: Record<string, number> = {};
  const srcSet = new Set<string>();
  for (const c of cards) {
    for (const tag of c.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    if (c.source?.providerId) srcSet.add(c.source.providerId);
  }
  const weakTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  // ---- Mocks ----
  const completedMocks = mocks.filter((m) => m.status === "completed");
  const listeningTrend = completedMocks.filter((m) => m.kind === "listening").slice(0, 10).map((m) => m.gradedAverage ?? 0);
  const readingTrend = completedMocks.filter((m) => m.kind === "reading").slice(0, 10).map((m) => m.gradedAverage ?? 0);

  // ---- Writing ----
  const recentWriting = writing.slice(0, CONTEXT_BOUNDS.recentWriting).map((w) => {
    const ev = w.evaluation as { criterionScores?: Record<string, number> } | null;
    const bands = ev?.criterionScores ? Object.values(ev.criterionScores).filter((v): v is number => typeof v === "number") : null;
    return { id: w.id, promptId: w.promptId, testType: w.testType, task: w.task, wordCount: w.wordCount, createdAt: w.createdAt, bands };
  });
  const writingWeak: string[] = [];
  for (const w of writing.slice(0, CONTEXT_BOUNDS.recentWriting)) {
    const ev = w.evaluation as { criterionScores?: Record<string, number> } | null;
    if (ev?.criterionScores) {
      const lowest = Object.entries(ev.criterionScores).sort((a, b) => a[1] - b[1])[0];
      if (lowest) writingWeak.push(lowest[0]);
    }
  }
  const repeatedWeaknesses = [...new Set(writingWeak)].slice(0, 4);

  // ---- Speaking ----
  const recentParts = speaking.slice(0, CONTEXT_BOUNDS.recentSpeaking).map((s) => s.part);
  const speakingEvaluated = speaking.filter((s) => s.evaluation).length;
  const repeatedIssues: string[] = [];

  // ---- Study plan ----
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.scheduledFor?.slice(0, 10) === today);
  const nextDays = tasks
    .filter((t) => !t.completedAt)
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""))
    .slice(0, CONTEXT_BOUNDS.studyDays * 3);
  const overdue = tasks.filter((t) => !t.completedAt && t.scheduledFor && t.scheduledFor.slice(0, 10) < today).length;
  const categoryDistribution: Record<string, number> = {};
  let estimatedMinutes = 0;
  for (const t of tasks.filter((t) => !t.completedAt)) {
    categoryDistribution[t.category] = (categoryDistribution[t.category] ?? 0) + 1;
    estimatedMinutes += t.estimatedMinutes ?? 0;
  }

  return {
    generatedAt: new Date().toISOString(),
    profile: {
      testType: profile.testType,
      currentBand: profile.currentBand,
      targetBand: profile.targetBand,
      targetListening: profile.targetListening,
      targetReading: profile.targetReading,
      targetWriting: profile.targetWriting,
      targetSpeaking: profile.targetSpeaking,
      testDate: profile.testDate,
      weeklyHours: profile.weeklyHours,
      weakestSkills: profile.weakestSkills,
      takenBefore: profile.takenBefore,
    },
    lessons: {
      totalApplicable: applicable.length,
      completed: completedLessons.length,
      inProgress: Object.values(progress).filter((s) => s === "in_progress").length,
      byCategory,
      recentlyCompleted,
      nextUnfinished: unfinished.slice(0, 5),
    },
    practice: {
      recentAttempts: completedAttempts.slice(0, CONTEXT_BOUNDS.recentAttempts).map((a) => ({
        id: a.id, skill: a.skill, band: a.band, rawScore: a.rawScore, startedAt: a.startedAt,
      })),
      accuracyBySkill: skillAccuracy(qaRows),
      weakQuestionTypes,
      frequentIncorrectTypes,
    },
    mistakes: {
      totalActive: activeMistakes.length,
      bySkill: countBy(activeMistakes, "skill"),
      byQuestionType: countBy(activeMistakes, "questionType"),
      recurring,
      recent: activeMistakes.slice(0, CONTEXT_BOUNDS.recentMistakes).map((m) => ({
        id: m.id, skill: m.skill, questionType: m.questionType, question: m.question ? m.question.slice(0, 200) : null,
      })),
    },
    vocabulary: {
      total: cards.length,
      dueNow: due.length,
      reviewedRecently,
      lowRepetition,
      weakTags,
      sources: [...srcSet],
    },
    mocks: {
      completed: completedMocks.slice(0, CONTEXT_BOUNDS.recentMocks).map((m) => ({
        id: m.id, kind: m.kind, gradedAverage: m.gradedAverage, status: m.status, startedAt: m.startedAt,
      })),
      listeningTrend,
      readingTrend,
    },
    writing: { recent: recentWriting, repeatedWeaknesses },
    speaking: {
      recentParts,
      totalTurns: speaking.length,
      hasTranscript: speaking.some((s) => s.transcript),
      evaluatedCriteria: speakingEvaluated > 0 ? ["fluency", "lexical", "grammar"] : [],
      repeatedIssues,
    },
    studyPlan: {
      today: todayTasks.map((t) => ({ title: t.title, completed: t.completedAt != null, href: t.href })),
      completedToday: todayTasks.filter((t) => t.completedAt).length,
      nextDays: nextDays.map((t) => ({ title: t.title, scheduledFor: t.scheduledFor, completed: t.completedAt != null })),
      overdue,
      categoryDistribution,
      estimatedMinutes,
    },
    page,
  };
}

function countBy(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = ((r as Record<string, unknown>)[key] as string) ?? "unknown";
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

// Estimated serialized size guard (used in tests to prove the snapshot is bounded).
export function estimateSnapshotSize(snapshot: LearnerContextSnapshot): number {
  return JSON.stringify(snapshot).length;
}
