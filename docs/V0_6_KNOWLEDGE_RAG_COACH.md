# V0.6 Knowledge Base + RAG + Learner-Aware AI Coach — Architecture Audit

Status: baseline recorded from commit `86d16b0` (V0.5.2).

## Current state (honest)

### Coach (`src/components/coach-module.tsx`)
- **CURRENT:** A thin chat box. Uses `getAiClient().chat()` with `buildCoachSystemPrompt`
  from only `targetBand / testType / currentBand / testDate / weakSkills` plus the
  last ~10 React-state messages. No persistence, no history, no stop button, no
  citations, no learner context beyond profile.
- **TARGET:** Learner-aware coach with bounded `LearnerContextSnapshot`, persistent
  conversations, streaming with citations + action proposals, stop generation,
  "what the coach can see" transparency, page context, RAG grounding.
- **GAP:** full.
- **IMPLEMENTATION:** rewrite CoachModule; add `src/lib/coach/context.ts`; add
  stream protocol + citation/action types to `src/lib/ai/client.ts`.
- **TEST:** unit (snapshot bounds, summaries, parser) + Playwright (persistence,
  context, citations, action confirmation, service failure).

### AI client (`src/lib/ai/client.ts`)
- **CURRENT:** `DisabledAiClient` + `RemoteAiProxyClient`. `chat()` accumulates raw
  text deltas from a plain-text stream at `/api/coach`.
- **TARGET:** NDJSON event stream (`delta`, `citation`, `action_proposal`,
  `tool_status`, `done`) with structured citation/action parsing; `AbortSignal`
  already threaded through.
- **GAP:** no event protocol, no structured output from the chat endpoint.

### AI/RAG service
- **CURRENT:** none. The web app has Next.js API route shims
  (`src/app/api/coach/route.ts` etc.) that are proxies for a remote backend, but
  no real backend exists in-repo.
- **TARGET:** self-contained `services/ai-rag/` FastAPI service with LLM/embedding
  abstractions, hybrid RAG, citations, bounded agent, knowledge ingestion,
  health, offline tests.

### Storage
- **CURRENT:** `aiConversations`/`aiMessages` tables exist with
  `createConversation`/`addMessage`/`listMessages`. No `listConversations`,
  `renameConversation`, `deleteConversation`, `getConversation`; `AiMessage`
  cannot carry citations/actions.
- **TARGET:** full CRUD + non-indexed `citations`/`actions` fields (no DB version
  bump required).

### Knowledge/content
- **CURRENT:** rich `Lesson` type (sections, tables, callouts, sourceIds) and a
  `sources.ts` registry exist; content is present but thin in places. No export
  pipeline, no manifest, no RAG ingestion.
- **TARGET:** `knowledge/sources.yml` manifest, deterministic
  `npm run knowledge:export` producing `knowledge/generated/ielts-study-os.json`,
  original official-knowledge notes, expanded lessons/prompts/practice.

### Analytics/study-plan
- **CURRENT:** `computeAnalytics()` and `generatePlan()` exist and are used for
  dashboards; suitable as the basis for the learner snapshot summaries.

---

This document is a living audit; the TARGET rows are implemented in the commits
that follow.
