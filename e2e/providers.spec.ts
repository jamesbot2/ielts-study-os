import { test, expect } from "@playwright/test";

const LIST_URL = "**/data/list.json";

async function mockList(page: import("@playwright/test").Page, { fail = false } = {}) {
  await page.route(LIST_URL, async (route) => {
    if (fail) return route.fulfill({ status: 500, body: "boom" });
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ total: 2, list: ["example", "test"] }) });
  });
}

test.describe("provider configuration & health", () => {
  test("enable + configure persists across reload; health reflects real endpoint", async ({ page }) => {
    await page.goto("/settings/");
    await page.getByRole("checkbox").first().click(); // enable Baicizhan
    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill("https://cdn.jsdelivr.net/gh/lyc8503/baicizhan-word-meaning-API/data");

    // "Test" persists the draft config and performs a real health check.
    await mockList(page, { fail: true });
    await page.getByRole("button", { name: /Test|测试/ }).first().click();
    await expect(page.getByText(/Could not reach|unavailable|不可用/i).first()).toBeVisible();

    await mockList(page, { fail: false });
    await page.getByRole("button", { name: /Test|测试/ }).first().click();
    await expect(page.getByText(/Connected|healthy|连接正常/i).first()).toBeVisible();

    // Reload: enabled state persists.
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByRole("checkbox").first()).toBeChecked();
  });
});

test.describe("vocabulary provider browsing", () => {
  test("a mocked external book lists words via the generic browser", async ({ page }) => {
    await mockList(page);

    // Enable the provider first.
    await page.goto("/settings/");
    await page.getByRole("checkbox").first().click();
    await page.reload({ waitUntil: "networkidle" });

    await page.goto("/vocabulary/");
    await page.getByRole("button", { name: /Word books|外部词库/ }).click();
    await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
    await expect(page.getByText(/2 words|2 个词/)).toBeVisible();
    await expect(page.getByRole("button", { name: /^example$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^test$/ })).toBeVisible();
  });
});
