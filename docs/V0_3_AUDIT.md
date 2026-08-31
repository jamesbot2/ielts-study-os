# V0.3 Audit

Audited against the V0.3 goals (content depth, UI/UX redesign, bug audit,
resource library, IELTS pedagogy depth). Findings classified by priority.

## P0 — data loss / security
None found. Persistence (Dexie/IndexedDB) and backup/export are intact; no
secrets in the bundle.

## P1 — broken functionality / exam correctness

1. **Button design system is broken.** `globals.css` defines `.btn` (padding,
   radius, font, flex) separately from `.btn-primary` / `.btn-secondary` /
   `.btn-ghost` / `.btn-danger`. Components use `className="btn-primary"` alone,
   so they receive only color/background and render as tiny rectangles (e.g.
   "Start mock"). Fix: variants must inherit base button styles.

2. **Mock resume timer bug.** `MockRunner` restores `attemptId`, `sectionIndex`,
   `answers`, `sectionTimes` from localStorage on mount, but **not** the saved
   `deadline`. A refresh re-arms a fresh section timer. Fix: restore absolute
   deadline; if it has passed, advance/auto-submit.

3. **Mock flag feature is fake.** `QuestionSection` passes `flagged={false}` and
   `onToggleFlag={() => {}}`. Flagging is not implemented in strict mock mode.
   Fix: implement per-section flags, persistence, navigator state, recovery.

4. **Full-mock Writing result bug.** `submitAll()`/`finishMock()` collect
   Writing text but only score Listening/Reading. The results UI shows an
   "average of completed skills" that could read as if all three sections were
   graded. Fix: Writing shows "Submitted — not graded" without AI; text is
   preserved; wording is explicit.

5. **Listening one-play refresh behavior.** `played` lives only in React state;
   a refresh can replay the audio. Fix: persist playback state (audioStarted,
   currentPart, completed) with the mock state.

## P2 — content / UX / i18n / reliability

6. **Resource Library is empty for new users.** It only renders
   `listImportedMaterials()` from IndexedDB. A fresh profile sees nothing.
   Fix: add a built-in curated Resource Center (official + open-source links).

7. **Hardcoded English strings.** `MockPage`, `LearnPage`, `LibraryModule`,
   `MockRunner`, and several placeholders ("Type your answer", "Source name",
   "Topic (e.g. renewable energy)", "Generate original reading practice") are
   not in the i18n dictionary. Chinese mode shows English chrome.

8. **Lesson content is shallow.** 45 lessons, many only a few bullets/paragraphs
   (3–8 min estimates). Not sufficient for "comprehensive" preparation.

9. **Speaking topic library is small** (12 topics). Expand substantially.

10. **Vocabulary starts empty.** No built-in vocabulary library or collocation
    bank; learners must add everything manually.

11. **Grammar practice is thin** (23 exercises, no structured modules).

12. **No study guides** (30/60/90-day plans, band-improvement paths).

13. **No content provenance.** Lessons have no source references or
    "Sources & further reading".

## P3 — visual polish

14. **Saturated blue accent** `#1e5eff` is visually harsh for study use.

15. **Nav active state** uses `bg-accent/10 text-accent` (bright on bright).

16. **Low information density** — large whitespace, small content.

17. `console.log` in `src/lib/content/validate.test.ts` (test-only, harmless).

## Out of scope (unchanged by design)
- Static export, IndexedDB/Dexie, no-backend, no-account, no-key.
- Deterministic objective scoring; AI optional.
- Copyright rule: link, don't mirror, official material.
