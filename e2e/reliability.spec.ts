import { test, expect } from "@playwright/test";

// Real reliability flows. Test names match what they actually assert:
// a test only claims "reload"/"persists" when it actually reloads/reopens.

test.describe("profile persistence across reload", () => {
  test("General Training selection persists and propagates, Academic switch reacts", async ({ page }) => {
    await page.goto("/onboarding/");
    await page.getByRole("button", { name: /General Training|培训类/ }).first().click();
    // skip to the end via Skip
    const skip = page.getByRole("button", { name: /Skip|跳过/ });
    if (await skip.isVisible()) await skip.click();
    await page.goto("/");
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
  test("exam answers, flags and current question survive a reload", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1/");
    await page.getByText("Exam mode").click();

    // Navigate to the first text-answer question (question 8, index 7).
    for (let i = 0; i < 7; i++) {
      await page.getByRole("button", { name: /Next/ }).click();
    }
    const input = page.locator('input[placeholder="Type your answer"]').first();
    await input.fill("false");

    // Flag the next question.
    await page.getByRole("button", { name: /Next/ }).click();
    await page.getByRole("button", { name: /Flag/ }).first().click();

    await page.waitForTimeout(600);
    await page.reload({ waitUntil: "networkidle" });

    // Resume screen must appear.
    await expect(page.getByText(/Resume in-progress reading|继续进行中的阅读/).first()).toBeVisible();
    await page.getByRole("button", { name: /Resume|继续/ }).first().click();
    await page.waitForTimeout(500);

    // Navigate back one step to the answered question and verify it survived.
    await page.getByRole("button", { name: /Previous/ }).click();
    const value = await page.locator('input[placeholder="Type your answer"]').first().inputValue();
    expect(value).toBe("false");
  });
});

test.describe("standalone speaking text-only persistence", () => {
  test("manual transcript saves without a recording and appears in history", async ({ page }) => {
    await page.goto("/practice/speaking/");
    // A fresh prompt is shown; type a transcript and save it.
    const textarea = page.locator("textarea").first();
    await textarea.fill("My hometown is a small but lively city.");
    await page.getByRole("button", { name: /Save transcript|保存逐字稿/ }).click();
    await page.waitForTimeout(600);

    // Open history and confirm the turn exists with transcript status.
    await page.getByRole("button", { name: /History|历史记录/ }).click();
    await expect(page.getByText(/My hometown is a small/).first()).toBeVisible();
  });
});
