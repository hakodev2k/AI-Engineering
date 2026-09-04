import test from "node:test";
import assert from "node:assert/strict";
import { toolMap, tools } from "../src/tools.js";

test("exposes 8-20 scoped tools", () => {
  assert.ok(tools.length >= 8 && tools.length <= 20);
  for (const tool of tools) assert.match(tool.name, /^aircall\.[a-z0-9_.]+$/);
});

test("high-impact tools are classified and approval-gated", () => {
  assert.equal(toolMap.get("aircall.dial.prepare")?.risk, "WRITE");
  assert.equal(toolMap.get("aircall.webhook.create")?.risk, "HIGH_RISK");
  assert.equal(toolMap.get("aircall.webhook.delete")?.risk, "DESTRUCTIVE");
  assert.equal(toolMap.get("aircall.webhook.delete")?.approval, true);
});

test("dial input rejects ambiguous phone data", () => {
  const parse = toolMap.get("aircall.dial.prepare")!.parse;
  assert.throws(() => parse({ user_id: 1, phone_number: "javascript:alert(1)", approval: { confirmed: true, reason: "approved" } }));
});
