# AI Architecture (static mode)

## Principles

- AI is **optional**. The core product works fully with AI unconfigured.
- The browser **never holds a provider secret key**.
- Deterministic logic (objective scoring, band combination) is never delegated
  to an LLM.

## Client abstraction (`src/lib/ai/client.ts`)

```ts
interface AiClient {
  available: boolean;
  evaluateWriting(input): Promise<WritingEvaluation>;
  evaluateSpeaking(input): Promise<SpeakingEvaluation>;
  chat(messages, onDelta, signal?): Promise<string>;
}
```

Implementations:

- `DisabledAiClient` (default) — every call throws `AiUnavailableError` with a
  clear message. The UI shows "Connect an AI backend to enable …" rather than
  broken buttons.
- `RemoteAiProxyClient` — posts to a user-configured public proxy URL. The proxy
  is a separate, trusted service that holds the real provider key server-side.

Configuration happens in **Settings → AI** (a `proxyUrl` and `model`), persisted
in IndexedDB. There is no `NEXT_PUBLIC_*` key and no bundled secret.

## Contracts

`src/lib/ai/schemas.ts` holds the Zod schemas for `WritingEvaluation` and
`SpeakingEvaluation`. `src/lib/ai/prompts.ts` holds the band-descriptor-anchored
prompt builders and the coach system prompt. These are the reference contract
for any proxy server and for future in-repo adapters.

## Deterministic band combination

Even when AI returns criterion bands, the overall band is recomputed
deterministically in the browser:

- Writing: `writingBandFromCriteria(criteria, task)` (Task 2 double-weighted at
  section level via `writingBandFromTasks`).
- Speaking: `speakingBandFromCriteria(supportedCriteria)` (equal weight;
  pronunciation excluded unless `supported`).

## Absent-AI UX

| Feature | Without AI |
|---|---|
| AI Coach | "Connect an AI backend to enable tutoring." |
| Writing | "AI band estimation is unavailable. Your draft remains saved." |
| Speaking | "Transcript-based AI evaluation is unavailable." |
| Practice generation | "AI generation is unavailable." |

Writing, recording, deterministic metrics, saving and revisiting all keep
working.
