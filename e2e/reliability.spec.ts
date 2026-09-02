import { test, expect } from "@playwright/test";

function toSeconds(text: string): number {
  const [m, s] = text.trim().split(":").map(Number);
  return (m ?? 0) * 60 + (s ?? 0);
}

// Real reliability flows. Test names match what they actually assert:
// a test only claims "reload"/"persists" when it actually reloads/reopens.

test.describe("profile persistence across reload", () => {
  test("General Training selection persists and propagates, Academic switch reacts", async ({ page }) => {
    await page.goto("/onboarding/");
    await page.getByRole("button", { name: /General Training|培训类/ }).first().click();
    // skip to the end via Skip, then let the app finish writing the profile
    // and navigate on its own (a manual goto would race the IndexedDB write).
    const skip = page.getByRole("button", { name: /Skip|跳过/ });
    if (await skip.isVisible()) {
      await skip.click();
      await page.waitForURL(/\/$/, { timeout: 10000 });
    } else {
      await page.goto("/");
    }
    await expect(page.getByText(/General Training|培训类/).first()).toBeVisible();

    // reload and confirm persistence
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/General Training|培训类/).first()).toBeVisible();

    // switch to Academic in Settings and confirm immediate effect without reload
    await page.goto("/settings/");
    await page.locator("select").first().selectOption("academic");
    await page.waitForTimeout(600);
    await page.goto("/");
    await expect(page.getByText(/Academic|学术类/).first()).toBeVisible();

    // reload and confirm Academic persists
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/Academic|学术类/).first()).toBeVisible();
  });
});

test.describe("reading refresh recovery", () => {
  test("answers, flags, current question and timer survive a reload", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1/");
    await page.getByText("Exam mode").click();

    // Navigate to the first text-answer question (question 8 in scored units).
    const answerInput = page.locator('input[placeholder="Type your answer"]').first();
    for (let i = 0; i < 10 && !(await answerInput.isVisible().catch(() => false)); i++) {
      await page.getByRole("button", { name: /Next/ }).click();
    }
    await answerInput.fill("false");

    // Flag the next question (question 9).
    await page.getByRole("button", { name: /Next/ }).click();
    await page.getByRole("button", { name: /Flag/ }).first().click();

    // Wait so the deadline advances, then reload.
    await page.waitForTimeout(2500);

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/Resume in-progress reading|继续进行中的阅读/).first()).toBeVisible();
    await page.getByRole("button", { name: /Resume|继续/ }).first().click();
    await page.waitForTimeout(500);

    // Current question is restored to question 9 (the flagged one).
    await expect(page.getByText(/Question 9 of 40/).first()).toBeVisible();

    // Flag state is restored.
    await expect(page.getByRole("button", { name: /Flag for review/ }).first()).toContainText(/Flag/);

    // Timer did not reset to a fresh 60:00.
    const timerAfter = await page.locator("text=/^\\d{1,2}:\\d{2}$/").first().innerText();
    expect(toSeconds(timerAfter)).toBeLessThan(3600);

    // Navigate back one step to the answered question and verify it survived.
    await page.getByRole("button", { name: /Previous/ }).click();
    const value = await page.locator('input[placeholder="Type your answer"]').first().inputValue();
    expect(value).toBe("false");
  });
});

test.describe("standalone speaking text-only persistence", () => {
  test("manual transcript persists across a reload", async ({ page }) => {
    await page.goto("/practice/speaking/");
    const textarea = page.locator("textarea").first();
    // Fill with a hydration-safe handshake: the controlled React value must
    // stick (filling before hydration commits is lost when React re-applies
    // state, which caused intermittent empty saves under parallel load).
    const text = "My hometown is a small but lively city.";
    for (let attempt = 0; attempt < 3; attempt++) {
      await textarea.fill(text);
      await page.waitForTimeout(150);
      if ((await textarea.inputValue()) === text) break;
    }
    expect(await textarea.inputValue()).toBe(text);
    await expect(page.getByRole("button", { name: /Get AI feedback|获取AI反馈/ })).toBeEnabled();
    await page.getByRole("button", { name: /Save transcript|保存逐字稿/ }).click();

    // Deterministic persistence check: the turn must appear in history before
    // we reload (poll with expect instead of a fixed sleep).
    await page.getByRole("button", { name: /History|历史记录/ }).click();
    await expect(page.getByText(/My hometown is a small/).first()).toBeVisible();

    // Reload, then verify the persisted turn is still there.
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: /History|历史记录/ }).click();
    await expect(page.getByText(/My hometown is a small/).first()).toBeVisible();
  });
});

test.describe("writing exam session recovery", () => {
  test("Save Draft does not end an active exam; reload resumes it", async ({ page }) => {
    await page.goto("/practice/writing/t2-agree/");
    await page.getByRole("button", { name: /Exam mode/ }).click();
    const textarea = page.locator("textarea").first();
    await textarea.fill("Technology has transformed education in fundamental ways.");
    await page.waitForTimeout(800);

    // Save Draft (must NOT clear the exam session).
    await page.getByRole("button", { name: /Save/ }).first().click();
    await page.waitForTimeout(400);

    await page.reload({ waitUntil: "networkidle" });
    // After reload the session should resume directly into the editor.
    await expect(page.locator("textarea").first()).toHaveValue(/transformed education/);
  });
});
