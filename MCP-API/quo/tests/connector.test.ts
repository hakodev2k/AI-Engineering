import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { QuoClient, QuoApiError } from "../src/client.js";
import { assertAllowed } from "../src/policy.js";
import { buildTools } from "../src/tools.js";

const baseEnv = { QUO_API_KEY: "test-key", QUO_API_BASE_URL: "https://api.openphone.com/v1", QUO_APPROVE_WRITES: "false", QUO_APPROVE_HIGH_RISK: "false", QUO_ENABLE_DESTRUCTIVE: "false" };

describe("configuration and policy", () => {
  it("requires an API key", () => expect(() => loadConfig({})).toThrow());
  it("allows reads but blocks unapproved writes", () => {
    const config = loadConfig(baseEnv);
    expect(() => assertAllowed(config, "READ")).not.toThrow();
    expect(() => assertAllowed(config, "WRITE")).toThrow(/APPROVAL_REQUIRED/);
    expect(() => assertAllowed(config, "DESTRUCTIVE", true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe("client", () => {
  it("adds Authorization and query parameters", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toContain("maxResults=20");
      expect((init?.headers as Record<string,string>).Authorization).toBe("test-key");
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "content-type": "application/json" } });
    });
    const client = new QuoClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.request("/contacts", { query: { maxResults: 20 } })).resolves.toEqual({ data: [] });
  });

  it("maps authentication failures without retrying", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }));
    const client = new QuoClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.request("/contacts")).rejects.toBeInstanceOf(QuoApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries throttled read requests and preserves retry-after", async () => {
    let count = 0;
    const fetchMock = vi.fn(async () => {
      count++;
      if (count < 2) return new Response(JSON.stringify({ message: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    });
    const client = new QuoClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.request("/phone-numbers")).resolves.toEqual({ data: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("tools", () => {
  it("validates E.164 and PN identifiers", async () => {
    const client = { request: vi.fn() } as unknown as QuoClient;
    const tools = buildTools(client, loadConfig(baseEnv));
    await expect(tools["quo.message.list"]({ phoneNumberId: "bad", participants: ["555"] })).rejects.toThrow();
  });

  it("requires explicit high-risk approval for outbound SMS", async () => {
    const client = { request: vi.fn() } as unknown as QuoClient;
    const config = loadConfig({ ...baseEnv, QUO_APPROVE_HIGH_RISK: "true" });
    const tools = buildTools(client, config);
    await expect(tools["quo.message.send"]({ from: "PN123", to: ["+15555555555"], content: "hello", approved: false })).rejects.toThrow(/APPROVAL_REQUIRED/);
  });
});
