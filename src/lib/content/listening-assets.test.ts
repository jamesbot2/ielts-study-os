import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { targetedListeningSets } from "@/lib/content/practice/targeted/listening";
import { isPublishedTargetedSet } from "@/lib/content/practice-validation";

function localPath(src: string): string {
  const relative = src.replace(/^\/audio\//, "public/audio/");
  return join(process.cwd(), relative);
}

describe("targeted Listening playable assets", () => {
  it("every published targeted listening set references an existing, non-trivial audio file", () => {
    const published = targetedListeningSets.filter(isPublishedTargetedSet);
    expect(published.length).toBeGreaterThanOrEqual(14);
    for (const set of published) {
      const srcs = (set.audio?.parts ?? []).map((p) => p.src).filter((s): s is string => Boolean(s));
      expect(srcs.length, `${set.meta.id} audio parts`).toBeGreaterThan(0);
      for (const src of srcs) {
        const path = localPath(src);
        expect(existsSync(path), `${set.meta.id} file exists: ${path}`).toBe(true);
        expect(statSync(path).size, `${set.meta.id} file non-trivial`).toBeGreaterThan(1000);
      }
    }
  });

  it("every published targeted listening set has a non-empty transcript", () => {
    for (const set of targetedListeningSets.filter(isPublishedTargetedSet)) {
      expect((set.audio?.transcript ?? "").trim().length, `${set.meta.id} transcript`).toBeGreaterThan(50);
    }
  });
});

describe("TTS export drift", () => {
  it("generated targeted-listening.json matches canonical audio.script data", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { buildTtsJobs } = await import("@/lib/content/practice/targeted/listening/tts-export");
    const generated = JSON.parse(readFileSync(join(process.cwd(), "scripts/tts/generated/targeted-listening.json"), "utf8"));
    const canonical = buildTtsJobs();
    expect(JSON.stringify(generated)).toBe(JSON.stringify(canonical));
  });
});

describe("manifest consistency", () => {
  it("global manifest matches per-set audio parts, sizes and uniqueness", async () => {
    const { readFileSync, existsSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const manifest = JSON.parse(readFileSync(join(process.cwd(), "public/audio/targeted/manifest.json"), "utf8"));
    const parts = manifest.parts ?? [];
    expect(parts.length).toBeGreaterThanOrEqual(14);

    const seen = new Set<string>();
    for (const set of targetedListeningSets.filter(isPublishedTargetedSet)) {
      const setParts = parts.filter((p: { setId: string }) => p.setId === set.meta.id);
      expect(setParts.length, `${set.meta.id} manifest entries`).toBe(1);
      const src = set.audio?.parts?.[0]?.src;
      expect(setParts[0].src, `${set.meta.id} src matches`).toBe(src);
      const path = join(process.cwd(), src!.replace(/^\/audio\//, "public/audio/"));
      expect(existsSync(path)).toBe(true);
      expect(setParts[0].sizeBytes, `${set.meta.id} size matches`).toBe(statSync(path).size);
      expect(setParts[0].durationSeconds, `${set.meta.id} duration positive`).toBeGreaterThan(0);
    }
    for (const p of parts) {
      const key = `${p.setId}:${p.part}`;
      expect(seen.has(key), `duplicate manifest entry ${key}`).toBe(false);
      seen.add(key);
    }
    // No manifest entries for nonexistent sets.
    const ids = new Set(targetedListeningSets.filter(isPublishedTargetedSet).map((s) => s.meta.id));
    for (const p of parts) expect(ids.has(p.setId), `orphan manifest entry ${p.setId}`).toBe(true);
  });
});
