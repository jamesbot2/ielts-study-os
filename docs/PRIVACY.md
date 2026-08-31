# Privacy

IELTS Study OS is a **local-first** application.

## Where your data lives

- Your profile, progress, vocabulary, mistakes, drafts, speaking sessions, mock
  attempts and analytics are stored **locally in your browser** (IndexedDB).
- Speaking recordings are held in IndexedDB (as Blobs) on your device.
- Imported materials remain on your device.
- A small amount of non-sensitive preference data (interface language) is stored
  in `localStorage`.

## What is NOT sent anywhere

By default, the application makes **no network requests** for your data. It does
not upload your recordings, essays, or imported materials to any server.

## Optional remote services

If you choose to configure an AI backend or a speech-to-text endpoint, then
**only the data needed for that specific request** is sent to the URL you
configure:

- AI writing/speaking evaluation: the prompt, your answer/transcript and metrics.
- Speech-to-text: the audio you explicitly submit for transcription.

You are responsible for choosing a service you trust. The application never
stores or transmits provider secret keys; it only stores a public proxy URL.

## Browser storage is not encrypted storage

The app does not pretend browser storage is secure against a third party with
access to your device or browser profile. Do not store third-party secrets in
this application.

## Backups and deletion

- Export your data at any time from Settings (a versioned JSON file).
- Reset local data from Settings to permanently delete everything stored in
  IndexedDB (recordings included).
