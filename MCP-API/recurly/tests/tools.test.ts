import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, TOOL_MAP } from "../src/tools.js";

test("registers a narrow provider-scoped surface", () => {
  assert.equal(TOOLS.length, 12);
  assert.equal(TOOL_MAP.size, 12);
  for (const tool of TOOLS) {
    assert.match(tool.name, /^recurly\./);
    assert.notEqual(tool.risk, "DESTRUCTIVE");
    assert.equal((tool.inputSchema as { additionalProperties?: boolean }).additionalProperties, false);
  }
});

test("validates cancellation approval inputs strictly", () => {
  const tool = TOOL_MAP.get("recurly.subscription.cancel")!;
  assert.deepEqual(tool.schema.parse({ subscriptionId:"uuid-abc", timeframe:"term_end", approved:true }), { subscriptionId:"uuid-abc", timeframe:"term_end", approved:true });
  assert.throws(() => tool.schema.parse({ subscriptionId:"x", timeframe:"now", approved:true }));
  assert.throws(() => tool.schema.parse({ subscriptionId:"x", timeframe:"term_end", extra:"no" }));
});
