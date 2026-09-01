# Provider SDK

How to implement and register a provider in IELTS Study OS.

## Vocabulary provider

Implement the `VocabularyProvider` interface from
`src/lib/plugins/vocabulary/types.ts`:

- `id`, `kind: "vocabulary"`, `name`, `description`, `version`, `source`,
  `capabilities`
- `listBooks(): Promise<VocabularyBook[]>`
- `getBook(bookId)`
- `listEntries(bookId, options)` — paginated; entries are canonical
- `getEntry(externalId)` — full normalized entry (or `null`)
- `healthCheck()`

Return entries in the **canonical** shape:

```ts
interface CanonicalVocabularyEntry {
  id: string;              // `${providerId}:${externalId or word}`
  word: string;
  partOfSpeech?: string | null;
  ipa?: string | null;
  meaningZh?: string | null;
  definitionEn?: string | null;
  examples: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
  topics: string[];
  skills: Array<"listening" | "reading" | "writing" | "speaking">;
  tags: string[];
  source: VocabularySourceMetadata; // provenance
}
```

### Normalization + validation

Validate third-party responses with Zod, then normalize to canonical. A malformed
entry must be skipped, not crash the whole book.

### Registration & runtime resolution

Register plugin metadata (with optional `configFields` and a `createRuntime`
factory) via `registerPlugin`. The `createRuntime(context)` factory constructs the
configured runtime provider; `manager.healthCheck()` resolves the runtime and
performs a **real** health check (never a metadata-only false positive).

```ts
registerPlugin({
  id: "baicizhan",
  name: "Baicizhan Vocabulary",
  kind: "vocabulary",
  capabilities: ["VOCABULARY_BOOKS", "VOCABULARY_LOOKUP"],
  configFields: [{ key: "baseUrl", label: "API Base URL", type: "url" }],
  async createRuntime(context) {
    return new BaicizhanVocabularyProvider({ baseUrl: context.config.baseUrl, context });
  },
});
```

### Configuration

Per-provider config persists to IndexedDB `providerConfigs` via
`manager.setConfig`. `configFields` describe browser-safe fields generically
(ProviderManager renders them; secret fields must not be stored in the browser).

### Health vs sync vs cache

- `healthCheck()` performs a **remote request** and updates
  `lastHealthCheckedAt` only. It must NOT return `healthy` from a cached read:
  remote success → `healthy`; remote failure + valid cache → `degraded`;
  remote failure + no cache → `unavailable`.
- `markSynced()` updates `lastSyncAt` (separate from health).
- Cache is for **browsing resilience**, not health. Split remote fetch from
  cached read (e.g. `fetchRemoteX()` vs `getX()` with cache-first policy).

### Cache

Providers receive a **provider-scoped** cache (`${pluginId}:${key}`) via
`PluginContext.cache`. Use it for remote metadata/content with sensible TTLs.

### Configuration & secrets

`configFields` describe browser-safe fields generically (`text | url | number |
boolean | select`). Fields with `secret: true` are never rendered as inputs and
are **dropped** by `sanitizeProviderConfig()` before any IndexedDB write.

### Provenance

Every external entry must carry `source` (providerId, providerName, externalId,
sourceUrl, license, attribution, rawSourceType). Preserve provenance when adding
a word to the personal deck.

### Errors

Throw the typed errors from `src/lib/plugins/errors.ts` (network, schema, auth,
rate-limit, unavailable, not-configured). The UI normalizes and isolates them.

### Testing

- Unit-test schema validation and normalization with mocked `fetch`.
- Test failure isolation (network error, malformed response, empty result).
- Playwright-test the provider manager and vocabulary flows with mocked APIs.

## Architecture acceptance test

Adding a new `VocabularyProvider` must require only:

1. a provider implementation,
2. registration,

and must **not** require editing the Vocabulary Hub core rendering logic.
