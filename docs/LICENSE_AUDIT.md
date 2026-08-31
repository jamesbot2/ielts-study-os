# License Audit

## Project license

IELTS Study OS is licensed under the **MIT License**. Original learning content
under `src/lib/content` is dedicated to the public domain (**CC0**) where
applicable, and is always original writing by project contributors.

## Code reuse decision log

| Source | License | Reused? | What | Attribution |
|---|---|---|---|---|
| aimerfeng/ists | MIT | No code copied | Architecture inspiration (single-user, provider fallback, ADRs) | Noted in `docs/OPEN_SOURCE_RESEARCH.md` |
| sifu-ewu/ielts-reading-mock-test | MIT | No code copied | Independent reimplementation of answer normalisation + band tables | Noted |
| Talljack/echo-type | MIT | No code copied | FSRS/provider abstraction inspiration | Noted |
| KaichenCurry/ielts-speaking-ai | MIT | No code copied | Record→transcribe→score flow | Noted |
| sallowayma-git/IELTS-practice | GPL-3.0 | **None** | Ideas only (also ships third-party copyrighted content) | Noted |
| iFralex/IELTS-Study | NOASSERTION | **None** | Ideas only (bundles IELTS Liz content) | Noted |
| ChiShengChen/IELTS_speaking | none | **None** | Metric ideas (WPM, fillers, TTR) | Noted |
| UsairamPasha/ielts-ai-platform | none | **None** | Ideas only | Noted |
| connectamey/ieltstar | none | **None** | Ideas only | Noted |

## Why no code was copied

- The reference projects that permit reuse (MIT) mostly overlap with library
  functionality already provided by our chosen dependencies (FSRS via `ts-fsrs`,
  Next.js, Zod). Their bespoke logic (e.g. UI, persistence) was independently
  reimplemented to fit this project's data model and bilingual requirements.
- GPL-3.0 and no-license projects were treated as **architectural inspiration
  only**, which is appropriate and avoids licence contamination.

## Content policy compliance

- **No** Cambridge IELTS books, audio, images, PDFs, answer keys, or leaked
  questions are present in this repository.
- All bundled practice content is original and clearly marked with
  `sourceType: "ORIGINAL"` and `copyrightStatus: "Original, freely redistributable"`.
- AI-generated content is marked `sourceType: "AI_GENERATED"` with the label
  "AI-generated practice material — not an official IELTS question."
- User-imported content is stored locally (IndexedDB) and never committed.

## Third-party notices

- `ts-fsrs` — MIT, © the ts-fsrs authors. Used as a dependency (not vendored).
- `lucide-react` — ISC. Used as a dependency.
- Fonts are system fonts (no bundled font files).

## Disclaimer

This project is an independent learning tool and is not affiliated with,
endorsed by, or approved by IELTS, British Council, IDP, or Cambridge University
Press & Assessment.
