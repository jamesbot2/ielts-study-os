# Testing

## Commands

```bash
npm test          # vitest run (unit + integration)
npm run typecheck # tsc --noEmit
npm run lint      # eslint
npm run build     # static production build (out/) — also type-checks
npm run test:e2e  # Playwright against the static build
```

## Unit / integration tests (`src/**/*.test.ts`)

| Suite | Covers |
|---|---|
| `scoring.test.ts` (33) | conservative normalisation (apostrophes, hyphens, decimals, dates), word-limit instruction enforcement, choice/matching checking, band tables, quarter-band rounding, official overall vs completed-skills average, writing/speaking aggregation |
| `srs/fsrs.test.ts` | FSRS scheduling (again/hard/good/easy, multi-review) |
| `study-plan/generate.test.ts` | plan generation, weak-skill weighting, scheduling |
| `storage/repository.test.ts` | profile, vocabulary + FSRS, mistakes recurrence, mock lifecycle, study tasks (against fake-indexeddb) |
| `storage/export.test.ts` | backup round-trip, version rejection, malformed input |
| `content/validate.test.ts` | 40-question counts, unique IDs, structural validation, answer-consistency, coverage manifest |

## E2E (Playwright)

11 specs run **against the static export** (the `webServer` builds and serves
`out/`), covering: homepage, learn hub, bilingual switch + persistence, reading
practice + submit, writing autosave/restore, vocabulary, settings export/reset,
mock + speaking mock. See `e2e/smoke.spec.ts`.

## Quality gate

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e
```

All must pass before merging.
