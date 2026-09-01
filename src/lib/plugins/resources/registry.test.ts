import { describe, it, expect } from "vitest";
import { getExternalProjects } from "./registry";

describe("external project registry", () => {
  const projects = getExternalProjects();

  it("has entries with required fields", () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.integrationMode).toMatch(/^(native-provider|embedded|external|reference)$/);
      expect(p.status).toMatch(/^(active|planned|external|reference)$/);
      expect(Array.isArray(p.capabilities)).toBe(true);
    }
  });

  it("has unique ids", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
  });

  it("includes Baicizhan as an active native provider", () => {
    const b = projects.find((p) => p.id === "baicizhan");
    expect(b?.integrationMode).toBe("native-provider");
    expect(b?.status).toBe("active");
  });
});
