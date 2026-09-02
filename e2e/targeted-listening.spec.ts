import { test, expect } from "@playwright/test";

test.describe("targeted Listening drills", () => {
  test("multiple-answer drill: audio loads, selectCount enforced, partial credit 1/2", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-multiple-answer-01/");

    // Targeted drill intro: no 4-parts/full-test claim, scored-unit count.
    await expect(page.getByText(/Targeted Listening drill|专项听力训练/)).toBeVisible();
    await expect(page.getByText(/4 parts/)).not.toBeVisible();
    await expect(page.getByText(/14 questions/).first()).toBeVisible();

    await page.getByRole("button", { name: /Practice mode/ }).click();

    // Audio is present and loadable.
    await page.waitForFunction(() => {
      const el = document.querySelector("audio");
      return el && el.src.length > 0 && el.readyState >= 1;
    }, { timeout: 20000 });

    // Question 1: Choose TWO (correct A + B). Select A + wrong C.
    await page.getByText("Choose TWO").first().waitFor();
    await page.locator("button", { hasText: "Group study rooms" }).click();
    await page.locator("button", { hasText: "A language café" }).click();
    // Attempt a third selection — must be prevented.
    await page.locator("button", { hasText: "A bookshop" }).click();
    const selectedCount = await page.locator("button.border-accent").count();
    expect(selectedCount).toBe(2);

    // Submit everything else blank.
    await page.getByRole("button", { name: /Submit/ }).click();

    // Partial credit: 1 correct unit of 14 (only "Group study rooms" was right).
    await expect(page.getByText(/1\/14 correct/)).toBeVisible();
    await expect(page.getByText(/Accuracy 7%/)).toBeVisible();
  });

  test("matching drill shows item-level partial results", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-matching-01/");
    await expect(page.getByText(/8 questions/).first()).toBeVisible();
    await page.getByRole("button", { name: /Practice mode/ }).click();

    const selects = page.locator("select");
    await expect(selects).toHaveCount(4);
    await selects.nth(0).selectOption("A");
    await selects.nth(1).selectOption("C"); // wrong (Ben = B)
    await selects.nth(2).selectOption("C");
    await selects.nth(3).selectOption("D");

    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/3\/8 correct/)).toBeVisible();
  });
});
