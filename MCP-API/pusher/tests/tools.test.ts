import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, TOOL_BY_NAME } from "../src/tools.js";

test("exposes 8 curated tools", () => {
  assert.equal(TOOLS.length, 8);
});

test("all tool names are provider scoped", () => {
  for (const tool of TOOLS) assert.match(tool.name, /^pusher\.[a-z0-9_.]+$/);
});

test("publishing and termination are approval-gated risk classes", () => {
  assert.equal(TOOL_BY_NAME.get("pusher.event.publish")?.risk, "WRITE");
  assert.equal(TOOL_BY_NAME.get("pusher.user.connections.terminate")?.risk, "HIGH_RISK");
});

test("no arbitrary HTTP or destructive tool is exposed", () => {
  assert.equal(TOOLS.some((t) => t.risk === "DESTRUCTIVE"), false);
  assert.equal(TOOLS.some((t) => /request|http/i.test(t.name)), false);
});
