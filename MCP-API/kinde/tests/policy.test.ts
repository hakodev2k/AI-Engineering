import assert from "node:assert/strict";
import test from "node:test";
import type { KindeConfig } from "../src/config.js";
import { ApprovalError, requireApproval } from "../src/policy.js";

const base: KindeConfig = {
  domain: "https://tenant.kinde.com", clientId: "client", clientSecret: "secret",
  audience: "https://tenant.kinde.com/api", scopes: "read:users",
  timeoutMs: 1000, maxRetries: 0, allowWrites: false, allowHighRisk: false
};

test("READ does not require approval", () => assert.doesNotThrow(() => requireApproval("READ", undefined, base)));
test("WRITE is operator-disabled by default", () => assert.throws(() => requireApproval("WRITE", "approved", base), ApprovalError));
test("WRITE needs flag and explicit approval", () => {
  const config = { ...base, allowWrites: true };
  assert.throws(() => requireApproval("WRITE", undefined, config), ApprovalError);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", config));
});
test("HIGH_RISK needs separate flag and approval", () => {
  const config = { ...base, allowHighRisk: true };
  assert.throws(() => requireApproval("HIGH_RISK", "approved", config), ApprovalError);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", config));
});
