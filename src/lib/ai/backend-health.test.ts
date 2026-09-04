import { describe, it, expect } from "vitest";
import {
  checkBackendHealth,
  isCanonicalFrontend,
  CANONICAL_AI_BACKEND,
} from "@/lib/ai/backend-health";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("checkBackendHealth (AI Service connection test)", () => {
  it("calls GET /health (never /api/coach)", async () => {
    const calls: { url: string; method: string }[] = [];
    const fetcher = (async (url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET" });
      return jsonResponse({ status: "ok", service: "ielts-study-os-ai-rag" });
    }) as typeof fetch;

    const result = await checkBackendHealth("https://example-backend.vercel.app", fetcher);
    expect(result.ok).toBe(true);
    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("https://example-backend.vercel.app/health");
    expect(calls[0].method).toBe("GET");
    expect(calls[0].url).not.toContain("/api/coach");
  });

  it("does not send any API key or provider payload", async () => {
    const seenBodies: unknown[] = [];
    const fetcher = (async (_url: string, init?: RequestInit) => {
      seenBodies.push(init?.body);
      return jsonResponse({ status: "ok" });
    }) as typeof fetch;

    await checkBackendHealth("https://backend.example", fetcher);
    // GET health must have no body and no provider/apiKey anywhere.
    expect(seenBodies.every((b) => b === undefined || b === null)).toBe(true);
  });

  it("treats a healthy /health (200 + status ok) as connected", async () => {
    const fetcher = (async () =>
      jsonResponse({
        status: "ok",
        service: "ielts-study-os-ai-rag",
        rag_status: "healthy",
        retrieval_mode: "hybrid",
        database_reachable: true,
        pgvector_available: true,
        embeddings_configured: true,
        knowledge_chunk_count: 135,
      })) as typeof fetch;

    const result = await checkBackendHealth("https://backend.example", fetcher);
    expect(result.ok).toBe(true);
    expect(result.ragStatus).toBe("healthy");
    expect(result.retrievalMode).toBe("hybrid");
    expect(result.databaseReachable).toBe(true);
    expect(result.pgvectorAvailable).toBe(true);
    expect(result.embeddingsConfigured).toBe(true);
    expect(result.knowledgeChunkCount).toBe(135);
  });

  it("fails on non-200", async () => {
    const fetcher = (async () => jsonResponse({}, 503)) as typeof fetch;
    const result = await checkBackendHealth("https://backend.example", fetcher);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/503|unavailable/i);
  });

  it("fails when status field is not ok", async () => {
    const fetcher = (async () =>
      jsonResponse({ status: "degraded", rag_status: "database_unavailable" })) as typeof fetch;
    const result = await checkBackendHealth("https://backend.example", fetcher);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/unhealthy|degraded/i);
  });

  it("fails on invalid JSON body", async () => {
    const fetcher = (async () =>
      ({ ok: true, status: 200, json: async () => { throw new Error("bad json"); } }) as unknown as Response) as typeof fetch;
    const result = await checkBackendHealth("https://backend.example", fetcher);
    expect(result.ok).toBe(false);
  });

  it("fails cleanly on network error", async () => {
    const fetcher = (async () => { throw new Error("fetch failed"); }) as typeof fetch;
    const result = await checkBackendHealth("https://backend.example", fetcher);
    expect(result.ok).toBe(false);
  });

  it("requires no provider key for backend health test", () => {
    // The function signature has no apiKey parameter — structural guarantee.
    expect(checkBackendHealth.length).toBe(1); // only baseUrl (fetcher optional)
  });

  it("rejects empty URL", async () => {
    const result = await checkBackendHealth("", fetch);
    expect(result.ok).toBe(false);
  });
});

describe("canonical backend default", () => {
  it("points to the production AI/RAG backend", () => {
    expect(CANONICAL_AI_BACKEND).toBe("https://ielts-study-os-ai-rag.vercel.app");
  });

  it("detects the canonical frontend host", () => {
    expect(isCanonicalFrontend("ielts-study-os.vercel.app")).toBe(true);
    expect(isCanonicalFrontend("localhost")).toBe(false);
    expect(isCanonicalFrontend("127.0.0.1")).toBe(false);
    expect(isCanonicalFrontend("ielts-study-os-git-main-123.vercel.app")).toBe(false);
  });
});
