import { describe, expect, it, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadConfig } from "../src/config.js";
import { assertKnownReadTool, TOOL_POLICIES } from "../src/policy.js";
import { OpenObserveRestClient } from "../src/rest.js";
import { registerTools } from "../src/tools.js";

const config = loadConfig({
  OPENOBSERVE_BASE_URL: "https://example.invalid",
  OPENOBSERVE_ORG_ID: "acme",
  OPENOBSERVE_AUTH_TOKEN: "dGVzdDp0ZXN0",
  OPENOBSERVE_TIMEOUT_MS: "1000",
  OPENOBSERVE_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv);

describe("configuration and credential isolation", () => {
  it("builds Basic auth without exposing credentials to tool inputs", () => {
    expect(config.authHeader).toBe("Basic dGVzdDp0ZXN0");
    expect(config.mcpUrl).toBe("https://example.invalid/api/acme/mcp");
  });

  it("rejects missing credentials", () => {
    expect(() => loadConfig({ OPENOBSERVE_BASE_URL: "https://x", OPENOBSERVE_ORG_ID: "o" } as NodeJS.ProcessEnv)).toThrow(/Configure/);
  });
});

describe("permission model", () => {
  it("registers only automatic READ tools", () => {
    expect(Object.keys(TOOL_POLICIES)).toHaveLength(8);
    for (const policy of Object.values(TOOL_POLICIES)) {
      expect(policy.risk).toBe("READ");
      expect(policy.approvalRequired).toBe(false);
    }
  });

  it("denies unknown or unclassified tools", () => {
    expect(() => assertKnownReadTool("openobserve.stream.delete")).toThrow(/not registered/);
  });
});

describe("REST reliability", () => {
  it("maps provider errors without retrying permission failures", async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ message: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } }));
    const rest = new OpenObserveRestClient(config, fakeFetch as typeof fetch);
    await expect(rest.get(rest.orgPath("/streams"))).rejects.toMatchObject({ status: 403 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it("retries throttling with a bounded retry count", async () => {
    const fakeFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "slow" }), { status: 429, headers: { "retry-after": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ list: [] }), { status: 200 }));
    const rest = new OpenObserveRestClient(config, fakeFetch as typeof fetch);
    await expect(rest.get(rest.orgPath("/streams"))).resolves.toEqual({ list: [] });
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });
});

describe("tool registration", () => {
  it("registers the connector tool catalog without live credentials", () => {
    const server = new McpServer({ name: "test", version: "1.0.0" });
    const rest = new OpenObserveRestClient(config, vi.fn() as unknown as typeof fetch);
    const upstream = { callTool: vi.fn(), close: vi.fn() };
    expect(() => registerTools(server, { config, rest, upstream: upstream as never })).not.toThrow();
  });
});
