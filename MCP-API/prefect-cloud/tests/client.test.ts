import { describe, expect, it, vi } from "vitest";
import { PrefectApiClient } from "../src/client/prefectApi.js";
import type { ConnectorConfig } from "../src/config.js";

function config(overrides: Partial<ConnectorConfig> = {}): ConnectorConfig {
  return {
    apiUrl: "https://api.prefect.cloud/api/accounts/11111111-1111-1111-1111-111111111111/workspaces/22222222-2222-2222-2222-222222222222",
    apiKey: "test-key",
    mcpTransport: "http",
    mcpUrl: "https://prefect.fastmcp.app/mcp",
    mcpCommand: "uvx",
    mcpArgs: [],
    requestTimeoutMs: 1000,
    maxRetries: 2,
    maxResponseBytes: 2097152,
    enableExecution: false,
    ...overrides,
  };
}

describe("PrefectApiClient", () => {
  it("sends bearer auth and the expected bounded filter body", async () => {
    const mockFetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-key");
      expect(JSON.parse(String(init?.body))).toEqual({ limit: 25, offset: 10, flows: { name: { like_: "etl-%" } } });
      return new Response(JSON.stringify([{ id: "flow-1" }]), { status: 200 });
    });
    const client = new PrefectApiClient(config(), mockFetch as typeof fetch);
    await expect(client.filter("flows", { name: { like_: "etl-%" } }, 25, 10)).resolves.toEqual([{ id: "flow-1" }]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries a safe read-only POST after a 429", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response("throttled", { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));
    const client = new PrefectApiClient(config(), mockFetch as typeof fetch);
    await expect(client.filter("deployments", undefined, 10, 0)).resolves.toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("does not blindly retry deployment execution", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("temporary", { status: 503 }));
    const client = new PrefectApiClient(config(), mockFetch as typeof fetch);
    await expect(client.createFlowRunFromDeployment("33333333-3333-3333-3333-333333333333", {})).rejects.toThrow(/503/);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("rejects non-local insecure API URLs through configuration policy", async () => {
    const client = new PrefectApiClient(config({ apiUrl: "https://example.invalid" }), vi.fn() as unknown as typeof fetch);
    await expect(client.request("//evil.example/path", { method: "GET" })).rejects.toThrow(/Unsafe API path/);
  });
});
