import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, TOOL_BY_NAME } from "../src/tools.js";

test("tool surface stays in useful 8-20 range", () => assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20));
test("all names are Clerk-scoped and unique", () => {
  assert.equal(new Set(TOOLS.map(t => t.name)).size, TOOLS.length);
  for (const t of TOOLS) assert.match(t.name, /^clerk\.[a-z0-9_.]+$/);
});
test("external-message and access revocation tools are high risk", () => {
  assert.equal(TOOL_BY_NAME.get("clerk.invitation.create")?.risk, "HIGH_RISK");
  assert.equal(TOOL_BY_NAME.get("clerk.organization.invitation.create")?.risk, "HIGH_RISK");
  assert.equal(TOOL_BY_NAME.get("clerk.session.revoke")?.risk, "HIGH_RISK");
});
test("no delete tool is exposed", () => assert.equal(TOOLS.some(t => /\.delete$/.test(t.name)), false));
