import test from "node:test";
import assert from "node:assert/strict";
import { executeTool, TOOL_SPECS } from "../src/tools.js";
import type { Config } from "../src/config.js";
import type { Upstream } from "../src/upstream.js";

class FakeUpstream implements Upstream {
  calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    this.calls.push({ name, args });
    return { ok: true };
  }
  async close(): Promise<void> {}
}

const config: Config = {
  token: "x",
  mcpUrl: "https://mcp.vapi.ai/mcp",
  allowWrites: true,
  allowHighRisk: true,
  timeoutMs: 20000
};

function spec(name: string) {
  const found = TOOL_SPECS.find((item) => item.name === name);
  if (!found) throw new Error(`missing spec ${name}`);
  return found;
}

test("registers exactly the documented ten Vapi capabilities", () => {
  assert.equal(TOOL_SPECS.length, 10);
  assert.equal(new Set(TOOL_SPECS.map((x) => x.name)).size, 10);
});

test("read operation maps stable connector ID to official upstream parameter", async () => {
  const upstream = new FakeUpstream();
  await executeTool(spec("vapi.assistant.get"), { id: "550e8400-e29b-41d4-a716-446655440000" }, upstream, config);
  assert.deepEqual(upstream.calls[0], {
    name: "get_assistant",
    args: { assistantId: "550e8400-e29b-41d4-a716-446655440000" }
  });
});

test("outbound call validates E.164, requires high-risk approval and maps customer shape", async () => {
  const upstream = new FakeUpstream();
  const input = {
    assistantId: "550e8400-e29b-41d4-a716-446655440000",
    phoneNumberId: "1b671a64-40d5-491e-99b0-da01ff1f3341",
    customerNumber: "+15551234567",
    approval: "approved-high-risk"
  };
  await executeTool(spec("vapi.call.create"), input, upstream, config);
  assert.equal(upstream.calls[0]?.name, "create_call");
  assert.deepEqual(upstream.calls[0]?.args.customer, { number: "+15551234567" });
  await assert.rejects(
    () => executeTool(spec("vapi.call.create"), { ...input, customerNumber: "5551234567" }, upstream, config),
    /E\.164/
  );
});

test("write and high-risk approvals cannot be bypassed", async () => {
  const upstream = new FakeUpstream();
  await assert.rejects(
    () => executeTool(spec("vapi.assistant.create"), { name: "Support" }, upstream, config),
    /requires explicit approval/
  );
  await assert.rejects(
    () => executeTool(spec("vapi.call.create"), {
      assistantId: "550e8400-e29b-41d4-a716-446655440000",
      phoneNumberId: "1b671a64-40d5-491e-99b0-da01ff1f3341",
      customerNumber: "+15551234567",
      approval: "approved"
    }, upstream, config),
    /high-risk approval/
  );
});

test("strict schemas reject unknown fields", async () => {
  const upstream = new FakeUpstream();
  await assert.rejects(
    () => executeTool(spec("vapi.assistant.get"), {
      id: "550e8400-e29b-41d4-a716-446655440000",
      arbitraryRequest: "not allowed"
    }, upstream, config)
  );
});

test("upstream errors are surfaced without retrying", async () => {
  let calls = 0;
  const upstream: Upstream = {
    async callTool() {
      calls += 1;
      throw new Error("provider rate limited");
    },
    async close() {}
  };
  await assert.rejects(
    () => executeTool(spec("vapi.assistant.list"), {}, upstream, config),
    /provider rate limited/
  );
  assert.equal(calls, 1);
});
