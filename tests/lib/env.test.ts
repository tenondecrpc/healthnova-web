import { beforeEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("parses valid environment variables", async () => {
    vi.stubEnv("NEXT_PUBLIC_COGNITO_REGION", "us-east-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_USER_POOL_ID", "pool");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000");
    const { env } = await import("@/lib/configAuth");
    expect(env.NEXT_PUBLIC_COGNITO_REGION).toBeDefined();
    expect(env.NEXT_PUBLIC_API_URL).toBeDefined();
  });

  it("throws on missing COGNITO_REGION", async () => {
    vi.stubEnv("NEXT_PUBLIC_COGNITO_REGION", "");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_USER_POOL_ID", "pool");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000");
    await expect(() => import("@/lib/configAuth")).rejects.toThrow();
  });

  it("throws on invalid API_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_COGNITO_REGION", "us-east-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_USER_POOL_ID", "pool");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "not-a-url");
    await expect(() => import("@/lib/configAuth")).rejects.toThrow();
  });
});
