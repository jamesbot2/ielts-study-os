import { test, expect } from "@playwright/test";

test.describe("Round 4 Writing content", () => {
  test("Academic Task 1 data prompt shows usable stimulus", async ({ page }) => {
    await page.goto("/practice/writing/acad-t1-line-2/");
    await expect(page.getByText(/Cinema and streaming/)).toBeVisible();
    await expect(page.getByText(/Cinema tickets/)).toBeVisible(); // visualDescription
    // Start practice mode to reach the textarea.
    await page.getByRole("button", { name: /Practice mode/ }).click();
    const textarea = page.locator("textarea").first();
    await expect(textarea).toBeVisible();
    await textarea.fill("The graph shows an overall decline in cinema ticket sales while streaming subscriptions rose steadily.");
    await expect(page.getByText(/Word count/i)).toBeVisible();
  });

  test("Academic table prompt shows the data table", async ({ page }) => {
    await page.goto("/practice/writing/acad-t1-table-2/");
    await expect(page.getByText(/Region/)).toBeVisible();
    await expect(page.getByText(/North/)).toBeVisible();
  });

  test("General Task 1 shows three requirement bullets", async ({ page }) => {
    await page.goto("/practice/writing/gen-t1-semi-advice-01/");
    await expect(page.getByText(/welcome them to the neighbourhood/)).toBeVisible();
    await expect(page.getByText(/tell them about local services/)).toBeVisible();
    await expect(page.getByText(/offer practical help/)).toBeVisible();
  });

  test("Task 2 shows prompt with 250-word guidance", async ({ page }) => {
    await page.goto("/practice/writing/t2-discuss-3/");
    await expect(page.getByText(/younger workers/)).toBeVisible();
    await expect(page.getByText(/250/)).toBeVisible();
  });

  test("Writing library lists expanded prompts", async ({ page }) => {
    await page.goto("/practice/writing/");
    await expect(page.getByRole("link", { name: /Sports participation by age/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Driverless cars|Outweigh: driverless cars/ })).toBeVisible();
  });
});
