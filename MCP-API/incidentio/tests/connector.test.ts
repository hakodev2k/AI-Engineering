import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type Config } from "../src/config.js";
import { ApprovalError } from "../src/policy.js";
import { executeTool, TOOL_SPECS } from "../src/tools.js";
import type { Upstream } from "../src/upstream.js";

const baseConfig: Config = {
  apiKey: "secret",
  mcpUrl: "https://mcp.incident.io/mcp",
  timeoutMs: 1000,
  maxRetries: 1,
  writeApproved: false,
  highRiskApproved: false
};

class FakeUpstream implements Upstream {
  calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  async connect() {}
  async callTool(name: string, args: Record<string, unknown>) {
    this.calls.push({ name, args });
    return { ok: true, name, args };
  }
  async close() {}
}

test("config requires an API key and pins the official MCP host", () => {
  assert.throws(() => loadConfig({}), /INCIDENTIO_API_KEY/);
  assert.throws(() => loadConfig({ INCIDENTIO_API_KEY: "x", INCIDENTIO_MCP_URL: "https://evil.example/mcp" }), /mcp.incident.io/);
  const config = loadConfig({ INCIDENTIO_API_KEY: "x" });
  assert.equal(config.mcpUrl, "https://mcp.incident.io/mcp");
});

test("tool registry is provider scoped, unique and covers read/write/high-risk", () => {
  assert.equal(TOOL_SPECS.length, 17);
  assert.equal(new Set(TOOL_SPECS.map((x) => x.name)).size, TOOL_SPECS.length);
  assert.ok(TOOL_SPECS.every((x) => x.name.startsWith("incidentio.")));
  assert.ok(TOOL_SPECS.some((x) => x.risk === "READ"));
  assert.ok(TOOL_SPECS.some((x) => x.risk === "WRITE"));
  assert.ok(TOOL_SPECS.some((x) => x.risk === "HIGH_RISK"));
});

test("read operation executes without approval and only calls its fixed upstream tool", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "incidentio.incident.show")!;
  await executeTool(spec, { id: "INC-123" }, undefined, fake, baseConfig);
  assert.deepEqual(fake.calls, [{ name: "incident_show", args: { id: "INC-123" } }]);
});

test("write operation is denied without both runtime gate and per-call approval", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "incidentio.incident.create")!;
  await assert.rejects(() => executeTool(spec, {}, "approved", fake, baseConfig), ApprovalError);
  assert.equal(fake.calls.length, 0);
});

test("write operation executes with explicit approval", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "incidentio.follow_up.create")!;
  await executeTool(spec, { incident_id: "INC-1", description: "Review retry policy" }, "approved", fake, { ...baseConfig, writeApproved: true });
  assert.equal(fake.calls[0]?.name, "follow_up_create");
});

test("high-risk escalation response requires its stronger gate and approval phrase", async () => {
  const fake = new FakeUpstream();
  const spec = TOOL_SPECS.find((x) => x.name === "incidentio.escalation.respond")!;
  await assert.rejects(() => executeTool(spec, {}, "approved", fake, { ...baseConfig, highRiskApproved: true }), ApprovalError);
  await executeTool(spec, { id: "esc-1", response: "acknowledge" }, "approved-high-risk", fake, { ...baseConfig, highRiskApproved: true });
  assert.equal(fake.calls[0]?.name, "escalation_respond");
});
