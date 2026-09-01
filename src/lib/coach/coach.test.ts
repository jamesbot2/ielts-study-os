import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/storage/db";
import { parseCoachNdjson, reduceCoachEvents } from "./stream";
import { isAllowedInternalHref, sanitizeActionHref } from "./links";
import { recommendNextActivity } from "./recommend";
import { buildLearnerContextSnapshot, estimateSnapshotSize, CONTEXT_BOUNDS } from "./context";
import { createConversation, listConversations, deleteConversation, addMessage, listMessages, renameConversation } from "@/lib/storage/repository";
import type { LearnerContextSnapshot } from "./context";

beforeEach(async () => {
  await resetDb();
});

describe("coach stream parser", () => {
  it("parses NDJSON events and reduces deltas/citations/actions", () => {
    const events = parseCoachNdjson(
      [
        '{"type":"delta","text":"Hello "}',
        '{"type":"delta","text":"world"}',
        '{"type":"citation","citation":{"id":"c1","sourceId":"s1","title":"IELTS.org"}}',
        '{"type":"action_proposal","action":{"type":"create_study_task","title":"Do Reading"}}',
        '{"type":"done"}',
        "garbage line",
      ].join("\n"),
    );
    expect(events.length).toBe(5); // malformed line skipped
    const acc = reduceCoachEvents(events);
    expect(acc.text).toBe("Hello world");
    expect(acc.citations.length).toBe(1);
    expect(acc.actions.length).toBe(1);
  });
});

describe("internal link validation", () => {
  it("allows known internal paths only", () => {
    expect(isAllowedInternalHref("/learn/reading")).toBe(true);
    expect(isAllowedInternalHref("/practice")).toBe(true);
    expect(isAllowedInternalHref("/mistakes")).toBe(true);
    expect(isAllowedInternalHref("https://evil.com")).toBe(false);
    expect(isAllowedInternalHref("javascript:alert(1)")).toBe(false);
    expect(isAllowedInternalHref("//evil.com")).toBe(false);
    expect(isAllowedInternalHref("/etc/passwd")).toBe(false);
  });
  it("sanitizes action hrefs", () => {
    expect(sanitizeActionHref("javascript:alert(1)")).toBeNull();
    expect(sanitizeActionHref("/vocabulary")).toBe("/vocabulary");
  });
});

describe("recommend next activity", () => {
  const base: LearnerContextSnapshot = {
    generatedAt: "",
    profile: { testType: "academic", currentBand: 5, targetBand: 6.5, targetListening: 6.5, targetReading: 6.5, targetWriting: 6, targetSpeaking: 6.5, testDate: null, weeklyHours: 6, weakestSkills: ["reading"], takenBefore: false },
    lessons: { totalApplicable: 10, completed: 2, inProgress: 1, byCategory: {}, recentlyCompleted: [], nextUnfinished: [] },
    practice: { recentAttempts: [], accuracyBySkill: {}, weakQuestionTypes: [], frequentIncorrectTypes: [] },
    mistakes: { totalActive: 0, bySkill: {}, byQuestionType: {}, recurring: [], recent: [] },
    vocabulary: { total: 0, dueNow: 0, reviewedRecently: 0, lowRepetition: 0, commonTags: [], weakTags: [], sources: [] },
    mocks: { completed: [], listeningTrend: [], readingTrend: [] },
    writing: { recent: [], repeatedWeaknesses: [] },
    speaking: { recentParts: [], totalTurns: 0, hasTranscript: false, evaluatedCriteria: [], repeatedIssues: [] },
    studyPlan: { today: [], completedToday: 0, nextDays: [], overdue: 0, categoryDistribution: {}, next7DaysEstimatedMinutes: 0 },
  };

  it("recommends diagnostic when nothing is known", () => {
    const recs = recommendNextActivity(base);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some((r) => r.href === "/practice")).toBe(true);
  });

  it("prioritizes due vocabulary and weak reading", () => {
    const recs = recommendNextActivity({
      ...base,
      vocabulary: { ...base.vocabulary, dueNow: 20 },
      practice: { ...base.practice, accuracyBySkill: { reading: { attempts: 5, accuracy: 0.55, avgBand: 5 } } },
    });
    expect(recs.some((r) => r.type === "open_vocabulary")).toBe(true);
    expect(recs.some((r) => r.href === "/practice/reading")).toBe(true);
  });
});

describe("learner context snapshot", () => {
  it("builds a bounded snapshot on an empty database", async () => {
    const snapshot = await buildLearnerContextSnapshot();
    expect(snapshot.profile.testType).toBe("academic");
    expect(snapshot.mistakes.recent.length).toBeLessThanOrEqual(CONTEXT_BOUNDS.recentMistakes);
    const size = estimateSnapshotSize(snapshot);
    expect(size).toBeLessThan(20_000); // small on empty DB
  });
});

describe("conversation persistence", () => {
  it("creates, lists, renames and deletes conversations with messages", async () => {
    const id = await createConversation("coach", "Reading help");
    await addMessage(id, "user", "How do I improve TFNG?");
    await addMessage(id, "assistant", "Focus on paraphrasing.", {
      citations: [{ id: "c1", sourceId: "s1", title: "IELTS.org" }],
    });
    const cs = await listConversations("coach");
    expect(cs.length).toBe(1);
    const msgs = await listMessages(id);
    expect(msgs.length).toBe(2);
    expect(msgs[1].citations?.[0].title).toBe("IELTS.org");

    await renameConversation(id, "TFNG strategy");
    expect((await listConversations("coach"))[0].title).toBe("TFNG strategy");

    await deleteConversation(id);
    expect(await listConversations("coach")).toHaveLength(0);
  });
});
