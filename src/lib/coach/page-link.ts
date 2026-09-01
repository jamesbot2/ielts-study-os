// Build a bounded "Ask Coach" URL with a compact PageContext. Never produce
// unbounded JSON URLs; explicit size limit enforced.

import type { PageContext } from "./context";

const MAX_CONTEXT_BYTES = 4000;

export function coachLink(context: PageContext): string {
  const json = JSON.stringify(context);
  if (json.length > MAX_CONTEXT_BYTES) {
    // Drop large free-text fields rather than emitting a giant URL.
    const trimmed: PageContext = {
      route: context.route,
      kind: context.kind,
      lessonId: context.lessonId,
      practiceSetId: context.practiceSetId,
      questionId: context.questionId,
      questionType: context.questionType,
      writingPromptId: context.writingPromptId,
      vocabularyWord: context.vocabularyWord,
      mistakeId: context.mistakeId,
    };
    return `/coach?context=${encodeURIComponent(JSON.stringify(trimmed))}`;
  }
  return `/coach?context=${encodeURIComponent(json)}`;
}

export function parseCoachContext(searchParams: URLSearchParams): PageContext | undefined {
  const raw = searchParams.get("context");
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as PageContext;
    if (typeof parsed !== "object" || parsed === null) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}
