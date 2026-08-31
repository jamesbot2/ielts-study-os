# Testing

## Commands

```bash
npm test          # vitest run (unit + integration)
npm run typecheck # tsc --noEmit
npm run lint      # eslint
npm run build     # production build (also runs type checking)
npm run test:e2e  # Playwright (requires: npx playwright install)
```

## Unit tests (`src/**/*.test.ts`)

`src/lib/scoring/scoring.test.ts` covers:

- Answer normalisation (case, whitespace, punctuation, full-width).
- Word-limit enforcement.
- Text / single-choice / multiple-choice / matching answer checking.
- Listening, Academic Reading, General Reading band boundaries.
- Overall band rounding (`.25` up, `.75` up, nearest half).
- Writing Task 2 double-weighting.
- Speaking four-criteria averaging.
- Raw-score-for-band requirements.

## Integration coverage (via route tests / manual API checks)

- `POST /api/practice/submit` → deterministic score + mistake creation.
- `POST /api/vocabulary` + `/api/vocabulary/review` → FSRS scheduling.
- `POST /api/mock` → attempt creation, state, completion scoring.
- `GET /api/analytics` → aggregation.
- AI-disabled behaviour: `/api/writing/evaluate` returns 503 with a clear message
  when no key is configured.

## E2E (Playwright)

A Playwright project is configured for future browser flows (onboarding, reading
practice, writing editor, mock submission, bilingual switch). Browser binaries
must be installed with `npx playwright install`; the specs are scaffolded in
`e2e/`.

## Quality gate

Before declaring complete, run:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

All four must pass.
