# Open-Source Research

Research conducted 2026-08 against GitHub and official IELTS sources before
finalising architecture. For each project we record purpose, license, reusable
ideas, weaknesses and what we improved.

## IELTS-specific projects

### aimerfeng/ists (IELTS Study OS)
- **Purpose**: single-user, local-first IELTS learning OS.
- **License**: MIT.
- **Features**: daily study loop, bilingual AI coach, SQLite vocab SRS, original
  reading/listening drills with evidence, writing editor + AI feedback, full
  computer mock, mistake-to-review queue, analytics, text/PDF/DOCX/image/audio
  import, AI generation from imported text, JSON export + Notion backup.
- **Architecture**: Next.js App Router + `better-sqlite3` + Zod + Vitest +
  OpenAI-compatible providers; clean `src/server` + `src/lib` separation; ADRs.
- **Reusable ideas**: single-user local-first posture; provider fallback; ADRs;
  mistake-to-review queue; content import pipeline.
- **Weaknesses**: intentionally excludes Speaking; uses native `better-sqlite3`
  (build step) where we use built-in `node:sqlite`.
- **What we improved**: added a full Speaking module; deterministic scoring with
  Academic/General/Language distinct tables and tests; wider curriculum.

### sifu-ewu/ielts-reading-mock-test
- **Purpose**: authentic-format Academic Reading mock (React/Vite).
- **License**: MIT.
- **Features**: 3 passages, 40 questions, 9 question types, 60-min timer with
  auto-submit + pause/resume, refresh-resume via localStorage, answer
  normalisation + band conversion, per-question review, font-size + highlighter.
- **Reusable ideas**: answer normalisation; band tables; persistence strategy;
  "every question winnable" test invariant.
- **Weaknesses**: Reading only; single test; no backend.
- **What we improved**: multi-set content, both test types, server persistence,
  mistake book integration.

### sallowayma-git/IELTS-practice (IELTS Atlas)
- **Purpose**: popular Chinese-language IELTS Reading/Listening practice system.
- **License**: GPL-3.0 (code); **content has third-party copyright risk**.
- **Features**: static front-end, question-bank browsing, timed sets, answer
  analysis, mistake review, local storage, import.
- **Reusable ideas**: question-bank UX; per-question analysis; import patterns.
- **Weaknesses / caution**: bundles third-party exam content; the README itself
  warns against redistribution.
- **What we improved**: ship only original content; four-class source model
  (ORIGINAL / AI_GENERATED / OPEN_LICENSED / USER_IMPORTED); no copyrighted bank.
- **Code reuse**: **none** (GPL + content risk). Ideas only.

### KaichenCurry/ielts-speaking-ai
- **Purpose**: Chinese-language Speaking AI tutor/grader.
- **License**: MIT.
- **Features**: Whisper STT, per-sentence feedback, band estimation, Notion
  storage, weekly reports, OpenClaw agent framework.
- **Reusable ideas**: flow of record → transcribe → analyse → score → feedback;
  separation of transcript metrics from audio metrics.
- **Weaknesses**: ties to specific agent framework; Chinese-only.
- **What we improved**: provider abstraction; manual-transcript fallback; never
  fabricate pronunciation from text.

### ChiShengChen/IELTS_speaking
- **Purpose**: personal Speaking/Writing practice with local faster-whisper.
- **License**: **none declared** → treat as all-rights-reserved; ideas only.
- **Features**: Part 1/2/3 flows, prep timers, WPM/filler/TTR metrics, topic
  vocabulary suggestions, PDF export, writing task timers.
- **Reusable ideas**: metric set (WPM, fillers, TTR); Part 2 bullet coverage check.
- **What we improved**: license-safe reimplementation of metrics; structured
  evaluation.

### UsairamPasha/ielts-ai-platform
- **Purpose**: Django + Angular + ML IELTS platform.
- **License**: **none** → ideas only.
- **Features**: BERT essay features, ML band regression, speaking analysis, mock
  system, dashboards.
- **What we improved**: deterministic scoring replaces ML-only band regression;
  provider-independent LLM layer.

### connectamey/ieltstar
- **Purpose**: online IELTS test platform (course project).
- **License**: **none** → ideas only.
- **Features**: mock tests, score calculator, speaking assessment, social sharing.
- **Reusable ideas**: overall band calculator UX.

### iFralex/IELTS-Study
- **Purpose**: Electron desktop IELTS app.
- **License**: **NOASSERTION** (custom) → ideas only.
- **Features**: timed sessions, exam simulation, AI writing feedback, SRS
  flashcards, analytics, multilingual UI.
- **Caution**: bundles IELTS Liz content (copyright) — we do **not** follow this.
- **What we improved**: original content only; web app instead of Electron.

### Nel-droid/IELTS-AI
- **Status**: repository returned 404 at research time (deleted/renamed).

## English-learning / architecture references

### Talljack/echo-type
- **Purpose**: four-skills English learning SaaS with FSRS + pronunciation.
- **License**: MIT.
- **Features**: import article/YouTube/page, shadow reading, CEFR assessment,
  AI tutor with 15+ providers, phoneme-level pronunciation, FSRS vocabulary,
  desktop + web.
- **Reusable ideas**: provider abstraction breadth; FSRS integration; phoneme
  pronunciation feedback.
- **What we improved**: IELTS-specific scoring and curriculum; honest
  pronunciation gating.

## Additional searches performed

- IELTS mock exam systems, IELTS reading/listening, writing scoring, speaking +
  Whisper, FSRS vocabulary, language-learning analytics, AI tutoring.
- Notable hits: `cooolink/ai-en-teacher` (MIT, IELTS tutor AI skill), and several
  no-license projects (ideas only).

## Conclusions that shaped the architecture

1. Local-first single-user with server-side SQLite is the right base; Postgres/Supabase can be swapped later.
2. Deterministic objective scoring is mandatory; LLMs must never grade Reading/Listening.
3. Separate transcript-based metrics from audio-based pronunciation metrics.
4. Four-class content model with strict original-content default.
5. Provider abstraction for AI and speech so the app never blocks on a key.
