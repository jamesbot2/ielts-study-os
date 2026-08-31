# Deployment

IELTS Study OS is deployed to **Vercel** as a pure static site.

## Production URL

- **https://ielts-study-os.vercel.app**

## How it works

- Vercel detects **Next.js** and runs `npm run build`, which performs a static
  export (`output: "export"`) into `out/`.
- Vercel serves the static `out/` directory. There are **no serverless
  functions, no backend, and no database**.
- The Git repository is connected to Vercel:

  | Setting | Value |
  |---|---|
  | Provider | GitLab |
  | Repository | `ejimm363/ielts-study-os` |
  | Production branch | `main` |

- A push to any branch (or a pull request) creates a **Preview Deployment**.
- A push/merge to `main` creates the **Production Deployment**.

## Environment variables

**None required.** The static site stores all learner data in the browser
(IndexedDB) and requires no API keys.

## IndexedDB note

Learner data (profile, progress, vocabulary, recordings, drafts, mock attempts)
is **browser-local**. Different browsers/devices have independent IndexedDB
databases — there is no server backup or cross-device sync by design.

## Manual deployment via Vercel CLI

```bash
vercel link                # once, to link this directory to the project
vercel deploy              # preview deployment
vercel deploy --prod       # production deployment
vercel whoami              # confirm the authenticated account
```

## Unlinking

```bash
vercel unlink              # remove the local project link (.vercel/project.json)
```

The `.vercel` directory is gitignored and never committed.

## Local preview of the static build

```bash
npm run build
python3 -m http.server 4173 --directory out   # or: npx serve out
```
