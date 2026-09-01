import { test, expect } from "@playwright/test";

const AGENT_URL = "**/api/coach/agent";

async function configureAiProxy(page: import("@playwright/test").Page) {
  await page.goto("/settings/");
  const input = page.getByLabel("Remote AI proxy URL");
  await input.fill("http://127.0.0.1:4173");
  await page.getByRole("button", { name: /Save/ }).first().click();
  await page.waitForTimeout(200);
}

async function readStudyTasks(page: import("@playwright/test").Page): Promise<Array<Record<string, unknown>>> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open("ielts-study-os");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("studyTasks", "readonly");
    return new Promise((resolve, reject) => {
      const req = tx.objectStore("studyTasks").getAll();
      req.onsuccess = () => resolve(req.result as Array<Record<string, unknown>>);
      req.onerror = () => reject(req.error);
    });
  });
}

test.describe("AI Coach", () => {
  test("streams citations + action proposal, persists conversation, confirms writes", async ({ page }) => {
    const stream = [
      '{"type":"delta","text":"Your recent Reading accuracy is low."}',
      '{"type":"citation","citation":{"id":"c1","sourceId":"ielts-org","title":"IELTS.org","url":"https://ielts.org"}}',
      '{"type":"action_proposal","action":{"type":"create_study_task","title":"Do a reading set","href":"/practice/reading","estimatedMinutes":20}}',
      '{"type":"done"}',
    ].join("\n");

    await page.route(AGENT_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/x-ndjson", body: stream }),
    );

    await configureAiProxy(page);
    await page.goto("/coach/");

    const input = page.getByPlaceholder(/Ask about a question|ask about|progress/i).first();
    await input.fill("What should I study next?");
    await input.press("Enter");

    // Streamed answer text.
    await expect(page.getByText(/Your recent Reading accuracy is low/)).toBeVisible();
    // Citation renders with a valid source link.
    const sourceLink = page.getByRole("link", { name: /IELTS.org/ });
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute("href", "https://ielts.org");
    // Action proposal requires explicit confirmation.
    await expect(page.getByText(/Do a reading set/)).toBeVisible();

    // No task exists before confirmation.
    expect(await readStudyTasks(page)).toHaveLength(0);
    await page.getByRole("button", { name: /Add to study plan/ }).click();
    const tasks = await readStudyTasks(page);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe("Do a reading set");
    expect(tasks[0].href).toBe("/practice/reading");

    // Conversation persists across reload.
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/Your recent Reading accuracy is low/)).toBeVisible();
  });

  test("shows controlled error when the service fails", async ({ page }) => {
    await page.route(AGENT_URL, (route) => route.fulfill({ status: 500, body: "boom" }));
    await configureAiProxy(page);
    await page.goto("/coach/");
    const input2 = page.getByPlaceholder(/Ask about a question|ask about|progress/i).first();
    await input2.fill("hello");
    await input2.press("Enter");
    await expect(page.getByText(/500|proxy returned/i).first()).toBeVisible();
    // The rest of the app shell is still present.
    await expect(page.getByRole("link", { name: /Dashboard/ })).toBeVisible();
  });

  test("lesson Ask Coach passes PageContext", async ({ page }) => {
    await page.route(AGENT_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/x-ndjson", body: '{"type":"delta","text":"ok"}\n{"type":"done"}\n' }),
    );
    await configureAiProxy(page);
    await page.goto("/learn/fund-what-is-ielts/");
    const ask = page.getByRole("link", { name: /Ask AI Coach|问 AI 教练/ });
    await expect(ask).toBeVisible();
    await ask.click();
    await expect(page).toHaveURL(/coach\/\?context=/);

    // Capture the request body to prove PageContext is included.
    let body: Record<string, unknown> | null = null;
    page.on("request", (req) => {
      if (req.url().includes("/api/coach/agent")) body = req.postDataJSON();
    });
    const input = page.getByPlaceholder(/Ask about a question|ask about|progress/i).first();
    await input.fill("explain this lesson");
    await input.press("Enter");
    await expect(page.getByText(/^ok$/)).toBeVisible();
    expect(body).not.toBeNull();
    expect((body as unknown as Record<string, unknown>).pageContext).toMatchObject({ kind: "lesson", lessonId: "fund-what-is-ielts" });
  });
});
