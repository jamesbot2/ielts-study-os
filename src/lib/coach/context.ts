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
import { allPracticeSets } from "@/lib/content/practice";
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
  accuracy: number; // correct questions / total questions (0..1)
  avgBand: number;
}

export interface PracticeContext {
  recentAttempts: { id: string; skill: string; band: number | null; rawScore: number | null; total: number | null; startedAt: string }[];
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
  commonTags: string[];
  weakTags: string[];
  sources: string[];
}

export interface MockContext {
  completed: { id: string; kind: string; gradedAverage: number | null; status: string; startedAt: string }[];
  listeningTrend: number[];
  readingTrend: number[];
}

export interface WritingContext {
  recent: { id: string; promptId: string; testType: string; task: number; wordCount: number; createdAt: string; bands: number[] }[];
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
  next7DaysEstimatedMinutes: number;
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

// Resolve questionId → question type from the canonical practice-set registry.
// Matching items persist with composite ids `${questionId}::${itemId}` and must
// map to the parent question type (never "unknown").
function buildQuestionTypeMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const set of allPracticeSets) {
    for (const q of set.questions) {
      map.set(q.id, q.type);
      if (q.answerType === "matching" || q.answerType === "heading_matching") {
        for (const item of q.items) map.set(`${q.id}::${item.id}`, q.type);
      }
    }
  }
  return map;
}

interface WritingEvalLike {
  criterionScores?: Array<{ criterion: string; band: number }> | Record<string, number>;
}
interface SpeakingEvalLike {
  criterionScores?: Array<{ criterion: string; band: number; supported?: boolean }> | Record<string, number>;
  weaknesses?: string[];
  grammarIssues?: string[];
  weakestCriterion?: string;
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
  const questionTypeMap = buildQuestionTypeMap();
  // listPracticeAttempts is already newest-first (orderBy startedAt reverse).
  const completedAttempts = attempts.filter((a) => a.completedAt).slice(0, CONTEXT_BOUNDS.recentAttempts);
  const accuracyBySkill: Record<string, SkillAccuracy> = {};
  const skillAcc: Record<string, { attempts: number; correct: number; total: number; bandSum: number; bandCount: number }> = {};
  const typeWrong: Record<string, number> = {};
  const typeTotal: Record<string, number> = {};
  const recentAttempts: PracticeContext["recentAttempts"] = [];

  for (const a of completedAttempts) {
    const qas = await getQuestionAttempts(a.id);
    const correct = qas.filter((q) => q.correct === 1).length;
    const total = qas.length;
    const skill = a.skill;
    const s = skillAcc[skill] ?? { attempts: 0, correct: 0, total: 0, bandSum: 0, bandCount: 0 };
    s.attempts += 1;
    s.correct += correct;
    s.total += total;
    if (typeof a.band === "number") {
      s.bandSum += a.band;
      s.bandCount += 1;
    }
    skillAcc[skill] = s;
    recentAttempts.push({ id: a.id, skill: a.skill, band: a.band, rawScore: a.rawScore, total, startedAt: a.startedAt });

    for (const q of qas) {
      const type = questionTypeMap.get(q.questionId) ?? "unknown";
      typeTotal[type] = (typeTotal[type] ?? 0) + 1;
      if (q.correct !== 1) typeWrong[type] = (typeWrong[type] ?? 0) + 1;
    }
  }
  for (const [skill, s] of Object.entries(skillAcc)) {
    accuracyBySkill[skill] = {
      attempts: s.attempts,
      accuracy: s.total > 0 ? s.correct / s.total : 0,
      avgBand: s.bandCount > 0 ? s.bandSum / s.bandCount : 0,
    };
  }
  const weakQuestionTypes = Object.entries(typeWrong)
    .filter(([t]) => t !== "unknown")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t]) => t);
  const frequentIncorrectTypes = Object.entries(typeWrong)
    .filter(([t]) => t !== "unknown" && (typeTotal[t] ?? 0) > 0)
    .sort((a, b) => (b[1] / (typeTotal[b[0]] || 1)) - (a[1] / (typeTotal[a[0]] || 1)))
    .slice(0, 6)
    .map(([t]) => t);

  // ---- Mistakes ----
  // listMistakes returns newest-first; keep chronological ordering explicit via sort.
  const activeMistakes = [...mistakes]
    .filter((m) => m.mastery !== "mastered")
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
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
  const weakTagCounts: Record<string, number> = {};
  const srcSet = new Set<string>();
  for (const c of cards) {
    for (const tag of c.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    // Weakness = FSRS evidence (lapses or high difficulty), not mere frequency.
    const fsrs = c.fsrs as { lapses?: number; difficulty?: number } | null;
    const isWeak = fsrs && ((fsrs.lapses ?? 0) > 0 || (fsrs.difficulty ?? 0) >= 7);
    if (isWeak) for (const tag of c.tags) weakTagCounts[tag] = (weakTagCounts[tag] ?? 0) + 1;
    if (c.source?.providerId) srcSet.add(c.source.providerId);
  }
  const commonTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const weakTags = Object.entries(weakTagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  // ---- Mocks ----
  // listMockAttempts is newest-first.
  const completedMocks = mocks.filter((m) => m.status === "completed").slice(0, CONTEXT_BOUNDS.recentMocks);
  const listeningTrend: number[] = [];
  const readingTrend: number[] = [];
  for (const m of completedMocks) {
    const sections = (m.state?.sections ?? {}) as { listening?: { band?: number }; reading?: { band?: number } };
    if (m.kind === "listening" && m.gradedAverage != null) listeningTrend.push(m.gradedAverage);
    else if (m.kind === "reading" && m.gradedAverage != null) readingTrend.push(m.gradedAverage);
    else if (m.kind === "full") {
      if (typeof sections.listening?.band === "number") listeningTrend.push(sections.listening.band);
      if (typeof sections.reading?.band === "number") readingTrend.push(sections.reading.band);
    }
  }

  // ---- Writing ----
  const writingSorted = [...writing].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const recentWriting = writingSorted.slice(0, CONTEXT_BOUNDS.recentWriting).map((w) => {
    const bands = extractWritingBands(w.evaluation);
    return { id: w.id, promptId: w.promptId, testType: w.testType, task: w.task, wordCount: w.wordCount, createdAt: w.createdAt, bands };
  });
  const writingWeakCounts: Record<string, number> = {};
  for (const w of writingSorted.slice(0, CONTEXT_BOUNDS.recentWriting)) {
    const ev = w.evaluation as WritingEvalLike | null;
    const scores = ev?.criterionScores;
    if (Array.isArray(scores) && scores.length > 0) {
      const lowest = [...scores].sort((a, b) => a.band - b.band)[0];
      if (lowest) writingWeakCounts[lowest.criterion] = (writingWeakCounts[lowest.criterion] ?? 0) + 1;
    }
  }
  const repeatedWeaknesses = Object.entries(writingWeakCounts)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([c]) => c);

  // ---- Speaking ----
  const speakingSorted = [...speaking].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const recentParts = speakingSorted.slice(0, CONTEXT_BOUNDS.recentSpeaking).map((s) => s.part);
  const evaluatedCriteria = new Set<string>();
  const issueCounts: Record<string, number> = {};
  let hasTranscript = false;
  for (const s of speakingSorted.slice(0, CONTEXT_BOUNDS.recentSpeaking)) {
    if (s.transcript) hasTranscript = true;
    const ev = s.evaluation as SpeakingEvalLike | null;
    const scores = ev?.criterionScores;
    if (Array.isArray(scores)) {
      for (const sc of scores) {
        // Pronunciation is only "evaluated" when actually supported.
        if (sc.criterion === "pronunciation" && sc.supported !== true) continue;
        if (sc.supported === false) continue;
        evaluatedCriteria.add(sc.criterion);
      }
    }
    for (const issue of [...(ev?.grammarIssues ?? []), ...(ev?.weaknesses ?? []), ...(ev?.weakestCriterion ? [ev.weakestCriterion] : [])]) {
      const key = issue.slice(0, 120);
      issueCounts[key] = (issueCounts[key] ?? 0) + 1;
    }
  }
  const repeatedIssues = Object.entries(issueCounts)
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([i]) => i);

  // ---- Study plan ----
  const today = new Date();
  const todayStr = toDateKey(today);
  const todayTasks = tasks.filter((t) => t.scheduledFor?.slice(0, 10) === todayStr);
  const plus7 = new Date(today);
  plus7.setDate(today.getDate() + CONTEXT_BOUNDS.studyDays);
  const plus7Str = toDateKey(plus7);
  // True next-7-days window: today <= scheduledFor < today + 7.
  const nextDays = tasks
    .filter((t) => !t.completedAt && t.scheduledFor && t.scheduledFor.slice(0, 10) >= todayStr && t.scheduledFor.slice(0, 10) < plus7Str)
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
  const overdue = tasks.filter((t) => !t.completedAt && t.scheduledFor && t.scheduledFor.slice(0, 10) < todayStr).length;
  const categoryDistribution: Record<string, number> = {};
  let next7Minutes = 0;
  for (const t of nextDays) {
    categoryDistribution[t.category] = (categoryDistribution[t.category] ?? 0) + 1;
    next7Minutes += t.estimatedMinutes ?? 0;
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
    practice: { recentAttempts, accuracyBySkill, weakQuestionTypes, frequentIncorrectTypes },
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
      commonTags,
      weakTags,
      sources: [...srcSet],
    },
    mocks: {
      completed: completedMocks.map((m) => ({
        id: m.id, kind: m.kind, gradedAverage: m.gradedAverage, status: m.status, startedAt: m.startedAt,
      })),
      listeningTrend,
      readingTrend,
    },
    writing: { recent: recentWriting, repeatedWeaknesses },
    speaking: {
      recentParts,
      totalTurns: speaking.length,
      hasTranscript,
      evaluatedCriteria: [...evaluatedCriteria],
      repeatedIssues,
    },
    studyPlan: {
      today: todayTasks.map((t) => ({ title: t.title, completed: t.completedAt != null, href: t.href })),
      completedToday: todayTasks.filter((t) => t.completedAt).length,
      nextDays: nextDays.map((t) => ({ title: t.title, scheduledFor: t.scheduledFor, completed: t.completedAt != null })),
      overdue,
      categoryDistribution,
      next7DaysEstimatedMinutes: next7Minutes,
    },
    page,
  };
}

function extractWritingBands(evaluation: unknown): number[] {
  if (!evaluation) return [];
  const scores = (evaluation as WritingEvalLike).criterionScores;
  if (Array.isArray(scores)) return scores.map((s) => s.band).filter((b): b is number => typeof b === "number");
  if (scores && typeof scores === "object") return Object.values(scores).filter((b): b is number => typeof b === "number");
  return [];
}

function countBy(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = ((r as Record<string, unknown>)[key] as string) ?? "unknown";
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Estimated serialized size guard (used in tests to prove the snapshot is bounded).
export function estimateSnapshotSize(snapshot: LearnerContextSnapshot): number {
  return JSON.stringify(snapshot).length;
}
