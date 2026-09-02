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
