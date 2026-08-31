# Speech Architecture

Speaking must work with **no speech API key**. The design separates three
concerns and makes audio-based scoring strictly optional.

## Provider interfaces (`src/lib/speech/providers.ts`)

```ts
interface SpeechToTextProvider { name; transcribe(audio, opts?): Promise<{transcript, language?, confidence?, words?}> }
interface PronunciationAssessmentProvider { name; assess(audio, referenceText): Promise<PronunciationScore> }
interface TextToSpeechProvider { name; synthesize(text, opts?): Promise<ArrayBuffer> }
```

Implementations:

- `WhisperHttpProvider` — calls a local `faster-whisper` HTTP service.
- `OpenAICompatibleSttProvider` — OpenAI-compatible `/audio/transcriptions`.

`src/lib/speech/index.ts` reads server-side speech config (DB + env) and returns
a provider only if configured.

## Client recording flow

1. `MediaRecorder` captures audio in the browser.
2. Recording is kept in memory (blob URL) for playback; no upload is required.
3. If STT is configured, `POST /api/stt` (multipart) transcribes.
4. Otherwise the learner enters a transcript manually.
5. Deterministic transcript metrics (`computeTranscriptMetrics`) run on any text.

## Metrics — two distinct classes

**Transcript-based** (always available, from text):

- duration, word count, WPM, filler frequency, repeated words, vocabulary
  diversity (type-token ratio), sentence count/length.

**Audio-based pronunciation** (only when a real audio engine ran):

- pronunciation score, accuracy/fluency/completeness, per-word scores.

These are **never conflated**. Text metrics never imply pronunciation quality.

## Pronunciation policy

Without a pronunciation provider, the UI shows **"Pronunciation: not evaluated"**.
The app never fabricates a pronunciation score from text alone.

## Local options (documented, optional)

- `faster-whisper` (recommended): `pip install faster-whisper`, expose a small
  HTTP endpoint; point `STT_BASE_URL` at it.
- `whisper` / `WhisperX` / forced alignment (e.g. Montreal Forced Aligner) for
  phoneme-level analysis in the future.

## TTS / examiner voice

`TextToSpeechProvider` is defined for future examiner-voice and practice-audio
generation (e.g. reading Listening scripts aloud). Not required for the current
version.

## Storage & privacy

Recordings are held client-side by default. Persisted recordings (future) go
under the gitignored `data/uploads/` directory and are never committed.
