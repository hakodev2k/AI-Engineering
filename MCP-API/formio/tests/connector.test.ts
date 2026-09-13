import test from "node:test";
import assert from "node:assert/strict";
import { requireApproval } from "../src/policy.js";
import { TOOL_SPECS, EXPECTED_UPSTREAM_TOOLS } from "../src/tools.js";
import type { Config } from "../src/config.js";

const base: Config = { allowWrites: false, allowHighRisk: false, allowDestructive: false, command: "npx", args: [], env: {} };

test("registers only fixed provider-scoped tools", () => {
  assert.equal(TOOL_SPECS.length, 19);
  assert.equal(new Set(TOOL_SPECS.map(x => x.name)).size, TOOL_SPECS.length);
  assert.ok(TOOL_SPECS.every(x => x.name.startsWith("formio.")));
  assert.equal(new Set(EXPECTED_UPSTREAM_TOOLS).size, EXPECTED_UPSTREAM_TOOLS.length);
});

test("read operations need no approval", () => {
  assert.doesNotThrow(() => requireApproval("READ", undefined, base));
});

test("write operations are disabled by default", () => {
  assert.throws(() => requireApproval("WRITE", "approved", base), /WRITE_DENIED/);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", { ...base, allowWrites: true }));
});

test("high-risk requires both configuration and explicit token", () => {
  const cfg = { ...base, allowHighRisk: true };
  assert.throws(() => requireApproval("HIGH_RISK", "approved", cfg), /HIGH_RISK_DENIED/);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", cfg));
});

test("destructive operations are strongly gated", () => {
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved-destructive", base), /DESTRUCTIVE_DENIED/);
  assert.doesNotThrow(() => requireApproval("DESTRUCTIVE", "approved-destructive", { ...base, allowDestructive: true }));
});

test("sensitive role/action mutation is not classified as ordinary write", () => {
  for (const name of ["formio.role.create", "formio.role.update", "formio.action.create", "formio.action.update", "formio.project.import"]) {
    assert.equal(TOOL_SPECS.find(x => x.name === name)?.risk, "HIGH_RISK");
  }
  assert.equal(TOOL_SPECS.find(x => x.name === "formio.action.delete")?.risk, "DESTRUCTIVE");
});
