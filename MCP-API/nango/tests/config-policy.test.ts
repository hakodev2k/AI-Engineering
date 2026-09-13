import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { authorize, resetConsumedApprovalsForTests } from "../src/policy.js";

test("config requires secret and blocks local base URLs", () => {
  assert.throws(() => loadConfig({}), /NANGO_SECRET_KEY/);
  assert.throws(() => loadConfig({ NANGO_SECRET_KEY: "x", NANGO_BASE_URL: "http://localhost:3000" }), /https|loopback/);
});

test("policy allows reads and enforces one-use approval for high risk", () => {
  resetConsumedApprovalsForTests();
  const config = loadConfig({ NANGO_SECRET_KEY: "secret", NANGO_APPROVED_ACTION_IDS: "ok" });
  assert.doesNotThrow(() => authorize(config, "READ"));
  assert.throws(() => authorize(config, "HIGH_RISK"), /approval/);
  assert.doesNotThrow(() => authorize(config, "HIGH_RISK", "ok"));
  assert.throws(() => authorize(config, "HIGH_RISK", "ok"), /consumed/);
});

test("destructive operations remain disabled by default", () => {
  resetConsumedApprovalsForTests();
  const config = loadConfig({ NANGO_SECRET_KEY: "secret", NANGO_APPROVED_ACTION_IDS: "ok" });
  assert.throws(() => authorize(config, "DESTRUCTIVE", "ok"), /disabled/);
});
