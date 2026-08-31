# V0.2 Audit

Findings from auditing the V0.1 codebase against the V0.2 static-first
requirements. Classified P0 (security/data loss/severe correctness), P1 (IELTS
correctness/core), P2 (reliability/UX), P3 (polish).

## P0

1. **`node:sqlite` blocks static deployment.** `src/lib/db` and every API route
   (`src/app/api/*`) required a Node server. Static export was impossible.
   → **Resolved**: removed SQLite + API routes; migrated persistence to
   IndexedDB (Dexie) and made all logic browser-safe.

2. **`overallBandFromSections` could produce a fake "overall" band from partial
   skills.** This could be mistaken for an official Overall IELTS Band.
   → **Resolved**: replaced with `calculateOfficialOverallBand` (requires all
   four skills, returns `null` otherwise) and `calculateCompletedSkillsAverage`
   (labelled "Average of completed skills" in the UI).

3. **Aggressive answer normalisation** (`book's` → `books`, `mother-in-law` →
   `mother in law`) silently equated different answers.
   → **Resolved**: conservative normalisation (NFKC, trim, case, whitespace),
   preserving apostrophes, hyphens, decimals, slashes and dates. Number
   thousands-separators are ignored only for pure-number answers.

## P1

4. **Objective practice content was incomplete** (Academic 21, General 25,
   Listening 20 questions; no 40-question test).
   → **Resolved**: three complete 40-question original tests (Academic Reading,
   General Reading, Listening), with per-question evidence and explanations.

5. **Word-limit instructions were checked but not enforced** (a violation did
   not mark the answer wrong).
   → **Resolved**: structured `{ maxWords, allowNumber }` enforcement; violations
   make the answer incorrect; `parseInstruction` converts human instructions to
   metadata; comprehensive tests added.

6. **Listening had no real audio** (duration simulation only).
   → **Resolved**: real Piper TTS audio generated per part (original, CC0),
   committed under `public/audio/listening-1/`, wired into the player with
   one-play exam enforcement and replay in practice mode.

7. **General Training Reading missing `matching_features` and
   `matching_sentence_endings` practice.**
   → **Resolved**: added real worked examples to the General Reading test.

8. **Speaking Mock was not wired** (single-prompt practice only).
   → **Resolved**: full INTRO → Part 1 → Part 2 (instructions/prep/long turn)
   → Part 3 → COMPLETE → REVIEW state machine with recording and manual
   transcript.

9. **Grammar had lessons only, no practice.**
   → **Resolved**: 23 IELTS-relevant grammar exercises with explanations,
   wired into the Mistake Book.

## P2

10. **Server-only AI/speech code imported `server-only` and Node APIs**, which
    would break client bundles.
    → **Resolved**: replaced with a client `AiClient` abstraction
    (`DisabledAiClient` default, `RemoteAiProxyClient` for a future trusted
    proxy). Prompt builders and Zod schemas preserved as the proxy contract.

11. **Mock timer reset on refresh** (section start time held only in memory).
    → **Resolved**: absolute `deadline = startedAt + duration` timestamps,
    persisted to localStorage with resume-on-refresh.

12. **MediaRecorder hardcoded to a single MIME type.**
    → **Resolved**: dynamic `MediaRecorder.isTypeSupported` selection with
    graceful fallbacks and clear permission-denied messaging.

13. **No data export/import/reset.**
    → **Resolved**: versioned JSON backup (export, merge/replace import with
    Zod validation and version checks, reset with confirmation).

## P3

14. **`force-dynamic` server pages and stale `.next` route types** (from deleted
    API routes) produced typecheck noise.
    → **Resolved**: pages converted to static client components with
    `generateStaticParams`; `output: "export"` + `trailingSlash: true`.

15. **Untranslated strings and a per-lesson language toggle inconsistent with
    the global toggle.**
    → **Resolved**: lessons now follow the global locale; dictionary widened to
    plain strings.

16. **Lint warnings (unused imports, dead variables).**
    → Reduced; remaining warnings are non-blocking and tracked.

## Deliberately not changed

- The four-class content model (ORIGINAL / AI_GENERATED / OPEN_LICENSED /
  USER_IMPORTED) and the no-copyright rule.
- The deterministic objective-scoring rule (no LLM grading).
- The pronunciation-never-fabricated-from-text rule.
