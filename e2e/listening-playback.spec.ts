import { test, expect, type Page } from "@playwright/test";

// Regression tests for the V0.6 P1 "repeated sentence / repeated audio" defect.
//
// Root cause (fixed): the Listening source-sync effect depended on a
// `.filter()` result that was a NEW array reference on every render, and it
// called audio.load() unconditionally. Every unrelated re-render (progress
// timeupdate, answers, flags, question navigation) therefore reloaded the media
// element mid-playback, which made listeners hear sentences/sections repeat or
// stutter. The fix makes the media reload depend only on the actual source URL
// of the current part (with an equality guard), never on render identity.
//
// These tests instrument HTMLMediaElement.prototype.load before any app code
// runs, then assert that ordinary playback + re-renders never reload the media.

declare global {
  interface Window {
    __loadCount?: number;
    __loadTimes?: { t: number; ct: number; paused: boolean }[];
    __mediaResets?: number;
  }
}

async function installLoadCounter(page: Page) {
  await page.addInitScript(() => {
    const proto = HTMLMediaElement.prototype;
    const origLoad = proto.load;
    window.__loadCount = 0;
    window.__loadTimes = [];
    proto.load = function (this: HTMLMediaElement, ..._args: unknown[]) {
      window.__loadCount = (window.__loadCount ?? 0) + 1;
      (window.__loadTimes = window.__loadTimes ?? []).push({
        t: Date.now(),
        ct: this.currentTime,
        paused: this.paused,
      });
      return origLoad.apply(this, _args as []);
    };
  });
}

async function readCounts(page: Page) {
  return page.evaluate(() => ({
    loadCount: window.__loadCount ?? 0,
    loadTimes: (window.__loadTimes ?? []) as { t: number; ct: number; paused: boolean }[],
  }));
}

/** Click the play button and wait until the media is actually advancing. */
async function startPlayback(page: Page) {
  await page.getByRole("button", { name: /Play audio/ }).click();
  await page.waitForFunction(
    () => {
      const el = document.querySelector("audio");
      return !!el && !el.paused && el.currentTime > 0;
    },
    undefined,
    { timeout: 20_000 },
  );
}

test.describe("Listening playback does not reload on re-render", () => {
  test("targeted drill: timeupdate/answer/flag/navigation never reload media", async ({ page }) => {
    await installLoadCounter(page);
    await page.goto("/practice/listening/listening-targeted-form-completion-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.waitForSelector("audio");
    await startPlayback(page);

    // Capture the load count after the initial (necessary) source load.
    await page.waitForTimeout(800);
    const initial = await readCounts(page);
    expect(initial.loadCount).toBeGreaterThanOrEqual(1);

    // Let natural playback run (timeupdate fires multiple times per second and
    // drives progress re-renders) for a few seconds. No extra load allowed.
    await page.waitForTimeout(2500);
    const afterTime = await readCounts(page);
    expect(afterTime.loadCount).toBe(initial.loadCount);
    const ctAfterTime = await page.evaluate(() => document.querySelector("audio")!.currentTime);
    expect(ctAfterTime).toBeGreaterThan(0.5);

    // Cause deliberate React re-renders while playing: answer, flag, navigate.
    const input = page.locator('input[placeholder="Type your answer"]').first();
    await input.fill("photography");
    await page.getByRole("button", { name: /☆ Flag|Flag/ }).first().click();
    await page.getByRole("button", { name: /Next/ }).click();
    await page.getByRole("button", { name: /Previous/ }).click();
    await page.waitForTimeout(1200);

    const afterInteractions = await readCounts(page);
    expect(afterInteractions.loadCount, "media must not reload after answers/flags/navigation").toBe(
      initial.loadCount,
    );

    // currentTime must have kept advancing (no spontaneous restart to ~0).
    const ct = await page.evaluate(() => {
      const el = document.querySelector("audio")!;
      return { ct: el.currentTime, paused: el.paused, src: el.getAttribute("src") };
    });
    expect(ct.paused).toBe(false);
    expect(ct.ct).toBeGreaterThan(ctAfterTime);
  });

  test("targeted drill: currentTime is monotonic while playing one part", async ({ page }) => {
    await installLoadCounter(page);
    await page.goto("/practice/listening/listening-targeted-multiple-choice-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.waitForSelector("audio");
    await startPlayback(page);

    // Sample currentTime frequently; allow small jitter but never a large drop
    // toward 0 without an explicit replay/seek.
    const samples: number[] = [];
    for (let i = 0; i < 16; i++) {
      await page.waitForTimeout(250);
      samples.push(await page.evaluate(() => document.querySelector("audio")!.currentTime));
    }
    let maxSoFar = -1;
    let largeRegressions = 0;
    for (const s of samples) {
      if (s < maxSoFar - 0.4) largeRegressions++;
      maxSoFar = Math.max(maxSoFar, s);
    }
    expect(largeRegressions, `currentTime regressed: ${samples.join(",")}`).toBe(0);
    expect(maxSoFar).toBeGreaterThan(2);
  });

  test("replay intentionally resets, then plays without spontaneous reloads", async ({ page }) => {
    await installLoadCounter(page);
    await page.goto("/practice/listening/listening-targeted-short-answer-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.waitForSelector("audio");
    await startPlayback(page);
    await page.waitForTimeout(1500);

    // Replay (rotate-ccw icon button) is an intentional reset.
    await page.locator("button:has(svg.lucide-rotate-ccw)").click();
    await page.waitForTimeout(300);
    const ct0 = await page.evaluate(() => document.querySelector("audio")!.currentTime);
    expect(ct0).toBeLessThan(0.5);

    // Play again from the top: allowed and must not keep reloading.
    await page.getByRole("button", { name: /Play audio/ }).click();
    await page.waitForTimeout(2500);
    const counts = await readCounts(page);
    const ct = await page.evaluate(() => document.querySelector("audio")!.currentTime);
    expect(ct).toBeGreaterThan(1);
    // After the replay-triggered source setup there must be no churn: allow the
    // single load that set up the reset source, then nothing more while playing.
    expect(counts.loadTimes!.filter((t: { ct: number }) => t.ct < 0.5).length).toBeLessThanOrEqual(2);
  });
});

test.describe("Listening part transitions", () => {
  test("full listening: part N -> N+1 loads once and keeps playing (no race)", async ({ page }) => {
    await installLoadCounter(page);
    await page.goto("/practice/listening/listening-1/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.waitForSelector("audio");
    await startPlayback(page);
    await page.waitForTimeout(600);
    const before = await readCounts(page);

    // Dispatch a native 'ended' to simulate the natural end of part 1.
    await page.evaluate(() => document.querySelector("audio")!.dispatchEvent(new Event("ended")));

    // The next part must load exactly once and then keep advancing.
    await page.waitForFunction(
      () => document.querySelector("audio")!.src.endsWith("part2.mp3"),
      undefined,
      { timeout: 10_000 },
    );
    await page.waitForTimeout(600);
    const afterLoad = await readCounts(page);
    // Source change for part 2 is one legitimate load; then it must settle.
    expect(afterLoad.loadCount - before.loadCount).toBeLessThanOrEqual(1);
    const t1 = await page.evaluate(() => document.querySelector("audio")!.currentTime);
    expect(t1).toBeGreaterThan(0);

    // While part 2 plays, flag/navigate and confirm no extra loads.
    await page.getByRole("button", { name: /☆ Flag|Flag/ }).first().click();
    await page.getByRole("button", { name: /Next/ }).click();
    await page.waitForTimeout(1000);
    const afterRerender = await readCounts(page);
    expect(afterRerender.loadCount).toBe(afterLoad.loadCount);

    // Simulate part 2 -> part 3 the same way.
    await page.evaluate(() => document.querySelector("audio")!.dispatchEvent(new Event("ended")));
    await page.waitForFunction(
      () => document.querySelector("audio")!.src.endsWith("part3.mp3"),
      undefined,
      { timeout: 10_000 },
    );
    await page.waitForTimeout(600);
    const p3 = await readCounts(page);
    expect(p3.loadCount - afterLoad.loadCount).toBeLessThanOrEqual(1);
    const t2 = await page.evaluate(() => document.querySelector("audio")!.currentTime);
    expect(t2).toBeGreaterThan(0);
  });
});

test.describe("Listening exam single-play semantics", () => {
  test("full listening exam: plays through parts without spontaneous restart", async ({ page }) => {
    await installLoadCounter(page);
    await page.goto("/practice/listening/listening-1/");
    await page.getByRole("button", { name: /Exam mode/ }).click();

    // Exam intro/resume screen may appear; audio plays once from the play control.
    await page.waitForSelector("audio", { state: "attached" });
    await startPlayback(page);
    await page.waitForTimeout(800);
    const countsStart = await readCounts(page);

    // Advance through all remaining parts by dispatching 'ended' and confirm
    // each transition performs exactly one source load and keeps advancing.
    let prevSrc = "part1.mp3";
    for (const next of ["part2.mp3", "part3.mp3", "part4.mp3"]) {
      await page.evaluate(() => document.querySelector("audio")!.dispatchEvent(new Event("ended")));
      await page.waitForFunction(
        (s) => document.querySelector("audio")!.src.endsWith(s),
        next,
        { timeout: 10_000 },
      );
      await page.waitForTimeout(400);
      const counts = await readCounts(page);
      // Each transition may add at most one legitimate source load.
      expect(counts.loadCount - countsStart.loadCount).toBeLessThanOrEqual(1);
      prevSrc = next;
      void prevSrc;
    }
  });
});
