import { test, expect } from "@playwright/test";

test.describe("IELTS Study OS smoke tests", () => {
  test("homepage loads with navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("IELTS Study OS").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Learn/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Mock Exams/ })).toBeVisible();
  });

  test("learn hub lists fundamentals", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByText("IELTS Fundamentals")).toBeVisible();
    await expect(page.getByRole("link", { name: /What is IELTS/ })).toBeVisible();
  });

  test("reading practice intro loads", async ({ page }) => {
    await page.goto("/practice/reading/academic-reading-1");
    await expect(page.getByText(/Academic Reading Set 1/)).toBeVisible();
    await expect(page.getByText(/Practice mode/)).toBeVisible();
  });

  test("bilingual switch changes navigation language", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "中文" }).first().click();
    // After switching to Chinese, the nav label should be 学习
    await expect(page.getByRole("link", { name: /学习/ })).toBeVisible();
  });

  test("onboarding page loads", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText(/Welcome to IELTS Study OS/)).toBeVisible();
  });
});
