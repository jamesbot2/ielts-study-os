# IELTS Study OS

An independent, open-source IELTS learning platform. Learn IELTS from zero knowledge
to full exam preparation — fundamentals, scoring, all four skills, question-type
strategies, practice, spaced-repetition vocabulary, AI coaching, AI writing/speaking
evaluation, study planning, analytics, and realistic computer-delivered mock exams.

**Disclaimer:** This project is an independent learning tool and is **not**
affiliated with, endorsed by, or approved by IELTS, British Council, IDP, or
Cambridge University Press & Assessment. AI-generated band scores are estimates,
not official IELTS scores.

## Features

- **Bilingual UI** — English and 简体中文, toggle anywhere, persisted.
- **IELTS Fundamentals curriculum** — structure, scoring, band rounding, computer
  delivery, One Skill Retake, misconceptions (bilingual lessons).
- **Listening** — 4-part structure, all question types, strategies, one-play exam
  mode vs replay practice, transcript after submission.
- **Reading** — Academic and General Training; split-pane reader, highlighting,
  font-size controls, timer, flagging, per-question evidence and explanations.
- **Writing** — Academic Task 1, General Training letters, Task 2 essays; editor
  with timer, word count, autosave, draft history, fullscreen.
- **Speaking** — topic library, MediaRecorder, manual transcript, speech metrics,
  AI feedback. Pronunciation is *never* fabricated from text.
- **Vocabulary** — FSRS spaced repetition (Again/Hard/Good/Easy), rich cards,
  Chinese + English fields.
- **Grammar** — IELTS-oriented lessons; **Strategies** — skill checklists.
- **Mistake Book** — unified mistakes from all skills, filters, recurrence.
- **AI Coach** — persistent streaming tutor with bounded context.
- **AI Writing/Speaking Evaluator** — band-descriptor-anchored, Zod-validated,
  deterministic score combination.
- **Mock Exams** — computer-delivered flow: strict timer, sections, auto-submit,
  deterministic scoring.
- **Analytics** — skill accuracy, question-type stats, mock history, mistakes.
- **Study Plan** — deterministic generator weighted by weak skills.
- **Material Library** — import your own legally-owned materials; AI-generated
  original practice with consistency checks.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4 · lucide-react icons
- SQLite via Node's built-in `node:sqlite` (zero native deps)
- Zod validation · ts-fsrs (spaced repetition)
- Vitest + Testing Library (unit/integration) · Playwright (e2e, config provided)
- Provider-independent AI layer (OpenAI-compatible)

## Local installation

```bash
git clone https://github.com/jamesbot2/ielts-study-os.git
cd ielts-study-os
npm install
npm run dev
```

Open http://localhost:3000. No API key is required to run: learning, practice,
objective scoring, vocabulary, mock exams and analytics all work offline.

## Environment configuration

Copy `.env.example` to `.env` and fill in only what you need:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | AI coach / writing / speaking evaluation (OpenAI-compatible) |
| `STT_API_KEY`, `STT_BASE_URL`, `STT_MODEL` | Optional speech-to-text |
| `PRONUNCIATION_API_KEY` | Optional pronunciation assessment |
| `IELTS_DB_PATH` | Optional SQLite path override |

API keys are stored server-side and **never** sent to the browser. You can also
configure AI/speech in the in-app **Settings** page.

## AI configuration

Any OpenAI-compatible endpoint works (OpenAI, DeepSeek, OpenRouter, xAI, Google
via OpenAI-compat, LM Studio, Ollama, vLLM). See `docs/AI_ARCHITECTURE.md`.

## Speech configuration

Recording always works without keys. For transcription, either set an STT key
or point the app at a local `faster-whisper` HTTP service. See
`docs/SPEECH_ARCHITECTURE.md`.

## Content policy

This project ships **only original and clearly-labelled content**. It does not
redistribute copyrighted Cambridge IELTS books, audio, images or leaked questions.
Users may import materials they legally own. See `docs/CONTENT_POLICY.md`.

## Development commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest unit/integration tests
npm run test:e2e     # Playwright (npx playwright install first)
```

## Current status

A working first version: full bilingual learning UI, all four skills, original
practice content, deterministic scoring, FSRS vocabulary, mistake book, AI coach
and evaluators (when a key is configured), mock exams, analytics and study
planning. See `docs/CONTENT_COVERAGE.md` for a precise, honest coverage matrix and
known gaps.

## License

MIT (see `LICENSE`). Original content in `src/lib/content` is CC0. See
`docs/LICENSE_AUDIT.md`.
