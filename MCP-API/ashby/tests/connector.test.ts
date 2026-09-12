import test from "node:test";
import assert from "node:assert/strict";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadConfig } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { registerTools } from "../src/tools.js";
import type { Upstream } from "../src/upstream.js";

function withEnv(values: Record<string, string | undefined>, fn: () => void): void {
  const old = { ...process.env };
  try {
    for (const [k, v] of Object.entries(values)) v === undefined ? delete process.env[k] : process.env[k] = v;
    fn();
  } finally {
    process.env = old;
  }
}

test("configuration requires a credential", () => {
  withEnv({ ASHBY_API_KEY: undefined, ASHBY_MCP_ACCESS_TOKEN: undefined }, () => {
    assert.throws(() => loadConfig(), /Set ASHBY_API_KEY or ASHBY_MCP_ACCESS_TOKEN/);
  });
});

test("configuration defaults writes and private fields to disabled", () => {
  withEnv({ ASHBY_API_KEY: "test-key", ASHBY_ALLOW_WRITES: undefined, ASHBY_ALLOW_PRIVATE_FIELDS: undefined }, () => {
    const config = loadConfig();
    assert.equal(config.allowWrites, false);
    assert.equal(config.allowPrivateFields, false);
    assert.equal(config.maxRetries, 3);
  });
});

test("write and high-risk approvals are enforced", () => {
  const base = { apiKey: "x", mcpUrl: "https://mcp.ashbyhq.com/mcp/v1", apiBaseUrl: "https://api.ashbyhq.com", timeoutMs: 1000, maxRetries: 0, allowWrites: true, allowHighRisk: true, allowPrivateFields: false };
  assert.throws(() => requireApproval("WRITE", undefined, base), /approval/i);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", base));
  assert.throws(() => requireApproval("HIGH_RISK", "approved", base), /high-risk approval/i);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", base));
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved-high-risk", base), /disabled/i);
});

test("registers the curated tool set without live credentials", () => {
  const names: string[] = [];
  const fakeServer = { tool(name: string) { names.push(name); } } as unknown as McpServer;
  const upstream: Upstream = { call: async () => ({}), close: async () => undefined };
  const config = { apiKey: "x", mcpUrl: "https://mcp.ashbyhq.com/mcp/v1", apiBaseUrl: "https://api.ashbyhq.com", timeoutMs: 1000, maxRetries: 0, allowWrites: false, allowHighRisk: false, allowPrivateFields: false };
  registerTools(fakeServer, upstream, config);
  assert.equal(names.length, 14);
  assert.ok(names.includes("ashby.candidate.search"));
  assert.ok(names.includes("ashby.application.stage.update"));
  assert.equal(new Set(names).size, names.length);
});
