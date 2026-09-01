# External Integrations

Integration modes and status for external IELTS projects.

| Mode | Meaning |
|---|---|
| `native-provider` | data/function integrated into IELTS Study OS |
| `embedded` | external app embedded or separately hosted |
| `external` | deep link only |
| `reference` | architecture/code reference only |

## Active

- **Baicizhan Vocabulary** — native-provider (lookup). Unofficial community API
  (`lyc8503/baicizhan-word-meaning-API`). Data fetched at runtime, never bundled.
  Content is proprietary Baicizhan data and is **not** redistributed.
  **Important**: the community source exposes a flat ~10,927-word catalog, not a
  verified IELTS-specific book; the UI labels it honestly as a flat word catalog.

## Planned

- **IELTS Reading Mock (sifu-ewu/ielts-reading-mock-test)** — MIT. Practice
  provider planned; only original content would be used.

## Reference only

- **ists (aimerfeng/ists)** — MIT. Architecture reference.
- **EchoType (Talljack/echo-type)** — MIT. Architecture/FSRS/pronunciation reference.
- **IELTS Speaking AI (KaichenCurry/ielts-speaking-ai)** — MIT. Speaking reference.

## External only

- **IELTS Atlas (sallowayma-git/IELTS-practice)** — GPL-3.0, third-party content
  risk. External link only.

See `src/lib/plugins/resources/registry.ts` for the machine-readable registry.
