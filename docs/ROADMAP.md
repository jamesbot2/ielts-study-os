# Roadmap

Prioritised by learner value. (Completed-in-V0.2 items are not listed.)

## Near term

1. **Pronunciation scoring** via an optional local audio engine (forced
   alignment / phoneme analysis), surfaced only when audio analysis actually runs.
2. **Speech-to-text** integration with a documented local `faster-whisper`
   service (interface and UI already present; manual transcript works today).
3. **AI proxy reference server** — a small companion service (outside this repo)
   that runs the prompt builders in `src/lib/ai` server-side so the
   `RemoteAiProxyClient` can be pointed at it.
4. **PDF / DOCX import** — client-side parsing (e.g. pdfjs / mammoth) behind the
   existing material library.

## Medium term

5. **More original tests** — additional 40-question Listening and Reading sets
   to vary practice (current library has one complete test per skill).
6. **More audio voices** and part-level audio for additional listening tests.
7. **Adaptive AI speaking examiner** — optional AI-generated follow-up
   questions on top of the deterministic mock flow.
8. **Deeper analytics** — writing/speaking criterion trends, retention curve,
   weak-area ranking with recommendations.

## Later

9. Optional **cloud sync** (bring-your-own backend) behind the storage
   abstraction, with the same export/import format.
10. Optional **authentication** if/when sync is added.
11. Dark mode for learning mode (exam mode keeps the authentic light UI).
12. Export/import to Anki/CSV for vocabulary.
13. Accessibility audit pass for screen-reader flows.

## Known limitations

See the "Honest gaps" section of `docs/CONTENT_COVERAGE.md`. The most important:
pronunciation scoring, PDF/DOCX import, and AI are optional/enhancement and do
not block the core static product.
