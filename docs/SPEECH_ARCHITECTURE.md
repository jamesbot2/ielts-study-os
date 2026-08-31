# Speech Architecture

Speaking works with **no speech service and no key**. Audio-based scoring is
strictly optional and never fabricated from text.

## Recording (`MediaRecorder`)

- MIME type is selected dynamically with `MediaRecorder.isTypeSupported`
  (webm/opus → webm → mp4 → ogg), not hardcoded to Chrome.
- Permission denied / unsupported / empty recordings produce clear errors and
  fall back to manual transcript.
- Recordings are stored as Blobs in IndexedDB (with duration, MIME type, size,
  created-at). Users can play back, and delete them via data reset.

## Transcription

- **Manual transcript** always works.
- Optional STT: configure a `sttBaseUrl` in Settings. The app posts audio to
  `${baseUrl}/transcribe` and reads `{ text }`. A local `faster-whisper` HTTP
  service is the documented target.

## Metrics — two distinct classes

**Transcript-based** (deterministic, always available):

- duration, word count, WPM, filler count, vocabulary diversity (type-token
  ratio), sentence stats.

**Audio-based pronunciation** (only when a real audio engine runs):

- pronunciation score, accuracy/fluency/completeness, per-word scores.

These are never conflated. The UI shows **"Pronunciation: not evaluated"**
without an audio engine.

## Audio generation (Listening tests)

Original Listening audio is generated with **Piper** (local, permissively-licensed
TTS) from the speaker-marked scripts in `scripts/tts/listening-scripts.json`.

- Generation: `python scripts/tts/generate_audio.py` (reads voices from
  `scripts/tts/voices/`, which is gitignored; writes MP3s to
  `public/audio/listening-1/`).
- Voices: en_US-lessac-medium, en_GB-northern_english_male-medium,
  en_US-ryan-high (used for different speakers).
- The generated MP3s are original and committed; the large voice models are not.

## Player behavior

- **Practice mode**: replay and seek allowed; transcript available after playback.
- **Exam mode**: one playback, no seek, no replay, transcript hidden until
  submission.
