import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type Config } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { executeTool, TOOL_SPECS } from "../src/tools.js";
import type { Upstream } from "../src/upstream.js";

const baseConfig: Config = {
  mcpUrl: "https://mcp.ai.teamwork.com/",
  bearerToken: "test-token",
  timeoutMs: 1000,
  maxReadRetries: 2,
  allowWrites: false,
  allowHighRisk: false,
};

class FakeUpstream implements Upstream {
  calls: Array<{ name: string; args: Record<string, unknown>; retryRead: boolean }> = [];
  async connect(): Promise<void> {}
  async close(): Promise<void> {}
  async callTool(name: string, args: Record<string, unknown>, retryRead: boolean): Promise<unknown> {
    this.calls.push({ name, args, retryRead });
    return { ok: true, name, args };
  }
}

test("configuration requires a bearer token", () => {
  assert.throws(() => loadConfig({}), /TEAMWORK_MCP_BEARER_TOKEN is required/);
});

test("configuration rejects insecure MCP URLs", () => {
  assert.throws(() => loadConfig({ TEAMWORK_MCP_BEARER_TOKEN: "x", TEAMWORK_MCP_URL: "http://example.test" }), /HTTPS/);
});

test("connector registers 15 fixed provider-scoped tools without destructive operations", () => {
  assert.equal(TOOL_SPECS.length, 15);
  assert.equal(new Set(TOOL_SPECS.map((x) => x.name)).size, TOOL_SPECS.length);
  assert.ok(TOOL_SPECS.every((x) => x.name.startsWith("teamwork.")));
  assert.ok(TOOL_SPECS.every((x) => x.risk !== "DESTRUCTIVE"));
});

test("read tool executes without approval and permits bounded retry policy", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "teamwork.task.list")!;
  const result = await executeTool(spec, { project_id: 42 }, undefined, fake, baseConfig);
  assert.deepEqual(result, { ok: true, name: "twprojects-list_tasks", args: { project_id: 42 } });
  assert.equal(fake.calls[0]?.retryRead, true);
});

test("write tool is denied by default", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "teamwork.task.create")!;
  await assert.rejects(() => executeTool(spec, {}, "approved", fake, baseConfig), /Write operations are disabled/);
  assert.equal(fake.calls.length, 0);
});

test("write tool requires explicit approval and is never auto-retried", async () => {
  const fake = new FakeUpstream();
  const config = { ...baseConfig, allowWrites: true };
  const spec = TOOL_SPECS.find((x) => x.name === "teamwork.task.create")!;
  await assert.rejects(() => executeTool(spec, {}, undefined, fake, config), /Explicit write approval/);
  await executeTool(spec, { tasklist_id: 1, name: "Example" }, "approved", fake, config);
  assert.equal(fake.calls[0]?.retryRead, false);
});

test("high-risk completion requires stronger opt-in and approval", () => {
  assert.throws(() => requireApproval("HIGH_RISK", "approved-high-risk", baseConfig), /High-risk operations are disabled/);
  const enabled = { ...baseConfig, allowHighRisk: true };
  assert.throws(() => requireApproval("HIGH_RISK", "approved", enabled), /Explicit high-risk approval/);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", enabled));
});

test("destructive operations are always disabled", () => {
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved-high-risk", { ...baseConfig, allowWrites: true, allowHighRisk: true }), /disabled/);
});
