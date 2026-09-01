# V0.5 Plugin / Provider Architecture

This release introduces a canonical plugin/provider architecture so future
integrations (vocabulary, practice, speaking, speech, resources) do not require
editing core Vocabulary / Practice / Speaking UI.

## Audit of current integration points

- **Resource Center** (`src/lib/content/resources.ts`): static, hardcoded
  resource cards with `[Open resource]` links. No explicit integration modes.
- **Vocabulary** (`src/components/vocabulary-module.tsx`): built-in topic
  library (hardcoded import) + personal FSRS deck (IndexedDB).
- **Practice** (`src/lib/content/practice/*`): static, bundled original sets.
- **Speaking** (`src/components/speaking-*`): built-in topics + manual transcript
  + optional remote AI/STT via settings URLs.
- **AI** (`src/lib/ai/client.ts`): `AiClient` abstraction (Disabled / RemoteProxy).
- **IndexedDB** (`src/lib/storage/db.ts`): Dexie, `DB_VERSION` 3.

## External projects referenced

| Project | License | Integration mode | Status |
|---|---|---|---|
| Baicizhan (community API) | Unspecified (proprietary content) | native-provider | active (lookup) |
| sifu-ewu/ielts-reading-mock-test | MIT | native-provider (planned) | planned |
| aimerfeng/ists | MIT | reference | reference |
| Talljack/echo-type | MIT | reference | reference |
| KaichenCurry/ielts-speaking-ai | MIT | reference | reference |
| sallowayma-git/IELTS-practice | GPL-3.0 | external | external |

## Proposed architecture

```
External Source → Provider/Adapter → Canonical Schema → Existing Core Features
```

Modules under `src/lib/plugins/`:

- `types.ts` — `IeltsPlugin`, `PluginKind`, `PluginCapability`, `PluginHealth`.
- `registry.ts` — register/list/find by id/capability/kind.
- `manager.ts` — enable/disable, config, health, cache adapter.
- `errors.ts` — typed `ProviderError` + normalization.
- `vocabulary/` — `VocabularyProvider`, canonical entry schema, builtin +
  Baicizhan providers, runtime.
- `practice/` — `PracticeProvider` foundation (normalize → existing `PracticeSet`).
- `speaking/` — STT/TTS/pronunciation/evaluation/prompt interfaces (foundation).
- `resources/registry.ts` — external project integration map.

## Migration plan

- `DB_VERSION` 2 → 3: added `providerConfigs` and `providerCache` tables.
- No existing data is modified or removed.

## Risks

- Baicizhan content is proprietary: provider fetches at runtime, never bundles.
- Baicizhan community API has no CORS guarantee in every environment; failures
  are isolated via typed errors and the app falls back to built-in vocabulary.

## Testing plan

- Unit: registry, capability filtering, error normalization, builtin/baicizhan
  providers (schema validation + normalization), resource registry.
- Migration: v2 → v3 preserves all data and adds provider tables.
- Playwright: provider manager and vocabulary provider flows (mocked).
