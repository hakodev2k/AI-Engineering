import test from "node:test";
import assert from "node:assert/strict";
import { TOOL_BY_NAME, TOOLS } from "../src/tools.js";

test("surface contains 8-20 scoped tools", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const t of TOOLS) assert.match(t.name, /^loops\.[a-z0-9_.]+$/);
});

test("external-message actions are high risk", () => {
  assert.equal(TOOL_BY_NAME.get("loops.transactional_email.send")?.risk, "HIGH_RISK");
  assert.equal(TOOL_BY_NAME.get("loops.event.send")?.risk, "HIGH_RISK");
});

test("contact delete is destructive", () => assert.equal(TOOL_BY_NAME.get("loops.contact.delete")?.risk, "DESTRUCTIVE"));

test("contact find enforces one identifier", () => {
  const tool = TOOL_BY_NAME.get("loops.contact.find")!;
  assert.throws(() => tool.parse({}));
  assert.throws(() => tool.parse({ email: "a@example.com", userId: "u1" }));
  assert.doesNotThrow(() => tool.parse({ email: "a@example.com" }));
});
