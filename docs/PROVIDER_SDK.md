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

### Registration

Add plugin metadata to `src/lib/plugins/vocabulary/index.ts`
(`registerVocabularyPlugins` + `getVocabularyProviders`), reading enabled state
and config from IndexedDB `providerConfigs`.

### Configuration

Persist per-provider config via `manager.setConfig(pluginId, patch)`. Read it in
`getVocabularyProvider(id)` and construct the provider instance with it.

### Health

Implement `healthCheck()` returning `PluginHealth { status, message?, checkedAt }`.
Status: `healthy | degraded | unavailable | not_configured`.

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
