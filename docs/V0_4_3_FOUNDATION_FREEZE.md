# V0.4.3 Foundation Freeze

Final small reliability/data-integrity pass before freezing the V0.4.x
foundation. Each item records severity, root cause, fix and test evidence.

## P0
None.

## P1 (all fixed)

1. **One speaking response could split across multiple `SpeakingTurn` rows.**
   - `src/components/speaking-practice.tsx`
   - Fix: `saveTextOnly`, STT and evaluation now UPDATE the existing
     `turnIdRef.current` turn instead of creating new rows. Unit + E2E.

2. **Legacy `SpeakingRecording.evaluation` was dropped in migration.**
   - `src/lib/storage/db.ts`
   - Fix: `SpeakingTurn.evaluation = recording.evaluation ?? null`.

3. **Legacy manual transcript created a fake `sessionId = "manual"`.**
   - Fix: migration creates a real `SpeakingSession` (`legacy-session-<id>`).

4. **Study plan weekly budget not enforced across a full week.**
   - `src/lib/study-plan/generate.ts`
   - Fix: budget allocator reserves budget for small must-do tasks first, then
     fills with deferrable tasks; mock is high-priority (never forced) so it is
     deferred rather than breaking the budget. Full-week budget tests added.

5. **Completed mock attempts lacked View Results.**
   - `src/app/(app)/mock/page.tsx`
   - Fix: persist section summaries in `MockAttempt.state.sections`; add a
     "View results" panel showing per-section raw/band and the L/R graded average.

## P2 (fixed)

6. Legacy `overallBand` raw field is now explicitly removed during migration.
7. Reading reload E2E now asserts answer, flag, current question and timer
   (timer set immediately on resume, not after the first interval tick).
8. Speaking persistence E2E now actually reloads before checking history.
9. Writing Save Draft no longer clears the exam session (E2E added).
10. Duplicate "Save transcript" is idempotent (updates the same turn).
11. Version metadata bumped to 0.4.3.

## Test evidence
- Unit: speaking migration (evaluation/session/overallBand), study-plan
  full-week budget + duration integrity, mock result summary.
- Playwright `e2e/reliability.spec.ts`: reading reload recovery (answer/flag/
  current/timer), writing Save Draft recovery, speaking text-only reload
  persistence.

## Honest remaining limitations
- Writing strict-expiry (deadline lock) has no dedicated browser clock test; the
  "expired" phase is implemented and unit-covered by state transitions.
- `officialOverallBand` remains reserved/null (no four-skill scoring yet) and is
  documented as such.
- A few minor hardcoded strings may remain in deep exam chrome.

## Freeze decision
The V0.4.x foundation is frozen. Next planned release: V0.5 Plugin / Provider
Architecture.
