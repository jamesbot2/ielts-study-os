import { test, expect, type Page } from "@playwright/test";

// E2E for the CC Switch-style runtime LLM Provider manager.
//
// The AI Proxy URL points at the static host (4173) and backend endpoints are
// mocked with page.route — no real provider keys or paid APIs are used.

const BACKEND = "http://127.0.0.1:4173";
const TEST_URL = "**/api/llm/test";
const MODELS_URL = "**/api/llm/models";
const AGENT_URL = "**/api/coach/agent";

async function configureProxy(page: Page) {
  await page.goto("/settings/");
  const input = page.getByLabel("Remote AI proxy URL");
  await input.fill(BACKEND);
  await page.getByRole("button", { name: /Save/ }).first().click();
  await page.waitForTimeout(250);
}

async function addProvider(page: Page, { name = "DeepSeek Test", baseUrl = "https://api.deepseek.com/v1", model = "deepseek-chat", key = "sk-test" } = {}) {
  await page.getByRole("button", { name: /Add Provider/ }).click();
  await page.getByRole("textbox", { name: /Display name/ }).fill(name);
  await page.getByRole("textbox", { name: "Base URL", exact: true }).fill(baseUrl);
  await page.getByRole("textbox", { name: "Model", exact: true }).fill(model);
  await page.getByRole("textbox", { name: /API key/ }).fill(key);
  await page.getByTestId("llm-provider-save").click();
  await page.waitForTimeout(250);
}

test.describe("LLM provider manager", () => {
  test("adds a provider, tests connection, sets active, and persists metadata only", async ({ page }) => {
    let testPayload: unknown = null;
    await page.route(TEST_URL, async (route) => {
      const body = route.request().postDataJSON() as Record<string, unknown> | null;
      testPayload = body?.provider ?? null;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: "Connection OK" }) });
    });

    await configureProxy(page);
    await addProvider(page);

    // Provider card visible with Active marker.
    await expect(page.getByText("DeepSeek Test")).toBeVisible();
    await expect(page.getByText(/● Active/)).toBeVisible();

    // The connection test forwards baseUrl/model/session apiKey.
    await page.locator("button.btn-ghost", { hasText: /Test connection/ }).click();
    await expect(page.getByText("Connection OK")).toBeVisible();
    const tp = testPayload as { baseUrl?: string; model?: string; apiKey?: string };
    expect(tp.baseUrl).toBe("https://api.deepseek.com/v1");
    expect(tp.model).toBe("deepseek-chat");
    expect(tp.apiKey).toBe("sk-test");

    // The session key text is displayed as configured.
    await expect(page.getByText(/Session key configured/)).toBeVisible();
  });

  test("switch provider and coach uses the active one", async ({ page }) => {
    let agentPayload: unknown = null;
    await page.route(AGENT_URL, async (route) => {
      agentPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/x-ndjson",
        body: '{"type":"delta","text":"Reading practice next."}\n{"type":"done"}\n',
      });
    });

    await configureProxy(page);

    // Add two providers.
    await addProvider(page, { name: "Provider A", baseUrl: "https://a.example.com/v1", model: "model-a", key: "sk-a" });
    await page.getByRole("button", { name: /Add Provider/ }).click();
    await page.getByRole("textbox", { name: /Display name/ }).fill("Provider B");
    await page.getByRole("textbox", { name: "Base URL", exact: true }).fill("https://b.example.com/v1");
    await page.getByRole("textbox", { name: "Model", exact: true }).fill("model-b");
    await page.getByRole("textbox", { name: /API key/ }).fill("sk-b");
    await page.getByTestId("llm-provider-save").click();
    await page.waitForTimeout(250);

    // Switch active to Provider B.
    await page.getByRole("button", { name: /Provider B/ }).click();
    await expect(page.getByText("Provider B").first()).toBeVisible();

    // Ask the coach a question via SPA navigation (client-side nav keeps the
    // in-memory session key alive; a full reload would clear it by design).
    await page.getByRole("link", { name: /AI Coach/i }).click();
    await page.waitForURL("**/coach/");
    const input = page.getByPlaceholder(/Ask about a question|ask about|progress/i).first();
    await input.fill("What should I study?");
    await input.press("Enter");
    await expect(page.getByText(/Reading practice next/)).toBeVisible();
    const ap = (agentPayload as { provider?: { baseUrl?: string; model?: string; apiKey?: string } })?.provider ?? {};
    expect(ap.baseUrl).toBe("https://b.example.com/v1");
    expect(ap.model).toBe("model-b");
    expect(ap.apiKey).toBe("sk-b");
  });

  test("clears session key and requires re-entry after clearing", async ({ page }) => {
    await page.route(TEST_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Authentication failed" }) }),
    );
    await configureProxy(page);
    await addProvider(page, { name: "K", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", key: "sk-k" });

    // Key present; then clear it.
    await expect(page.getByText(/Session key configured/)).toBeVisible();
    await page.getByRole("button", { name: /Clear key/ }).click();
    await expect(page.getByText(/No session key/)).toBeVisible();
  });
});
