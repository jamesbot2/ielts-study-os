# V0.4 Reliability Audit

Audited against the V0.4 goal: existing functionality must actually work.
Deployment source verified: **source-of-truth is GitHub** (`origin` →
`jamesbot2/ielts-study-os`); **GitLab `ejimm363/ielts-study-os` is a mirror** that
is connected to Vercel (production branch `main`). Pushes go to both.

## P0 — data loss / security
None introduced. Existing backup/export preserved.

## P1 — broken core functionality / exam correctness (all fixed)

1. **IELTS test type functionally broken.** `StudyProfile.testType` was stored
   but ignored by Learn, Practice hub, Writing, recommendations and onboarding
   diagnostic; each page loaded `getProfile()` independently or not at all.
   → **Fixed**: added `StudyProfileProvider` (`useStudyProfile()`), wired into
   the root layout; Settings autosaves; test-type change is immediately reactive.

2. **Onboarding diagnostic hardcoded** `/practice/reading/academic-reading-1`.
   → **Fixed**: diagnostic now uses the chosen test type.

3. **Onboarding language not synced** with the global I18n locale.
   → **Fixed**: selecting a language switches the UI immediately; profile
   `uiLanguage` is the single source of truth, synced by the provider.

4. **Reading refresh recovery missing** (answers/flags/timer lost on refresh).
   → **Fixed**: persist answers, flags, current, font, split, startedAt and an
   absolute `deadline`; resume/start-over flow; strict exam timer uses deadline.

5. **Writing exam timer reset on refresh.**
   → **Fixed**: persist mode + startedAt + deadline; exam timer uses deadline and
   clamps at zero.

6. **Listening strict-mode replay by refresh.**
   → **Fixed**: persist mode, answers, flags, `playedOnce`, `partIndex`,
   startedAt; pause button hidden in exam mode; flags passed to `submitPractice`.

7. **Speaking mock Skip button stuck** (called a buggy `recordTurn` with
   `copy[length-1]` that could write index -1, and never advanced).
   → **Fixed**: Skip advances; `recordTurn` appends correctly.

8. **Speaking recording duration stale closure** (could record 0s / wrong
   stage/part/prompt).
   → **Fixed**: capture immutable `part`, `prompt` and `recordingStartedAt` at
   recording start; duration computed from `Date.now() - start`.

9. **AI proxy configuration lost on reload** (module-level singleton reset).
   → **Fixed**: added `AiProvider` that bootstraps from IndexedDB settings,
   with a subscription for reactivity and a non-secret "Test connection" action.

10. **Vocabulary built-in metadata dropped** (only `word` saved) and
    **duplicates possible** across reloads.
    → **Fixed**: preserve pos/definition/meaning/collocations/example/band;
    mark already-added words from the deck.

## P2 — content/UX/i18n/reliability (fixed unless noted)

11. Learn page: now respects test type + localizes categories/titles/progress;
    added "Show all IELTS types" toggle.
12. Practice hub + Writing page: now client components filtering by test type.
13. Dashboard: test-type-aware recommendations; real per-category progress
    (completed/total + %); local-date countdown via `src/lib/date.ts`.
14. Curriculum sequencing: `getOrderedLessons`/`getAdjacentLessons` sort by
    category → order → id and filter by test type; lesson nav no longer jumps
    across unrelated areas.
15. Lesson viewer: localized category/titles/next/mark-complete; test-type-aware
    adjacent navigation; source references rendered.
16. Full-mock count label: now "80 questions + 2 writing tasks".
17. `.env.example`: replaced obsolete SQLite/server/API-key text with a clear
    "no env variables required" statement.
18. Stale i18n ("stored server-side") corrected.

## P3 — polish
- Study-plan personalization (test-type/band-aware task content and time-budget
  scaling) and mock attempt history interactivity are still partial — tracked as
  remaining work.

## Remaining known limitations (not blocking this round's core goals)
- Study plan time-budget still does not scale tasks by `weeklyHours` (content is
  test-type aware only at the recommendation level).
- Mock attempt history rows are still not clickable (view/retake/delete).
- Speaking practice manual-transcript path and Part 2 prep still need wiring
  beyond the mock flow (speaking-exam is the primary covered flow).
- Some remaining hardcoded strings (e.g. "Playing…" in mock audio bar).
