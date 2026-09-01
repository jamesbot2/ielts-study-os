import { test, expect } from "@playwright/test";

const LIST_URL = "**/data/list.json";
const WORD_URL = "**/data/words/*.json";

function listBody(words: string[]) {
  return JSON.stringify({ total: words.length, list: words });
}

function wordBody(word: string) {
  return JSON.stringify({
    word,
    accent: `/${word}/`,
    mean_cn: `n. ${word}`,
    mean_en: `the meaning of ${word}`,
    sentence: `A sentence with ${word}.`,
    sentence_phrase: `a ${word} phrase`,
  });
}

async function mockList(page: import("@playwright/test").Page, { fail = false, words = ["example", "test"] } = {}) {
  await page.route(LIST_URL, async (route) => {
    if (fail) return route.fulfill({ status: 500, body: "boom" });
    await route.fulfill({ status: 200, contentType: "application/json", body: listBody(words) });
  });
}

async function mockWord(page: import("@playwright/test").Page, word: string) {
  await page.route(WORD_URL, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: wordBody(word) });
  });
}

async function enableBaicizhan(page: import("@playwright/test").Page) {
  await page.goto("/settings/");
  const box = page.getByRole("checkbox").first();
  if (!(await box.isChecked())) {
    await box.click();
    // Let the async IndexedDB persist finish before any navigation.
    await page.waitForTimeout(500);
  }
}

async function readVocabCards(page: import("@playwright/test").Page): Promise<Array<Record<string, unknown>>> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open("ielts-study-os");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("vocabulary", "readonly");
    const req = tx.objectStore("vocabulary").getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as Array<Record<string, unknown>>);
      req.onerror = () => reject(req.error);
    });
  });
}

// Target the Baicizhan card's Test button (the AI section also has a "Test connection").
function baicizhanCard(page: import("@playwright/test").Page) {
  return page.locator("div.rounded-md.border", { hasText: "Baicizhan Vocabulary" }).first();
}
function baicizhanTest(page: import("@playwright/test").Page) {
  return baicizhanCard(page).getByRole("button", { name: "Test", exact: true });
}

test.describe("provider configuration & health", () => {
  test("enable persists; health reflects real endpoint (no cache)", async ({ page }) => {
    await page.goto("/settings/");
    await page.getByRole("checkbox").first().click(); // enable Baicizhan

    await mockList(page, { fail: true });
    await baicizhanTest(page).click();
    await expect(page.getByText(/Could not reach/i).first()).toBeVisible();

    await mockList(page, { fail: false });
    await baicizhanTest(page).click();
    await expect(page.getByText(/Connected|连接正常/i).first()).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByRole("checkbox").first()).toBeChecked();
  });

  test("remote failure with an existing cache reports degraded, not healthy", async ({ page }) => {
    await mockList(page, { fail: false });
    await enableBaicizhan(page);

    // Populate the provider cache by browsing its book list.
    await page.goto("/vocabulary/");
    await page.getByRole("button", { name: /Word books|词库/ }).first().click();
    await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
    await expect(page.getByText(/2 words|2 个词/)).toBeVisible();

    // Now the remote fails but cache exists → degraded.
    await page.route(LIST_URL, async (route) => route.fulfill({ status: 500, body: "boom" }));
    await page.goto("/settings/");
    await baicizhanTest(page).click();
    await expect(page.getByText(/cached data available/i).first()).toBeVisible();
  });
});

test.describe("vocabulary provider browsing", () => {
  test("a mocked external book lists words via the generic browser", async ({ page }) => {
    await mockList(page);
    await enableBaicizhan(page);

    await page.goto("/vocabulary/");
    await page.getByRole("button", { name: /Word books|词库/ }).first().click();
    await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
    await expect(page.getByText(/2 words|2 个词/)).toBeVisible();
    await expect(page.getByRole("button", { name: /^example$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^test$/ })).toBeVisible();
  });

  test("add word preserves structured provenance and persists across reload", async ({ page }) => {
    await mockList(page, { words: ["example"] });
    await mockWord(page, "example");
    await enableBaicizhan(page);

    await page.goto("/vocabulary/");
    await page.getByRole("button", { name: /Word books|词库/ }).first().click();
    await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
    await page.getByRole("button", { name: /^example$/ }).click(); // open detail
    await expect(page.getByText(/A sentence with example/)).toBeVisible();
    await page.getByRole("button", { name: /Add to deck|加入单词本/ }).click();

    // Close the library browser so "example" appears only in My Vocabulary.
    await page.getByRole("button", { name: /Word books|词库/ }).first().click();

    const cards = await readVocabCards(page);
    expect(cards.length).toBe(1);
    expect(cards[0].word).toBe("example");
    expect((cards[0].source as Record<string, unknown>).providerId).toBe("baicizhan");
    expect((cards[0].source as Record<string, unknown>).externalId).toBe("example");
    expect((cards[0].source as Record<string, unknown>).bookId).toBe("all");

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText("example").first()).toBeVisible();
    expect((await readVocabCards(page)).length).toBe(1);
  });

  test("importing the same provider word twice deduplicates", async ({ page }) => {
    await mockList(page, { words: ["example"] });
    await mockWord(page, "example");
    await enableBaicizhan(page);

    async function importOnce() {
      await page.goto("/vocabulary/");
      await page.getByRole("button", { name: /Word books|词库/ }).first().click();
      await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
      await page.getByRole("button", { name: /^example$/ }).click();
      await page.getByRole("button", { name: /Add to deck|加入单词本/ }).click();
    }

    await importOnce();
    expect((await readVocabCards(page)).length).toBe(1);

    // Reload resets UI state; re-importing the same word must not duplicate it.
    await page.reload({ waitUntil: "networkidle" });
    await importOnce();
    const cards = await readVocabCards(page);
    expect(cards.length).toBe(1);
    expect(cards[0].word).toBe("example");
  });

  test("provider failure is isolated from built-in books and My Vocabulary", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await mockList(page, { fail: true });
    await enableBaicizhan(page);

    await page.goto("/vocabulary/");
    await page.getByRole("button", { name: /Word books|词库/ }).first().click();

    // Built-in provider works even though Baicizhan is down.
    await expect(page.getByRole("button", { name: /IELTS Study OS Core/ })).toBeVisible();

    // Selecting Baicizhan shows an error but does not break the page.
    await page.getByRole("button", { name: /Baicizhan Vocabulary/ }).click();
    await expect(page.getByText(/HTTP 500|Could not reach|unavailable/i).first()).toBeVisible();

    // Built-in still usable after the failure.
    await page.getByRole("button", { name: /IELTS Study OS Core/ }).click();
    await expect(page.getByRole("button", { name: /^example$/ })).not.toBeVisible();

    expect(errors).toEqual([]);
  });
});
