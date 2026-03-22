import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages to console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("server started");
    expect(spy).toHaveBeenCalledOnce();
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("server started");
    expect(entry.timestamp).toBeDefined();
  });

  it("logs warn messages to console.warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("slow query");
    expect(spy).toHaveBeenCalledOnce();
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.level).toBe("warn");
  });

  it("logs error messages to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("connection failed");
    expect(spy).toHaveBeenCalledOnce();
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.level).toBe("error");
  });

  it("includes meta when provided", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("request", { path: "/api/health" });
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.meta).toEqual({ path: "/api/health" });
  });

  it("omits meta key when not provided", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("simple message");
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry).not.toHaveProperty("meta");
  });

  it("redacts email addresses from messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("user jane@example.com logged in");
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.message).not.toContain("jane@example.com");
    expect(entry.message).toContain("[REDACTED]");
  });

  it("redacts SSN patterns from messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("user SSN 123-45-6789");
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.message).not.toContain("123-45-6789");
    expect(entry.message).toContain("[REDACTED]");
  });

  it("redacts long numeric sequences from messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("phone 1234567890");
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.message).not.toContain("1234567890");
  });

  it("redacts PHI from meta values", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("lookup", { email: "jane@example.com" });
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry.meta.email).not.toContain("jane@example.com");
    expect(entry.meta.email).toContain("[REDACTED]");
  });
});
