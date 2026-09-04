import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/storage/db";
import { saveSettings, getSettings } from "@/lib/storage/repository";
import { getActiveProviderRequest } from "@/lib/ai/active-provider";
import { setProviderSessionKey } from "@/lib/ai/provider-session";
import { clearAllProviderSessionKeys } from "@/lib/ai/provider-session";

beforeEach(async () => {
  await resetDb();
  clearAllProviderSessionKeys();
});

async function seedProvider(active: boolean) {
  const current = await getSettings();
  const llmProviders = [
    { id: "ds", displayName: "DeepSeek", preset: "deepseek" as const, baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat", createdAt: "now" },
    { id: "oa", displayName: "OpenAI", preset: "openai" as const, baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", createdAt: "now" },
  ];
  await saveSettings({
    ...current,
    ai: {
      ...current.ai,
      llmProviders: llmProviders as typeof current.ai.llmProviders,
      activeProviderId: active ? "oa" : null,
    },
  });
}

describe("active provider request assembly", () => {
  it("returns null when no provider is active", async () => {
    await seedProvider(false);
    expect(await getActiveProviderRequest()).toBeNull();
  });

  it("returns the active provider with its session key", async () => {
    await seedProvider(true);
    setProviderSessionKey("oa", "sk-openai");
    const req = await getActiveProviderRequest();
    expect(req).not.toBeNull();
    expect(req!.baseUrl).toBe("https://api.openai.com/v1");
    expect(req!.model).toBe("gpt-4o-mini");
    expect(req!.apiKey).toBe("sk-openai");
  });

  it("omits apiKey when no session key has been entered", async () => {
    await seedProvider(true);
    const req = await getActiveProviderRequest();
    expect(req).not.toBeNull();
    expect(req!.apiKey).toBeUndefined();
    expect(req!.baseUrl).toBe("https://api.openai.com/v1");
  });

  it("returns null when the active provider has an empty base URL or model", async () => {
    const current = await getSettings();
    await saveSettings({
      ...current,
      ai: {
        ...current.ai,
        llmProviders: [
          { id: "bad", displayName: "Bad", preset: "custom" as const, baseUrl: "", model: "", createdAt: "now" },
        ],
        activeProviderId: "bad",
      },
    });
    expect(await getActiveProviderRequest()).toBeNull();
  });
});
