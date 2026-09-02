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

    // Question 1: Choose TWO services Student B mentions (correct A + C).
    // Select A (correct) + D (wrong) -> partial 1/2.
    await page.getByText("Choose TWO").first().waitFor();
    await page.locator("button", { hasText: "Online journals" }).click();
    await page.locator("button", { hasText: "The printing service" }).click();
    // Attempt a third selection — must be prevented.
    await page.locator("button", { hasText: "Borrowing a laptop" }).click();
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

test.describe("spatial and numbering corrections", () => {
  test("map drill renders blank-marker visual without leaked answers", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-map-labelling-01/");
    await expect(page.getByText(/6 questions/).first()).toBeVisible();
    await page.getByRole("button", { name: /Practice mode/ }).click();

    // Visual stimulus exists.
    const svg = page.locator('svg[aria-label="Map"]');
    await expect(svg).toBeVisible();
    // No answer names are prefilled anywhere in the visual or prompts.
    const text = await page.locator("main").innerText();
    for (const leak of ["post office", "bank", "museum", "pharmacy", "clock tower", "park"]) {
      expect(text.toLowerCase(), `leak: ${leak}`).not.toContain(leak);
    }

    // Audio loads.
    await page.waitForFunction(() => {
      const el = document.querySelector("audio");
      return el && el.src.length > 0 && el.readyState >= 1;
    }, { timeout: 20000 });

    // Fill only marker A correctly (post office is audible from the script).
    await page.locator('input[placeholder="Type your answer"]').first().fill("post office");
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/1\/6 correct/)).toBeVisible();
  });

  test("grouped questions display unit ranges, not skipped numbers", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-multiple-answer-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await expect(page.getByText(/Questions 1–2 of 14/)).toBeVisible();
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText(/Questions 3–4 of 14/)).toBeVisible();
  });

  test("matching progress uses scored units (4/8 after four items)", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-matching-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await expect(page.getByText(/Questions 1–4 of 8/)).toBeVisible();
    const selects = page.locator("select");
    for (let i = 0; i < 4; i++) await selects.nth(i).selectOption("A");
    await expect(page.getByText(/4\/8/).first()).toBeVisible();
  });
});
