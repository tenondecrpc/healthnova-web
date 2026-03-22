import { beforeEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("parses valid environment variables", async () => {
    vi.stubEnv("HOST", "http://localhost:4000");
    const { env } = await import("@/lib/env");
    expect(env.HOST).toBeDefined();
    expect(() => new URL(env.HOST)).not.toThrow();
  });

  it("throws on missing HOST", async () => {
    vi.stubEnv("HOST", "");
    await expect(() => import("@/lib/env")).rejects.toThrow();
  });

  it("throws on invalid HOST url", async () => {
    vi.stubEnv("HOST", "not-a-url");
    await expect(() => import("@/lib/env")).rejects.toThrow();
  });
});
