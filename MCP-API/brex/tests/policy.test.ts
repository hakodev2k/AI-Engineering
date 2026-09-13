import test from "node:test";
import assert from "node:assert/strict";
import { enforcePolicy } from "../src/policy.js";
import { TOOL_SPECS } from "../src/tools.js";

test("connector exposes 15 scoped tools and all are read-only", () => {
  assert.equal(TOOL_SPECS.length, 15);
  assert.ok(TOOL_SPECS.every((tool) => tool.name.startsWith("brex.")));
  assert.ok(TOOL_SPECS.every((tool) => tool.policy.risk === "READ"));
  assert.ok(TOOL_SPECS.every((tool) => tool.policy.permission.length > 0));
});

test("read policy executes without approval", () => {
  assert.doesNotThrow(() => enforcePolicy({ risk: "READ", approvalRequired: false, permission: "users.readonly" }));
});

test("write/high-risk policies require approval and destructive is disabled", () => {
  assert.throws(() => enforcePolicy({ risk: "WRITE", approvalRequired: true, permission: "users" }), /approval/i);
  assert.doesNotThrow(() => enforcePolicy({ risk: "HIGH_RISK", approvalRequired: true, permission: "transfers" }, "approved-high-risk"));
  assert.throws(() => enforcePolicy({ risk: "DESTRUCTIVE", approvalRequired: true, permission: "admin" }, "approved-high-risk"), /disabled/i);
});
