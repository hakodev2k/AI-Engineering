import { describe, expect, it } from "vitest";
import type { ConnectorConfig } from "../src/auth.js";
import { ToolRegistry } from "../src/tools.js";
import { TOOL_POLICIES } from "../src/policy.js";
import type { Upstream, UpstreamTool } from "../src/types.js";

class FakeUpstream implements Upstream {
  calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  failures = 0;
  tools: UpstreamTool[] = TOOL_POLICIES.map((p) => ({
    name: p.upstreamName,
    description: p.purpose,
    inputSchema: { type: "object", properties: { app_id: { type: "string" } }, required: ["app_id"], additionalProperties: false }
  }));
  async listTools() { return this.tools; }
  async callTool(name: string, args: Record<string, unknown>) {
    this.calls.push({ name, args });
    if (this.failures-- > 0) throw new Error("503 temporary network failure");
    return { content: [{ type: "text", text: "ok" }] };
  }
  async close() {}
}

const baseConfig: ConnectorConfig = {
  mcpUrl: "https://api.onesignal.com/mcp/oauth",
  accessToken: "test-token-never-logged",
  timeoutMs: 1000,
  requireWriteApproval: true,
  allowHighRisk: false
};

async function registry(config: ConnectorConfig = baseConfig, fake = new FakeUpstream()) {
  const r = new ToolRegistry(fake, config);
  await r.initialize();
  return { r, fake };
}

describe("OneSignal connector", () => {
  it("registers only the documented allowlist with provider-scoped names", async () => {
    const { r } = await registry();
    expect(r.list()).toHaveLength(16);
    expect(r.list().every((t) => t.name.startsWith("onesignal."))).toBe(true);
  });

  it("fails closed if an expected official MCP capability disappears", async () => {
    const fake = new FakeUpstream();
    fake.tools = fake.tools.filter((t) => t.name !== "send_message");
    await expect(registry(baseConfig, fake)).rejects.toThrow("missing required allowlisted tool");
  });

  it("enforces the upstream schema and rejects extra parameters", async () => {
    const { r } = await registry();
    await expect(r.call("onesignal.app.list", { app_id: "app", surprise: true })).rejects.toThrow("Invalid input");
  });

  it("does not forward approval metadata upstream", async () => {
    const { r, fake } = await registry();
    await r.call("onesignal.user.create", { app_id: "app", _approval: true });
    expect(fake.calls[0]).toEqual({ name: "create_user", args: { app_id: "app" } });
  });

  it("blocks writes without approval when configured", async () => {
    const { r } = await registry();
    await expect(r.call("onesignal.user.update", { app_id: "app", _approval: false })).rejects.toThrow("approval");
  });

  it("blocks high-risk message sending unless operator enables it", async () => {
    const { r } = await registry();
    await expect(r.call("onesignal.message.send", { app_id: "app", _approval: true })).rejects.toThrow("disabled");
  });

  it("requires explicit approval even when high-risk execution is operator-enabled", async () => {
    const { r } = await registry({ ...baseConfig, allowHighRisk: true });
    await expect(r.call("onesignal.message.send", { app_id: "app", _approval: false })).rejects.toThrow("approval");
  });

  it("retries transient read failures but never write failures", async () => {
    const readFake = new FakeUpstream(); readFake.failures = 1;
    const { r: read } = await registry(baseConfig, readFake);
    await read.call("onesignal.app.list", { app_id: "app" });
    expect(readFake.calls).toHaveLength(2);

    const writeFake = new FakeUpstream(); writeFake.failures = 1;
    const { r: write } = await registry(baseConfig, writeFake);
    await expect(write.call("onesignal.user.create", { app_id: "app", _approval: true })).rejects.toThrow("503");
    expect(writeFake.calls).toHaveLength(1);
  });
});
