# V0.5.2 Provider Architecture Freeze

**Status:** COMPLETE (final provider-architecture cleanup before V0.6)

This release makes the plugin/provider foundation freeze-safe. After this
release the foundation is frozen unless a genuine P0/P1 regression is found.

---

## Health semantics

| ID | Severity | File | Status |
|----|----------|------|--------|
| H1 | P0 | `src/lib/plugins/vocabulary/baicizhan-provider.ts` | PASS |

**Reproduction (pre-fix):** `healthCheck()` called `getWordList()`, which
returned a fresh cache entry before making any network request. Remote failure
with a valid cache therefore reported `healthy`.

**Root cause:** browsing (cache-first) and health (remote-only) were conflated.

**Fix:** split into `fetchRemoteWordList()` (remote fetch + schema validation,
bypasses cache) and `getWordList()` (cache-first for browsing). `healthCheck()`
now calls `fetchRemoteWordList()` directly.

**Expected behavior:**
- remote success → `healthy`
- remote failure + valid cache → `degraded`, message `Remote unavailable; cached data available.`
- remote failure + no cache → `unavailable`

**Test evidence:**
- `src/lib/plugins/manager.test.ts` — "reports degraded (not healthy) when remote fails but cache exists" and "reports healthy on remote success even when cache exists".
- `e2e/providers.spec.ts` — "remote failure with an existing cache reports degraded, not healthy" (browses to populate cache, then mocks HTTP 500).

| ID | Severity | File | Status |
|----|----------|------|--------|
| H2 | P1 | `src/lib/plugins/vocabulary/baicizhan-provider.ts` | PASS |

**Issue:** invalid list payload was thrown as `ProviderNetworkError`.

**Fix:** `fetchRemoteWordList()` now throws `ProviderSchemaError`.

**Test:** `manager.test.ts` — "throws ProviderSchemaError for malformed list payload".

| ID | Severity | File | Status |
|----|----------|------|--------|
| H3 | P1 | `src/lib/plugins/vocabulary/baicizhan-provider.ts` | PASS |

**Issue:** `listEntries()` returned the full-catalog `total` even when a query
filtered the list (broken pagination).

**Fix:** `total = filtered.length`.

**Test:** `manager.test.ts` — "reports filtered total when a query is present"
(fixture `["apple","application","banana"]`, query `app` → 2/2).

---

## Configuration

| ID | Severity | File | Status |
|----|----------|------|--------|
| C1 | P1 | `src/components/provider-manager.tsx` | PASS |

**Issue:** only text/url/number rendered; boolean and select were incomplete.

**Fix:** generic renderer for `text | url | number | boolean | select`. Boolean
renders as checkbox, select renders options. No provider-specific conditions.

**Test:** `src/lib/plugins/config.test.ts` — `coerceConfigFieldValue` covers all
five types.

| ID | Severity | File | Status |
|----|----------|------|--------|
| C2 | P1 | `src/lib/plugins/config.ts`, `manager.ts` | PASS |

**Issue:** `secret` config fields had no behavioral protection and could be
persisted to IndexedDB.

**Fix:** `sanitizeProviderConfig()` drops `secret === true` fields and coerces
typed values; `manager.setConfig()` applies it before `saveProviderConfig`. The
UI shows "Requires a trusted proxy/backend" for secret fields and renders no
input.

**Test:** `config.test.ts` — "drops secret fields"; `manager.test.ts` — "drops
secret config fields before storing".

---

## Registration

| ID | Severity | File | Status |
|----|----------|------|--------|
| R1 | P1 | `src/lib/plugins/register.ts` | PASS |

**Issue:** two competing entry points — `vocabulary/index.ts:registerAllPlugins`
and `plugins/index.ts:registerBuiltinPlugins`.

**Fix:** single root `src/lib/plugins/register.ts:registerAllPlugins()` which
delegates to `registerVocabularyPlugins()`. `registerBuiltinPlugins()` removed.

| ID | Severity | File | Status |
|----|----------|------|--------|
| R2 | P1 | `src/lib/plugins/vocabulary/index.ts` | PASS |

**Issue:** built-in vocabulary was special-cased in `listEnabledVocabularyProviders`
(`if plugin.id === builtinVocabularyProvider.id`).

**Fix:** built-in registered with `createRuntime()` returning
`builtinVocabularyProvider`; resolution now uses the generic runtime path. The
only remaining branch is `plugin.builtin` (a generic flag for "always enabled"),
not an ID check.

| ID | Severity | File | Status |
|----|----------|------|--------|
| R3 | P1 | generic core | PASS |

**Provider-ID branches in generic core:** NONE. `ProviderManager`,
`WordBooksBrowser`, and `listEnabledVocabularyProviders` contain no `"baicizhan"`
or `"ielts-study-os-builtin"` string branches. (Implementation/registration
files naturally contain their own IDs.)

---

## Vocabulary

| ID | Severity | File | Status |
|----|----------|------|--------|
| V1 | P1 | `src/components/vocabulary-module.tsx` | PASS |

**Issue:** detail lookup used `provider.getEntry(entry.word)` instead of the
provider `externalId`.

**Fix:** `provider.getEntry(entry.source.externalId ?? entry.word)`.

**Test:** `import.test.ts` — "preserves an opaque externalId distinct from the display word".

| ID | Severity | File | Status |
|----|----------|------|--------|
| V2 | P1 | `src/lib/plugins/vocabulary/import.ts`, `vocabulary-module.tsx` | PASS |

**Issue:** imported words did not preserve the selected book.

**Fix:** `addProviderEntryToPersonalVocabulary(entry, { bookId })` accepts a
book override; `WordBooksBrowser.add()` passes the selected book's `externalId`.

**Test:** `import.test.ts` — "preserves selected book provenance"; E2E asserts
`source.bookId === "all"` for the Baicizhan flat book.

| ID | Severity | File | Status |
|----|----------|------|--------|
| V3 | P1 | `src/components/vocabulary-module.tsx` | PASS |

**Issue:** legacy `VocabularyLibrary` directly consumed `vocabTopics`, creating a
second built-in browsing path.

**Fix:** removed. `WordBooksBrowser` is the canonical library browser (built-in
topic books + external providers). Provider implementation still consumes
`vocabTopics`; the core browsing UI does not. Collocations remain a separate
feature.

| ID | Severity | File | Status |
|----|----------|------|--------|
| V4 | P1 | `src/lib/plugins/vocabulary/import.ts` | PASS |

**FSRS dedupe preservation:** existing card keeps FSRS/notes; only provenance is
merged. `import.test.ts` — "deduplicates without resetting FSRS state".

---

## Resource Center

| ID | Severity | File | Status |
|----|----------|------|--------|
| RC1 | P1 | `src/lib/content/resources.ts`, `src/components/library-module.tsx` | PASS |

**Issue:** Resource Center consumed only curated `resources.ts`, not the
integration registry.

**Fix:** `ResourceItem.integrationId?` links curated cards to
`plugins/resources/registry.ts` entries. `ResourceCard` resolves integration
state (mode/status/capabilities/note) from the authoritative registry and shows
honest badges (`Native provider · Active`, `Planned provider`, `Reference only`,
`External only`) with action labels that match status.

**Mapping:** `r-oss-ists→ists`, `r-oss-reading-mock→ielts-reading-mock`,
`r-oss-echo-type→echo-type`, `r-oss-speaking-ai→ielts-speaking-ai`,
`r-oss-ielts-practice→ielts-atlas`.

Official IELTS.org / British Council / IDP metadata remains curated (not forced
into the plugin registry).

---

## Storage

- **DB version:** 3 (unchanged — no schema change; `ProviderConfig.lastHealthCheckedAt`
  remains optional and `VocabularyCard.source` already exists).
- **Backup/import:** PASS — `providerConfigs` and `vocabulary` (with structured
  `source`) are in `TABLE_NAMES`; `providerCache` remains excluded
  (reconstructable).

---

## Quality gate

| Gate | Result |
|------|--------|
| Unit/integration | 153 passed |
| Playwright | 21 passed |
| Lint | 0 errors, 33 warnings |
| Typecheck | clean |
| Build | success (91 static pages) |
| Static E2E | 21 passed |
| Production smoke | see deployment report |

Provider foundation frozen: **YES** — the cached health false-positive is fixed
and covered by unit + browser regression tests.
