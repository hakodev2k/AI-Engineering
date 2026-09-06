import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, TOOL_MAP, argsForUpstream } from "../src/tools.js";

test("registers a curated provider-scoped tool set", () => {
  assert.equal(TOOLS.length, 17);
  assert.equal(new Set(TOOLS.map(t => t.name)).size, 17);
  assert.ok(TOOLS.every(t => t.name.startsWith("front.")));
  assert.ok(TOOL_MAP.has("front.conversation.search"));
});

test("strict IDs and approval stripping", () => {
  const def = TOOL_MAP.get("front.conversation.read")!;
  assert.throws(() => def.schema.parse({ conversationId:"bad" }));
  assert.deepEqual(argsForUpstream({ conversationId:"cnv_123", approved:true }), { conversationId:"cnv_123" });
});

test("send is high-risk and explicit approval", () => {
  const def = TOOL_MAP.get("front.message.send")!;
  assert.equal(def.policy.risk, "HIGH_RISK");
  assert.equal(def.policy.approval, "explicit");
});
