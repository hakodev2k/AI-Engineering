import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig, type Config } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { executeTool, TOOL_SPECS } from "../src/tools.js";
import type { OperationKey, Upstream } from "../src/upstream.js";

const baseConfig: Config = {
  apiKey: "test_key",
  mcpUrl: "https://mcp.withpersona.com",
  personaVersion: "2025-12-08",
  timeoutMs: 15000,
  maxRetries: 3,
  allowWrites: false,
  allowHighRisk: false
};

class FakeUpstream implements Upstream {
  calls: Array<{ operation: OperationKey; args: Record<string, unknown> }> = [];
  async connect(): Promise<void> {}
  async call(operation: OperationKey, args: Record<string, unknown>): Promise<unknown> {
    this.calls.push({ operation, args });
    return { ok: true, operation, args };
  }
  async close(): Promise<void> {}
}

test("registers a focused stable tool surface", () => {
  assert.equal(TOOL_SPECS.length, 12);
  assert.equal(new Set(TOOL_SPECS.map((tool) => tool.name)).size, TOOL_SPECS.length);
  assert.ok(TOOL_SPECS.every((tool) => tool.name.startsWith("persona.")));
});

test("read operation executes without approval", async () => {
  const upstream = new FakeUpstream();
  const spec = TOOL_SPECS.find((tool) => tool.name === "persona.inquiry.get")!;
  const result = await executeTool(spec, { "inquiry-id": "inq_test" }, undefined, upstream, baseConfig);
  assert.deepEqual(result, { ok: true, operation: "inquiry.get", args: { "inquiry-id": "inq_test" } });
  assert.equal(upstream.calls.length, 1);
});

test("write is denied by default", async () => {
  const upstream = new FakeUpstream();
  const spec = TOOL_SPECS.find((tool) => tool.name === "persona.inquiry.create")!;
  await assert.rejects(() => executeTool(spec, {}, "approved", upstream, baseConfig), /disabled/i);
  assert.equal(upstream.calls.length, 0);
});

test("write requires explicit approval even when enabled", async () => {
  const config = { ...baseConfig, allowWrites: true };
  assert.throws(() => requireApproval("WRITE", undefined, config), /approval/i);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", config));
});

test("destructive operations are always disabled", () => {
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved-high-risk", { ...baseConfig, allowHighRisk: true }), /disabled/i);
});

test("config refuses credential forwarding to a non-Persona MCP host", () => {
  const old = { ...process.env };
  try {
    process.env.PERSONA_API_KEY = "secret";
    process.env.PERSONA_MCP_URL = "https://attacker.example/mcp";
    assert.throws(() => loadConfig(), /official/i);
  } finally {
    process.env = old;
  }
});

test("config validates numeric reliability settings", () => {
  const old = { ...process.env };
  try {
    process.env.PERSONA_API_KEY = "secret";
    process.env.PERSONA_MCP_URL = "https://mcp.withpersona.com";
    process.env.PERSONA_MAX_RETRIES = "99";
    assert.throws(() => loadConfig(), /between 0 and 5/i);
  } finally {
    process.env = old;
  }
});
