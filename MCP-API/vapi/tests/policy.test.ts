import test from "node:test";
import assert from "node:assert/strict";
import { requireApproval } from "../src/policy.js";
import type { Config } from "../src/config.js";

const base: Config = {
  token: "x",
  mcpUrl: "https://mcp.vapi.ai/mcp",
  allowWrites: false,
  allowHighRisk: false,
  timeoutMs: 20000
};

test("READ never needs approval", () => {
  assert.doesNotThrow(() => requireApproval("READ", undefined, base));
});

test("WRITE is disabled by default and then requires approval", () => {
  assert.throws(() => requireApproval("WRITE", "approved", base), /disabled/);
  const enabled = { ...base, allowWrites: true };
  assert.throws(() => requireApproval("WRITE", undefined, enabled), /requires explicit approval/);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", enabled));
});

test("HIGH_RISK requires dedicated enablement and strong approval", () => {
  const enabled = { ...base, allowHighRisk: true };
  assert.throws(() => requireApproval("HIGH_RISK", "approved", enabled), /high-risk approval/);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", enabled));
});
