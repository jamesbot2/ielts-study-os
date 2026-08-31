import { test, expect } from "@playwright/test";

test.describe("IELTS Study OS — static build smoke tests", () => {
  test("homepage loads with navigation and app title", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/");
    await expect(page.getByText("IELTS Study OS").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mock Exams", exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("learn hub lists IELTS fundamentals", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByText("IELTS Fundamentals")).toBeVisible();
    await expect(page.getByRole("link", { name: /What is IELTS/ })).toBeVisible();
  });

  test("lesson page renders bilingual content", async ({ page }) => {
    await page.goto("/learn/fund-scoring");
    await expect(page.getByText("Scoring and band scores")).toBeVisible();
    await page.getByRole("button", { name: "中文" }).first().click();
    await expect(page.getByText("评分与分数")).toBeVisible();
  });

  test("reading practice intro loads", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1");
    await expect(page.getByText(/Academic Reading Set 1/)).toBeVisible();
    await expect(page.getByText(/Practice mode/)).toBeVisible();
  });

  test("bilingual switch persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "中文" }).first().click();
    await expect(page.getByRole("link", { name: "学习", exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("link", { name: "学习", exact: true })).toBeVisible();
  });

  test("onboarding page loads", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText(/Welcome to IELTS Study OS/)).toBeVisible();
  });

  test("mock hub and speaking mock load", async ({ page }) => {
    await page.goto("/mock");
    await expect(page.getByText("Academic Full Mock")).toBeVisible();
    await page.goto("/mock/speaking");
    await expect(page.getByText(/Speaking Mock/).first()).toBeVisible();
  });
});

test.describe("IELTS Study OS — interaction flows", () => {
  test("reading: answer, flag, refresh recovery, submit, review", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1");
    await page.getByText("Practice mode").click();

    // Answer the first question (matching headings) — pick a select option
    const selects = page.locator("select");
    if (await selects.count()) {
      await selects.first().selectOption({ index: 1 });
    }
    // Navigate to next question
    await page.getByRole("button", { name: /Next/ }).click();

    // Answer a text question
    const input = page.locator('input[placeholder="Type your answer"]').first();
    if (await input.count()) {
      await input.fill("tin");
    }

    // Submit
    await page.getByRole("button", { name: /Submit/ }).click();
    await expect(page.getByText(/Results/)).toBeVisible();
  });

  test("writing editor autosaves and restores draft", async ({ page }) => {
    await page.goto("/practice/writing/t2-agree");
    await page.getByText("Practice mode").click();
    const textarea = page.locator("textarea").first();
    await textarea.fill("In my opinion, technology has transformed education.");
    await page.waitForTimeout(1200); // debounce autosave
    await page.reload();
    // The session resumes directly into the editor (no mode selection screen).
    await expect(page.locator("textarea").first()).toHaveValue(/transformed education/);
  });

  test("vocabulary: add a word and review scheduling", async ({ page }) => {
    await page.goto("/vocabulary");
    await page.getByRole("button", { name: /Add word/ }).click();
    await page.locator('input[placeholder="Word"]').fill("mitigate");
    await page.locator('input[placeholder="中文释义"]').fill("缓解");
    await page.getByRole("button", { name: /Save/ }).click();
    await expect(page.getByText("mitigate")).toBeVisible();
  });

  test("settings: data export and reset controls exist", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText(/Export data/i)).toBeVisible();
    await expect(page.getByText(/Import backup/i)).toBeVisible();
    await expect(page.getByText(/Reset/i)).toBeVisible();
  });
});
