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

test.describe("Round 3A-E visual scope and navigation", () => {
  test("full Listening map appears only for marker questions", async ({ page }) => {
    await page.goto("/practice/listening/listening-1/");
    await page.getByRole("button", { name: /Practice mode/ }).click();

    // Part 1 (hotel booking): no map.
    await expect(page.locator('svg[aria-label="Map"]')).toHaveCount(0);

    // Jump to Part 2 and reach the first map question (q13).
    await page.getByRole("button", { name: /^Part 2$/ }).click();
    await expect(page.locator('svg[aria-label="Map"]')).toHaveCount(0); // q11 is not a map question
    await page.getByRole("button", { name: /Next/ }).click();
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.locator('svg[aria-label="Map"]')).toBeVisible();

    // Part 3 (research discussion): no map.
    await page.getByRole("button", { name: /^Part 3$/ }).click();
    await expect(page.locator('svg[aria-label="Map"]')).toHaveCount(0);
  });

  test("full Mock Listening renders the map question and a 40-unit footer", async ({ page }) => {
    await page.goto("/mock/run/listening");
    await page.getByRole("button", { name: /Start mock/ }).click();
    await page.getByRole("button", { name: /Start section/ }).click();

    await expect(page.getByText(/0\/40/).first()).toBeVisible();
    await page.getByRole("button", { name: /Question 13$/ }).click();
    await expect(page.locator('svg[aria-label="Map"]')).toBeVisible();
    await expect(page.getByText(/0\/40/).first()).toBeVisible();
  });

  test("navigators show scored-unit ranges for grouped questions", async ({ page }) => {
    // Reading: matching-headings drill navigator shows 1–7.
    await page.goto("/practice/reading/reading-targeted-matching-headings-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await expect(page.getByRole("button", { name: /Questions 1 to 7/ })).toBeVisible();

    // Mock Reading navigator shows ranges for the academic matching group.
    await page.goto("/mock/run/reading");
    await page.getByRole("button", { name: /Start mock/ }).click();
    await page.getByRole("button", { name: /Start section/ }).click();
    await expect(page.getByRole("button", { name: /Questions 1 to 7/ })).toBeVisible();
  });
});

test.describe("Round 3B content", () => {
  test("note completion: audio loads, answer + submit, accuracy result, no band", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-note-completion-01/");
    await expect(page.getByText(/8 questions/).first()).toBeVisible();
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.waitForFunction(() => {
      const el = document.querySelector("audio");
      return el && el.readyState >= 1;
    }, { timeout: 20000 });
    await page.locator('input[placeholder="Type your answer"]').first().fill("success");
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/1\/8 correct/)).toBeVisible();
    await expect(page.getByText(/Accuracy/)).toBeVisible();
  });

  test("table completion: task structure visible and scorable", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-table-completion-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await expect(page.getByText(/TABLE:/)).toBeVisible();
    await page.locator('input[placeholder="Type your answer"]').first().fill("introductory");
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/1\/8 correct/)).toBeVisible();
  });

  test("summary completion: text input and accuracy result", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-summary-completion-01/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.locator('input[placeholder="Type your answer"]').first().fill("car park");
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/1\/8 correct/)).toBeVisible();
  });

  test("short answer: numeric answers scorable", async ({ page }) => {
    await page.goto("/practice/listening/listening-targeted-short-answer-02/");
    await page.getByRole("button", { name: /Practice mode/ }).click();
    await page.locator('input[placeholder="Type your answer"]').first().fill("5 minutes");
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/1\/8 correct/)).toBeVisible();
  });
});
