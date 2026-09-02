import { test, expect } from "@playwright/test";

const ANSWERS = ["TRUE", "FALSE", "NOT GIVEN", "TRUE", "FALSE", "TRUE", "FALSE", "NOT GIVEN"];

test.describe("targeted Reading drill", () => {
  test("opens from Practice, has no exam-mode UX, scores by accuracy without a band", async ({ page }) => {
    await page.goto("/practice/");
    await expect(page.getByText(/Targeted Reading drills|阅读专项训练/)).toBeVisible();

    // Open the first TFNG drill.
    await page.getByRole("link", { name: /Marston cycling scheme/ }).click();
    await expect(page).toHaveURL(/reading-targeted-tfng-01/);

    // No 60-minute exam mode for a targeted drill; question count is not 40.
    await expect(page.getByText(/60 minutes/)).not.toBeVisible();
    await expect(page.getByText(/8 questions/).first()).toBeVisible();

    // Start in practice mode.
    await page.getByRole("button", { name: /Practice mode/ }).click();

    // Answer all 8 questions with the correct answers.
    for (let i = 0; i < ANSWERS.length; i++) {
      const input = page.locator('input[placeholder="Type your answer"]');
      await input.fill(ANSWERS[i]);
      if (i < ANSWERS.length - 1) {
        await page.getByRole("button", { name: /^Next/ }).click();
      }
    }

    await page.getByRole("button", { name: /Submit/ }).click();

    // Results use the actual total and show accuracy, not a band.
    await expect(page.getByText(/8\/8 correct/)).toBeVisible();
    await expect(page.getByText(/Accuracy 100%/)).toBeVisible();
    // The full-test raw-to-band note is hidden for targeted drills.
    await expect(page.getByText(/Raw-score conversion uses published approximate tables/)).not.toBeVisible();
  });

  test("existing full Reading test still offers exam mode", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1/");
    await expect(page.getByText(/60 minutes/)).toBeVisible();
    await expect(page.getByText(/40 questions/).first()).toBeVisible();
  });
});
