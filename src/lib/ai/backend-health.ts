// Backend (AI Service) connection health check.
//
// The Settings "AI Service" test targets the IELTS Study OS AI/RAG backend
// itself via GET /health — it deliberately does NOT call /api/coach and never
// requires or sends an LLM API key. LLM/provider verification is a separate
// flow under "LLM Provider → Test Connection".

export interface BackendHealthResult {
  ok: boolean;
  message: string;
  // Non-secret backend state surfaced when /health is reachable and ok.
  service?: string;
  ragStatus?: string;
  retrievalMode?: string;
  databaseReachable?: boolean;
  pgvectorAvailable?: boolean;
  embeddingsConfigured?: boolean;
  knowledgeChunkCount?: number;
}

/**
 * Query a backend's /health endpoint and interpret it.
 *
 * @param baseUrl  e.g. https://ielts-study-os-ai-rag.vercel.app
 * @param fetcher  fetch-like function (injectable for tests)
 */
export async function checkBackendHealth(
  baseUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<BackendHealthResult> {
  const trimmed = (baseUrl ?? "").trim();
  if (!trimmed) return { ok: false, message: "No URL provided" };
  try {
    const res = await fetcher(`${trimmed.replace(/\/$/, "")}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { ok: false, message: `Backend unavailable (HTTP ${res.status})` };
    }
    let data: Record<string, unknown> = {};
    try {
      data = (await res.json()) as Record<string, unknown>;
    } catch {
      return { ok: false, message: "Backend did not return a valid health response" };
    }
    if (data.status !== "ok") {
      return { ok: false, message: `Backend unhealthy (status: ${String(data.status)})` };
    }
    return {
      ok: true,
      message: "OK — IELTS Study OS AI/RAG backend connected",
      service: typeof data.service === "string" ? data.service : undefined,
      ragStatus: typeof data.rag_status === "string" ? data.rag_status : undefined,
      retrievalMode: typeof data.retrieval_mode === "string" ? data.retrieval_mode : undefined,
      databaseReachable: typeof data.database_reachable === "boolean" ? data.database_reachable : undefined,
      pgvectorAvailable: typeof data.pgvector_available === "boolean" ? data.pgvector_available : undefined,
      embeddingsConfigured: typeof data.embeddings_configured === "boolean" ? data.embeddings_configured : undefined,
      knowledgeChunkCount: typeof data.knowledge_chunk_count === "number" ? data.knowledge_chunk_count : undefined,
    };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

export const CANONICAL_AI_BACKEND = "https://ielts-study-os-ai-rag.vercel.app";

export function isCanonicalFrontend(hostname: string): boolean {
  return hostname === "ielts-study-os.vercel.app";
}
