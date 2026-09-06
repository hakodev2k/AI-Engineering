import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type Config } from "../src/config.js";
import { CloseConnector } from "../src/server.js";
import { TOOL_POLICIES } from "../src/registry.js";
import type { Upstream, UpstreamTool } from "../src/upstream.js";

class FakeUpstream implements Upstream {
  calls: Array<{ name:string; args:Record<string, unknown>; readOnly:boolean }> = [];
  constructor(private readonly missing?: string) {}
  async listTools(): Promise<UpstreamTool[]> {
    return TOOL_POLICIES.filter(t => t.upstream !== this.missing).map(t => ({
      name:t.upstream,
      description:`Fake ${t.upstream}`,
      inputSchema:{ type:"object", properties:{ id:{ type:"string" } }, additionalProperties:false }
    }));
  }
  async callTool(name: string, args: Record<string, unknown>, readOnly: boolean) {
    this.calls.push({ name, args, readOnly });
    return { ok:true, name, args };
  }
}

const config = (overrides: Partial<Config> = {}): Config => ({
  apiKey:"secret",
  upstreamUrl:"https://mcp.close.com/mcp",
  upstreamScope:"mcp.read",
  permission:"read",
  requireWriteApproval:true,
  allowHighRisk:false,
  timeoutMs:15000,
  maxReadRetries:2,
  ...overrides
});

test("configuration defaults to least privilege", () => {
  const c = loadConfig({ CLOSE_API_KEY:"abc" });
  assert.equal(c.upstreamScope, "mcp.read");
  assert.equal(c.permission, "read");
  assert.equal(c.requireWriteApproval, true);
  assert.equal(c.allowHighRisk, false);
});

test("configuration rejects missing credentials", () => {
  assert.throws(() => loadConfig({}), /CLOSE_API_KEY/);
});

test("registers only the curated allowlist and imports official schemas", async () => {
  const connector = new CloseConnector(config(), new FakeUpstream());
  const tools = await connector.tools();
  assert.equal(tools.length, TOOL_POLICIES.length);
  assert.ok(tools.some(t => t.name === "close.lead.search"));
  assert.ok(!tools.some(t => t.name === "execute_any_api_request"));
});

test("fails closed when an expected upstream MCP tool disappears", async () => {
  const connector = new CloseConnector(config(), new FakeUpstream("fetch_lead"));
  await assert.rejects(() => connector.tools(), /unavailable/);
});

test("read operation executes without approval", async () => {
  const upstream = new FakeUpstream();
  const connector = new CloseConnector(config(), upstream);
  const result = await connector.call("close.lead.get", { id:"lead_123" }) as any;
  assert.equal(result.ok, true);
  assert.equal(upstream.calls[0].name, "fetch_lead");
  assert.equal(upstream.calls[0].readOnly, true);
});

test("write is denied under read-only local policy", async () => {
  const connector = new CloseConnector(config(), new FakeUpstream());
  await assert.rejects(() => connector.call("close.task.create", { approved:true }), /Permission denied/);
});

test("write requires approval and strips approval metadata before forwarding", async () => {
  const upstream = new FakeUpstream();
  const connector = new CloseConnector(config({ permission:"write", upstreamScope:"mcp.write_safe" }), upstream);
  await assert.rejects(() => connector.call("close.task.create", { id:"lead_1" }), /approval required/i);
  await connector.call("close.task.create", { id:"lead_1", approved:true });
  assert.equal(upstream.calls[0].name, "create_task");
  assert.equal("approved" in upstream.calls[0].args, false);
  assert.equal(upstream.calls[0].readOnly, false);
});

test("high-risk update requires deliberate enablement and explicit approval reason", async () => {
  const disabled = new CloseConnector(config({ permission:"high_risk", upstreamScope:"mcp.write_destructive" }), new FakeUpstream());
  await assert.rejects(() => disabled.call("close.lead.update", { approved:true, approvalReason:"approved" }), /disabled/);

  const enabled = new CloseConnector(config({ permission:"high_risk", upstreamScope:"mcp.write_destructive", allowHighRisk:true }), new FakeUpstream());
  await assert.rejects(() => enabled.call("close.lead.update", { approved:true }), /approvalReason/);
  await enabled.call("close.lead.update", { id:"lead_1", approved:true, approvalReason:"Sales ops approved update" });
});

test("argument safety limits reject oversized payloads", async () => {
  const connector = new CloseConnector(config(), new FakeUpstream());
  await assert.rejects(() => connector.call("close.lead.get", { value:"x".repeat(100001) }), /exceeds/);
});
