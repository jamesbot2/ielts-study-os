# V0.5.1 Provider Closure

> **Correction (V0.5.2):** item 3 below was not fully fixed in V0.5.1.
> `healthCheck()` still called `getWordList()`, which returned the cache before
> any network request — so remote failure with a valid cache could still report
> `healthy`. V0.5.2 splits remote fetch from cached read and makes health check
> the REMOTE endpoint only. See `docs/V0_5_2_PROVIDER_FREEZE.md`.

Architecture-correction release. Records each issue found in the V0.5 source
audit, root cause, fix and test evidence.

## P1 (all fixed)

1. **ProviderManager hardcodes provider definitions.** `provider-manager.tsx`
   contained a literal `providers = [builtin, baicizhan]` array. Adding a provider
   required editing the manager. Fix: manager derives providers from the central
   registry.

2. **Vocabulary browser hardcodes Baicizhan.** `ProviderWordBrowser` used
   `provider.id === "baicizhan"` and `getVocabularyProvider("baicizhan")`. Fix:
   generic provider-neutral browser that iterates enabled `VocabularyProvider`s.

3. **False-positive health check.** `manager.healthCheck(pluginId)` only called
   metadata `healthCheck` (absent for Baicizhan), so "Test connection" could
   report healthy without a real request. Fix: runtime provider resolution; a
   real fetch to the configured endpoint is performed.

4. **Cache exists but unused.** `providerCache` was defined but Baicizhan fetched
   `list.json` every time. Fix: Baicizhan uses a provider-namespaced cache.

5. **PluginContext incomplete / keys not provider-scoped.** `createPluginContext`
   returned `{ config: {}, cache: globalCache }` and ignored pluginId. Fix:
   real resolved config + namespaced cache keyed `${pluginId}:${key}`.

6. **Vocabulary provenance not structured.** Personal cards only kept
   `sourceContext` + tags. Fix: structured `source` metadata on `VocabularyCard`,
   preserved on import, never overwriting FSRS/notes.

7. **Health vs sync semantics confused.** `healthCheck` updated `lastSyncAt`.
   Fix: separate `lastHealthCheckedAt` from `lastSyncAt`.

## P2 (fixed)

8. Built-in vocabulary browsing bypassed the provider contract. Fix: Word Books
   browsing uses `VocabularyProvider` for both built-in and external books.
9. Resource Center integration metadata was duplicated across
   `content/resources.ts` and `plugins/resources/registry.ts`. Fix: registry is
   the single source of truth for integration status.
10. Registration swallowed errors via try/catch. Fix: idempotent registration.

## Tests

- Unit: registry, runtime resolution, health (real fetch, false-positive guard),
  namespaced cache, TTL, Baicizhan cache wiring, provenance, dedupe, migration.
- Playwright: provider config reload, real health semantics (500 vs 200), generic
  word-book browsing, add/dedupe, failure isolation.
