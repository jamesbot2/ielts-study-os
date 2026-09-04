import { test, expect, type Page } from "@playwright/test";

// V0.6 RC regression: the Settings "AI Service" connection test must call
// GET /health on the IELTS Study OS backend — NOT /api/coach — and must not
// require any LLM provider API key.

test.describe("AI Service connection test uses /health", () => {
  test("healthy backend shows connected with state, and /api/coach is never called", async ({ page }) => {
    const calls: string[] = [];
    await page.route("**/health", async (route) => {
      calls.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          service: "ielts-study-os-ai-rag",
          rag_status: "healthy",
          retrieval_mode: "hybrid",
          database_reachable: true,
          pgvector_available: true,
          embeddings_configured: true,
          knowledge_chunk_count: 135,
        }),
      });
    });
    await page.route("**/api/coach", async (route) => {
      calls.push(route.request().url());
      await route.fulfill({ status: 503, body: "LLM not configured" });
    });

    await page.goto("/settings/");
    await page.waitForTimeout(800);
    const input = page.getByLabel(/AI Service URL/);
    await input.fill("http://127.0.0.1:4173");
    await page.getByRole("button", { name: /Save/ }).first().click();
    await page.waitForTimeout(300);

    // Trigger the AI Service connection test (primary button next to Save).
    const buttons = page.getByRole("button", { name: /Test connection/ });
    // The AI Service section button is btn-secondary; provider cards use btn-ghost.
    await page.locator("section .btn-secondary", { hasText: /Test connection/ }).first().click();
    await expect(page.getByText(/IELTS Study OS AI\/RAG backend connected/)).toBeVisible();
    await expect(page.getByText(/RAG: healthy/)).toBeVisible();
    await expect(page.getByText(/hybrid/)).toBeVisible();

    // /api/coach must never be called by the AI Service test.
    expect(calls.filter((u) => u.includes("/api/coach"))).toHaveLength(0);
    expect(calls.some((u) => u.includes("/health"))).toBe(true);
  });

  test("unhealthy backend (non-200) shows a clear failure", async ({ page }) => {
    await page.route("**/health", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ status: "error" }) }),
    );
    await page.goto("/settings/");
    await page.waitForTimeout(800);
    await page.getByLabel(/AI Service URL/).fill("http://127.0.0.1:4173");
    await page.getByRole("button", { name: /Save/ }).first().click();
    await page.waitForTimeout(300);
    await page.locator("section .btn-secondary", { hasText: /Test connection/ }).first().click();
    await expect(page.getByText(/Backend unavailable|unhealthy/i)).toBeVisible();
  });
});
