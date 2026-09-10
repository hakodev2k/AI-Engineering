import { describe, expect, it, vi } from "vitest";
import type { ConnectorConfig } from "../src/config.js";
import { PrefectApiClient } from "../src/client/prefectApi.js";
import { PrefectMcpTransport, type PrefectMcpCaller } from "../src/transport/prefectMcp.js";
import { invoke, schemas } from "../src/tools/index.js";

function config(overrides: Partial<ConnectorConfig> = {}): ConnectorConfig {
  return {
    apiUrl: "https://api.prefect.cloud/api/accounts/11111111-1111-1111-1111-111111111111/workspaces/22222222-2222-2222-2222-222222222222",
    apiKey: "test-key",
    mcpTransport: "http",
    mcpUrl: "https://prefect.fastmcp.app/mcp",
    mcpCommand: "uvx",
    mcpArgs: [],
    requestTimeoutMs: 1000,
    maxRetries: 0,
    maxResponseBytes: 2097152,
    enableExecution: false,
    ...overrides,
  };
}

const failingMcp: PrefectMcpCaller = {
  call: async () => { throw new Error("MCP unavailable"); },
  close: async () => undefined,
};

describe("tool behavior", () => {
  it("enforces list input bounds", () => {
    expect(() => schemas.list200.parse({ limit: 201 })).toThrow();
    expect(schemas.list200.parse({ limit: 200 }).limit).toBe(200);
  });

  it("uses REST fallback for supported read tools when MCP fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: "flow-1" }]), { status: 200 }));
    const api = new PrefectApiClient(config(), mockFetch as typeof fetch);
    const result = await invoke(failingMcp, api, config(), "prefect-cloud.flow.list", {
      workspace_id: "22222222-2222-2222-2222-222222222222",
      filter: { name: { like_: "etl-%" } },
      limit: 10,
      offset: 0,
    });
    expect(result).toEqual([{ id: "flow-1" }]);
  });

  it("refuses REST fallback across a mismatched workspace boundary", async () => {
    const api = new PrefectApiClient(config(), vi.fn() as unknown as typeof fetch);
    await expect(invoke(failingMcp, api, config(), "prefect-cloud.flow.list", {
      workspace_id: "33333333-3333-3333-3333-333333333333",
      limit: 10,
      offset: 0,
    })).rejects.toThrow(/workspace_id does not match/);
  });

  it("requires enablement, confirmation schema, and approval for deployment execution", async () => {
    expect(() => schemas.deploymentRun.parse({
      deployment_id: "33333333-3333-3333-3333-333333333333",
      confirm: "WRONG",
      approval_token: "x",
    })).toThrow();

    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "run-1" }), { status: 201 }));
    const cfg = config({ enableExecution: true, approvalToken: "1234567890123456" });
    const api = new PrefectApiClient(cfg, mockFetch as typeof fetch);
    await expect(invoke(failingMcp, api, cfg, "prefect-cloud.deployment.run", {
      deployment_id: "33333333-3333-3333-3333-333333333333",
      confirm: "RUN_DEPLOYMENT",
      approval_token: "1234567890123456",
    })).resolves.toEqual({ id: "run-1" });
  });

  it("rejects non-allowlisted upstream MCP tools before connecting", async () => {
    const transport = new PrefectMcpTransport(config());
    await expect(transport.call("unexpected_admin_tool", {})).rejects.toThrow(/not allowlisted/);
  });
});
