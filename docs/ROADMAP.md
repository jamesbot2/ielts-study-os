# Roadmap

Prioritised by learner value.

## Near term

1. **Expand objective content to full 40 questions** per Listening and each
   Reading set (Academic + General), covering every question type.
2. **Generate Listening audio** from scripts via TTS (local or provider), wired
   into the player.
3. **Interactive Speaking examiner state machine** — adaptive Part 1 → 2 → 3 with
   follow-ups, prep timer, and an exam-mode examiner persona.
4. **Structured band-descriptor dataset** for Writing/Speaking (replace
   prompt-embedded descriptors with a JSON reference used by both UI and AI).
5. **Pronunciation scoring** via an optional local engine (forced alignment /
   phoneme analysis), surfaced only when audio analysis actually runs.

## Medium term

6. **PDF / DOCX import adapters** for the Material Library.
7. **Second-pass critic agent** for writing evaluation (configurable, off by
   default).
8. **Supabase/Postgres adapter** for optional multi-device sync and auth.
9. **Playwright E2E specs** for onboarding, practice, mock and bilingual flows.
10. **Deeper analytics** — writing/speaking criterion trends, retention curve,
    weak-area ranking with recommendations.
11. **Grammar practice exercises** (currently lessons only).

## Later

12. AI practice generation for Listening/Speaking (generators exist for Reading).
13. Examiner-voice TTS and shadowing practice.
14. Dark mode (learning mode only; exam mode keeps the authentic light UI).
15. Export/import of the study plan and vocabulary decks (CSV/Anki).
16. Accessibility audit pass (screen-reader flows for highlighting/navigation).

## Known limitations (current version)

See the "Honest gaps" section of `docs/CONTENT_COVERAGE.md`. The most important:
objective question volume is below the full 40 per exam section, and Listening
audio is not yet bundled.
