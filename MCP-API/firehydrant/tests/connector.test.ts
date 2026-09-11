import { afterEach, describe, expect, it, vi } from "vitest";
import { authorize, loadConfig, type FireHydrantConfig } from "../src/auth/config.js";
import { FireHydrantClient, FireHydrantError } from "../src/client/firehydrant-client.js";
import { TOOL_DEFINITIONS } from "../src/tools/register.js";

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; vi.restoreAllMocks(); });

function config(overrides: Partial<FireHydrantConfig> = {}): FireHydrantConfig {
  return { apiKey: "test-key", baseUrl: "https://api.firehydrant.io/v1", readBaseUrl: "https://api-read.firehydrant.io/v1", timeoutMs: 1000, maxRetries: 0, requireWriteApproval: true, highRiskEnabled: false, ...overrides };
}

describe("configuration and permission boundaries", () => {
  it("rejects missing credentials", () => {
    delete process.env.FIREHYDRANT_API_KEY;
    expect(() => loadConfig()).toThrow(/API_KEY/);
  });

  it("registers a useful bounded tool surface", () => {
    expect(TOOL_DEFINITIONS).toHaveLength(14);
    expect(new Set(TOOL_DEFINITIONS.map(x => x.name)).size).toBe(14);
    expect(TOOL_DEFINITIONS.some(x => x.risk === "HIGH_RISK")).toBe(true);
  });

  it("allows reads but denies unapproved writes", () => {
    expect(() => authorize(config(), "READ", false)).not.toThrow();
    expect(() => authorize(config(), "WRITE", false)).toThrow(/approval/i);
  });

  it("keeps high-risk actions disabled even when approved until explicitly enabled", () => {
    expect(() => authorize(config(), "HIGH_RISK", true)).toThrow(/disabled/i);
    expect(() => authorize(config({ highRiskEnabled: true }), "HIGH_RISK", true)).not.toThrow();
  });
});

describe("FireHydrantClient", () => {
  it("isolates credentials in the Authorization header and uses read-only host for GET reads", async () => {
    const fake = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "content-type": "application/json" } }));
    const client = new FireHydrantClient(config(), fake as typeof fetch);
    await client.request("GET", "/incidents", { readOnly: true, query: { page: 1 } });
    const [url, init] = fake.mock.calls[0];
    expect(String(url)).toContain("api-read.firehydrant.io/v1/incidents?page=1");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
  });

  it("maps provider errors without exposing credentials", async () => {
    const fake = vi.fn(async () => new Response(JSON.stringify({ error: "denied" }), { status: 403 }));
    const client = new FireHydrantClient(config(), fake as typeof fetch);
    await expect(client.request("GET", "/incidents", { readOnly: true })).rejects.toBeInstanceOf(FireHydrantError);
    try { await client.request("GET", "/incidents", { readOnly: true }); } catch (e) { expect(String(e)).not.toContain("test-key"); }
  });

  it("does not blindly retry writes", async () => {
    const fake = vi.fn(async () => new Response("throttled", { status: 429, headers: { "retry-after": "1" } }));
    const client = new FireHydrantClient(config({ maxRetries: 3 }), fake as typeof fetch);
    await expect(client.request("POST", "/incidents", { body: { name: "x" } })).rejects.toBeInstanceOf(FireHydrantError);
    expect(fake).toHaveBeenCalledTimes(1);
  });
});
