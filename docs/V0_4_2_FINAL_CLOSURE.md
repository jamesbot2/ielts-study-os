# V0.4.2 Final Reliability Closure

Final reliability pass before freezing the foundation. Each item records severity,
file, root cause, fix and regression test.

## P0
None.

## P1 (all fixed)

1. **Standalone Speaking text-only could not persist without a recording.**
   - File: `src/components/speaking-practice.tsx`
   - Root cause: persistence required `recordingIdRef.current`; text-only answers
     had no recording, and transcripts used a fake `recordingId: "manual"`.
   - Fix: canonical `SpeakingTurn` model; `createSpeakingTurn`/`updateSpeakingTurn`;
     `Save transcript` persists without audio. E2E: `reliability.spec.ts`.

2. **Standalone Speaking Part 2 preparation was unreachable.**
   - Fix: "Start preparation" → 60s `prep` → `recording` flow. E2E + manual.

3. **Recording duration used a stale React closure.**
   - Fix: `recordingStartedAt` ref + `Date.now() - start`; immutable `part`/`prompt`
     captured at recording start.

4. **Recording/evaluation/transcript relationships were weak.**
   - Fix: `SpeakingTurn` is the primary unit; recording (`turnId`), transcript and
     evaluation all attach to a turn. Optional. No fake recording IDs.

5. **Study plan falsified exam durations to fit a weekly budget.**
   - File: `src/lib/study-plan/generate.ts`
   - Fix: candidate tasks have fixed realistic durations; a budget allocator
     selects/deferres tasks instead of scaling minutes. Unit tests assert a full
     mock is never below 120 min and Reading never below 45 min.

6. **Mock `overallBand` was a partial Listening/Reading average.**
   - File: `src/lib/storage/types.ts`, `db.ts`, repository, UI
   - Fix: `gradedAverage` (objective L/R average) + `officialOverallBand` (only
     when all four skills are scored, currently always null). Legacy `overallBand`
     migrates to `gradedAverage`. UI labels say "Listening/Reading graded average".

## P2 (fixed)

7. Speaking evaluation now persists onto the `SpeakingTurn` and survives reload.
8. Speaking history panel (list + delete) added to standalone practice.
9. Object URLs are revoked on replace/unmount.
10. Speaking persistence errors surface instead of being swallowed.
11. Study plan: `StudyProfileProvider` reactive; mock frequency tied to
    time-to-exam; task count defered when budget is small.
12. Dexie `DB_VERSION` 1 → 2 with explicit migration (mock band rename + transcript
    → turn); migration tests added.
13. Remaining hardcoded Speaking UI strings localized.

## Regression tests added
- `src/lib/practice/listening-state.test.ts` (playback state transitions)
- `src/lib/study-plan/generate.test.ts` (budget + duration integrity)
- `src/lib/storage/migration.test.ts` (v1 → v2 migration)
- `e2e/reliability.spec.ts` (profile persistence, real reading reload recovery,
  text-only speaking persistence)

## Honest remaining limitations
- Playwright still does not cover every recovery flow end-to-end (listening media
  state and mock recovery rely on pure unit tests + manual checks; writing expiry
  is unit-covered via state transitions but not a dedicated browser clock test).
- The legacy `speakingTranscripts` table remains (unused at runtime, kept for
  historical data).
- A few minor hardcoded strings may remain in deep exam chrome.
