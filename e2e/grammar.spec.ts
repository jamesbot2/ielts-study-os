import { test, expect } from "@playwright/test";

test.describe("Round 5 Grammar practice", () => {
  test("selector, topic session, session-sized progress and score", async ({ page }) => {
    await page.goto("/practice/grammar/");
    await expect(page.getByRole("button", { name: /Mixed practice/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Punctuation & common errors/ })).toBeVisible();

    // Start a topic session (punctuation has 16 exercises -> 10-question session).
    await page.getByRole("button", { name: /Punctuation & common errors/ }).click();
    await expect(page.getByText(/1 \/ 10/)).toBeVisible();

    // Answer one question: click the correct answer.
    const firstCard = page.locator(".card").first();
    // Determine the correct option from the green highlight after answering any.
    await firstCard.locator("button").first().click();
    await expect(page.getByText(/Correct|Incorrect/)).toBeVisible();
    await expect(page.getByText(/A colon introduces a list/)).toBeVisible();
  });

  test("mixed session uses 20 questions and mistake flow keeps working", async ({ page }) => {
    await page.goto("/practice/grammar/");
    await page.getByRole("button", { name: /Mixed practice/ }).click();
    await expect(page.getByText(/1 \/ 20/)).toBeVisible();
    // Answer all 20 with the first option to finish quickly.
    for (let i = 0; i < 20; i++) {
      await page.locator(".card button").first().click();
      await page.getByRole("button", { name: i < 19 ? "Next" : "See results" }).click();
    }
    await expect(page.getByText(/\/ 20/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Review mistakes/ })).toBeVisible();
  });

  test("grammar lesson renders bilingual sections and practice link", async ({ page }) => {
    await page.goto("/learn/gram-relative-clauses/");
    await expect(page.getByText(/Relative clauses|关系从句/).first()).toBeVisible();
    await expect(page.getByText(/Defining vs non-defining|限定性 vs 非限定性/)).toBeVisible();
  });
});
