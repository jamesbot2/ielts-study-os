# Content Policy

## Rule

This repository **does not** redistribute copyrighted Cambridge IELTS books, paid
test banks, audio, images, PDFs or leaked exam questions. "Legally available
online" is **not** the same as "licensed for redistribution".

## Four source classes

1. **ORIGINAL** — questions and passages written specifically for this project
   (CC0). All bundled practice content is ORIGINAL.
2. **AI_GENERATED** — original IELTS-style content produced by AI, always labelled:
   > "AI-generated practice material — not an official IELTS question."
   Generation runs schema validation + an answer-consistency check.
3. **OPEN_LICENSED** — content whose license genuinely permits redistribution
   (e.g. CC0 / CC-BY with attribution). Not currently bundled; supported by the
   model.
4. **USER_IMPORTED** — material legally owned or provided by the user (e.g. their
   own Cambridge IELTS book entered manually, personal notes, licensed content).
   Stored locally and **never** committed.

## Importing your own materials

The Material Library supports text and Markdown import now (PDF/DOCX adapters
planned). Each imported item records title, skill, test type, source type, source
name, source reference, license and copyright status. You are responsible for
ensuring you have the right to use what you import.

## Metadata contract

Every content set carries:

```
id, title, skill, testType, sourceType, sourceName, sourceReference, license,
copyrightStatus, academicOrGeneral, questionTypes, difficulty,
estimatedBandRange, createdAt, verifiedAt, generatedByAI, generationModel,
reviewStatus
```

## What we do NOT do

- Scrape commercial question banks into the repository.
- Bundle Cambridge IELTS audio/images/PDFs/answer keys.
- Claim AI-generated scores are official IELTS scores.
- Fabricate pronunciation scores from text alone.
- Ship leaked or "recalled" exam questions.

## Trademark / brand

The project uses no official IELTS/British Council/IDP/Cambridge logos or visual
branding. The clear disclaimer appears in the app and README:

> This project is an independent learning tool and is not affiliated with,
> endorsed by, or approved by IELTS, British Council, IDP, or Cambridge
> University Press & Assessment.
