import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { PermissionError, Policy } from "../src/policy.js";
import { TinybirdClient, TinybirdError } from "../src/client.js";

describe("configuration", () => {
  it("requires a token and enforces HTTPS hosts", () => {
    expect(() => loadConfig({})).toThrow("TINYBIRD_TOKEN is required");
    expect(() => loadConfig({ TINYBIRD_TOKEN: "secret", TINYBIRD_API_HOST: "http://example.test" })).toThrow("must use HTTPS");
  });

  it("loads safe defaults without exposing credentials", () => {
    const config = loadConfig({ TINYBIRD_TOKEN: "secret" });
    expect(config.apiHost).toBe("https://api.tinybird.co");
    expect(config.mcpUrl).toBe("https://mcp.tinybird.co");
    expect(config.allowWrite).toBe(false);
  });
});

describe("permission policy", () => {
  it("allows reads", () => {
    expect(() => new Policy({ allowWrite: false, approvedActionIds: new Set() }).assert("READ")).not.toThrow();
  });

  it("denies writes unless enabled and explicitly approved out of band", () => {
    const disabled = new Policy({ allowWrite: false, approvedActionIds: new Set(["change-1"]) });
    expect(() => disabled.assert("WRITE", "change-1")).toThrow(PermissionError);

    const enabled = new Policy({ allowWrite: true, approvedActionIds: new Set(["change-1"]) });
    expect(() => enabled.assert("WRITE", "missing")).toThrow(PermissionError);
    expect(() => enabled.assert("WRITE", "change-1")).not.toThrow();
  });
});

describe("REST client", () => {
  const config = loadConfig({ TINYBIRD_TOKEN: "test-token", TINYBIRD_MAX_RETRIES: "2", TINYBIRD_TIMEOUT_MS: "1000" });

  it("sends bearer authentication and encodes endpoint parameters", async () => {
    const mockFetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      expect(url.pathname).toBe("/v0/pipes/sales.json");
      expect(url.searchParams.get("region")).toBe("eu");
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-token");
      return new Response(JSON.stringify({ data: [{ value: 1 }] }), { status: 200 });
    });
    const client = new TinybirdClient(config, mockFetch as typeof fetch);
    await expect(client.callEndpoint("sales", { region: "eu" })).resolves.toEqual({ data: [{ value: 1 }] });
  });

  it("retries bounded read throttling and preserves Retry-After behavior", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "limited" }), { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ jobs: [] }), { status: 200 }));
    const client = new TinybirdClient(config, mockFetch as typeof fetch);
    await expect(client.listJobs({})).resolves.toEqual({ jobs: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("does not blindly retry event ingestion", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "unavailable" }), { status: 503 }));
    const client = new TinybirdClient(config, mockFetch as typeof fetch);
    await expect(client.ingestEvents("events", [{ id: 1 }], false)).rejects.toBeInstanceOf(TinybirdError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("maps authentication failures without retrying", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "forbidden" }), { status: 403 }));
    const client = new TinybirdClient(config, mockFetch as typeof fetch);
    await expect(client.getJob("abc")).rejects.toMatchObject({ status: 403 });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
