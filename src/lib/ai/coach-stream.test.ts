import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoteAiProxyClient } from "@/lib/ai/client";

// Encodes an NDJSON body into a ReadableStream (what fetch body.getReader sees).
function ndjsonResponse(chunks: string[], status = 200) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return {
    ok: status >= 200 && status < 300,
    status,
    body,
    text: async () => chunks.join(""),
  } as unknown as Response;
}

function makeClient(baseUrl = "https://backend.example") {
  return new RemoteAiProxyClient(baseUrl);
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("RemoteAiProxyClient.coachAgent stream hardening", () => {
  it("renders a normal NDJSON stream (deltas, citations, actions, done)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      ndjsonResponse([
        '{"type":"delta","text":"Hello "}\n',
        '{"type":"delta","text":"world"}\n',
        '{"type":"citation","citation":{"id":"c1","sourceId":"s1","title":"T"}}\n',
        '{"type":"action_proposal","action":{"type":"create_study_task","title":"Task","href":"/plan"}}\n',
        '{"type":"done"}\n',
      ]),
    ));
    const events: string[] = [];
    const result = await makeClient().coachAgent(
      { message: "hi", learnerContext: {}, locale: "en" },
      (e) => events.push(e.type),
    );
    expect(result.text).toBe("Hello world");
    expect(result.citations.length).toBe(1);
    expect(result.actions.length).toBe(1);
    expect(events).toContain("done");
  });

  it("throws on a backend error event (sanitized message)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      ndjsonResponse(['{"type":"error","message":"model did not return a valid structured response"}\n{"type":"done"}\n']),
    ));
    await expect(
      makeClient().coachAgent({ message: "hi", learnerContext: {}, locale: "en" }, () => {}),
    ).rejects.toThrow("model did not return a valid structured response");
  });

  it("throws when the stream is empty (HTTP 200, zero events)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ndjsonResponse([""])));
    await expect(
      makeClient().coachAgent({ message: "hi", learnerContext: {}, locale: "en" }, () => {}),
    ).rejects.toThrow(/ended unexpectedly/);
  });

  it("throws when the stream is truncated (no done event)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ndjsonResponse(['{"type":"delta","text":"partial"}\n'])));
    await expect(
      makeClient().coachAgent({ message: "hi", learnerContext: {}, locale: "en" }, () => {}),
    ).rejects.toThrow(/ended unexpectedly/);
  });

  it("throws when only empty deltas arrive without done", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ndjsonResponse(['{"type":"delta","text":""}\n'])));
    await expect(
      makeClient().coachAgent({ message: "hi", learnerContext: {}, locale: "en" }, () => {}),
    ).rejects.toThrow(/ended unexpectedly/);
  });

  it("rejects non-200 with a clear error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ndjsonResponse(['{"detail":"boom"}'], 500)));
    await expect(
      makeClient().coachAgent({ message: "hi", learnerContext: {}, locale: "en" }, () => {}),
    ).rejects.toThrow(/500/);
  });
});
