# AI Coach

## What the coach can see

The Coach reads a **bounded, purpose-specific** `LearnerContextSnapshot`, built
from local IndexedDB right before each request:

- Profile (type, bands, targets, test date, hours, weakest skills)
- Lesson progress (counts, recently completed, next unfinished)
- Recent practice (≤20 attempts, accuracy by skill, weak question types)
- Mistakes (≤20 recent/recurring, mastery)
- Vocabulary (total, due, recently reviewed, sources)
- Mocks (≤10, L/R graded averages and trends)
- Writing (≤5 recent, criterion bands, repeated weaknesses)
- Speaking (recent parts, evaluated criteria)
- Study plan (today + next 7 days, overdue, minutes)
- Current page context (optional)

## What the coach cannot see

Audio blobs, recordings, full essays, full lesson text, provider secrets, the
whole IndexedDB database. Snapshots are summarized and capped (see
`src/lib/coach/context.ts`).

## Tools

`search_knowledge_base`, `get_profile_summary`, `get_progress_summary`,
`get_recent_mistakes`, `get_vocab_due`, `get_mock_history`, `get_study_plan`,
`get_recent_writing`, `get_recent_speaking`, `recommend_next_activity`.
Max 8 tool steps per request; same-tool loops are prevented.

## Write confirmation

The Coach never silently changes learner data. To create a study task it returns
an `ActionProposal`; the browser shows **Add to study plan** and only persists
on click. Internal links are validated against allowed paths.

## Conversations

Conversations and messages persist locally (IndexedDB). The learner snapshot is
rebuilt per request and is **never** stored as a chat message. Citations and
action proposals are stored with assistant messages.

## Grounding

Factual IELTS claims (format, timing, weighting, band descriptors) are grounded
in RAG sources and cited. When evidence is unavailable, the coach says so.
Pronunuciation is never scored without audio evidence.
