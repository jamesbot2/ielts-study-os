# Data Backup, Export & Import

Because the app is static and local-first, your data portability is your
responsibility — so it is built in.

## Export

**Settings → Export data** downloads a single JSON file:

```json
{
  "format": "ielts-study-os-backup",
  "version": 1,
  "exportedAt": "…",
  "data": { "profile": […], "vocabulary": […], … }
}
```

It contains every table (profile, settings, study tasks, lesson progress,
vocabulary + FSRS state, practice attempts, mistakes, writing drafts and
submissions, speaking sessions/recordings metadata/transcripts, mock attempts,
imported materials).

## Import

**Settings → Import backup** accepts that JSON file.

- **Merge** — adds records that are not already present; never overwrites.
- **Replace** — clears all current data first, then restores the backup.

Import is validated with Zod:

- the file must have `format: "ielts-study-os-backup"`;
- the version is checked (a newer backup version is rejected with a clear
  message asking you to update the app);
- malformed files fail with a useful error and change nothing.

No data is ever silently overwritten. `Replace` is only performed after an
explicit confirmation.

## Reset

**Settings → Reset local data** deletes the entire IndexedDB database after a
confirmation, then reloads. This removes recordings too.

## Migration from the V0.1 SQLite version

V0.1 stored data in `data/ielts.db` (SQLite). V0.2 uses IndexedDB. There is no
automatic migration between these backends. If you have V0.1 data you want to
keep, export it as JSON from the old version's `/api/export` endpoint before
upgrading, then import it via Settings. (The old export is a `{tableName: rows}`
map, which the importer can accept for the tables it knows.)
