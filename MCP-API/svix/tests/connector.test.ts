import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { SvixApiError, SvixClient } from "../src/client.js";

const baseEnv = {
  SVIX_API_TOKEN: "test-token",
  SVIX_API_BASE_URL: "https://api.svix.com",
  SVIX_REQUEST_TIMEOUT_MS: "5000",
  SVIX_REQUIRE_WRITE_APPROVAL: "true",
  SVIX_APPROVAL_TOKENS: "approved",
};

describe("configuration and policy", () => {
  it("requires a token", () => expect(() => loadConfig({})).toThrow("SVIX_API_TOKEN"));
  it("rejects unsafe base URLs", () => expect(() => loadConfig({ ...baseEnv, SVIX_API_BASE_URL: "http://example.com" })).toThrow("HTTPS"));
  it("allows reads without approval and blocks writes without approval", () => {
    const config = loadConfig(baseEnv);
    expect(() => requireApproval(config, "READ")).not.toThrow();
    expect(() => requireApproval(config, "WRITE")).toThrow("APPROVAL_REQUIRED");
    expect(() => requireApproval(config, "HIGH_RISK", "approved")).not.toThrow();
  });
});

describe("SvixClient", () => {
  it("adds bearer auth and returns JSON", async () => {
    const mockFetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
      return new Response(JSON.stringify({ data: [{ id: "app_1" }] }), { status: 200, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch;
    const client = new SvixClient(loadConfig(baseEnv), mockFetch);
    await expect(client.request("GET", "/api/v1/app/")).resolves.toEqual({ data: [{ id: "app_1" }] });
  });

  it("does not retry non-idempotent writes", async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ detail: "busy" }), { status: 503 })) as unknown as typeof fetch;
    const client = new SvixClient(loadConfig(baseEnv), mockFetch);
    await expect(client.request("POST", "/api/v1/app/", { body: { name: "x" } })).rejects.toBeInstanceOf(SvixApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("preserves Retry-After on throttling", async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ detail: "slow down" }), { status: 429, headers: { "retry-after": "7" } })) as unknown as typeof fetch;
    const config = loadConfig(baseEnv);
    const client = new SvixClient(config, mockFetch);
    await expect(client.request("POST", "/api/v1/app/")).rejects.toMatchObject({ status: 429, retryAfterSeconds: 7 });
  });
});
