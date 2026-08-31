# AI Architecture

## Principles

- Provider-independent; never coupled to one vendor.
- API keys stay server-side; never in client bundles.
- The app is fully functional with AI unconfigured.
- Deterministic logic (objective scoring, band combination) is never delegated to
  an LLM.

## Provider abstraction

`src/lib/ai/provider.ts` defines:

```ts
interface AiProvider { name: string; generateText(opts): Promise<string> }
interface AiConfig { provider; baseUrl; apiKey; model; temperature; maxTokens; timeoutMs; enableCritic }
```

`OpenAICompatibleProvider` implements the chat-completions wire protocol, so it
works with OpenAI, DeepSeek, OpenRouter, xAI, Google (OpenAI-compat), and local
servers (LM Studio, Ollama, vLLM).

`src/lib/ai/index.ts` adds:

- `getAiConfig()` — merges server-side settings (DB) and env placeholders.
- `isAiConfigured()` — key presence check.
- `generateText()` / `generateStructured(schema, ...)` — the latter requests JSON
  output, extracts/parses, validates with Zod, and retries once with a corrective
  hint on failure.
- `streamText()` — async generator for the coach.

## Configuration precedence

`settings(DB) ai_config` > env `AI_API_KEY`/`AI_BASE_URL`/`AI_MODEL` > defaults.
The `GET /api/ai-config` endpoint never returns the raw key (masked `sk-••••1234`).

## Agents

### AI Coach (`src/lib/ai/coach.ts`)

- `buildCoachContext()` builds a **bounded** context (target band, test type,
  test date, ≤12 recent mistakes, weak skills) — never the full history.
- `coachSystemPrompt()` produces the system prompt.
- Streamed via `POST /api/coach`; conversation persisted.

### Writing Evaluator (`src/lib/ai/evaluators/writing.ts`)

- Prompt anchors each criterion in the **official public band descriptors** and
  forbids inventing criteria.
- Zod schema: `criterionScores[]`, strengths, weaknesses, sentence-level issues,
  grammar/lexical/coherence/task-response issues, missing requirements,
  corrections, improved sentences, vocabulary suggestions, next targets,
  examiner-style summary, `bandGapAnalysis` (what separates this from Band X+1).
- The **overall band is computed deterministically** from criterion bands, not
  asked of the model.

### Speaking Evaluator (`src/lib/ai/evaluators/speaking.ts`)

- Anchored to the four official criteria; `pronunciation.supported` is `false`
  when no audio analysis exists, and the band is forced to 0/"not evaluated".
- Uses transcript metrics (WPM, fillers, diversity) as input but never fabricates
  pronunciation from text.
- Overall band computed deterministically from supported criteria.

### Practice Generator (`src/app/api/generate/reading`)

- Generates original reading passage + questions; Zod-validated.
- Runs an **answer-consistency check** (answers must appear in the passage).
- Saved as `AI_GENERATED` draft material with the required label.

## Optional second-pass critic

`AiConfig.enableCritic` is a configuration flag reserved for an
Evaluator → Critic → Final pipeline. It is off by default to avoid burning
tokens; not yet wired (see ROADMAP).

## Failure behaviour

If AI is unconfigured: learning, practice, objective scoring, vocabulary, mock
exams and analytics all work. AI buttons surface the configuration requirement
and no work is lost.
