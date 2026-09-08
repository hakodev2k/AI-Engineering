import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/auth/config.js";
import { ApprovalError, requirePermission } from "../src/auth/policy.js";

test("loadConfig requires a Lob secret key", () => {
  assert.throws(() => loadConfig({}), /LOB_API_KEY is required/);
  assert.throws(() => loadConfig({ LOB_API_KEY: "bad" }), /test_\* or live_\*/);
});

test("loadConfig accepts test key and secure HTTPS base URL", () => {
  const cfg = loadConfig({ LOB_API_KEY: "test_abc123", LOB_MAX_RETRIES: "3" });
  assert.equal(cfg.baseUrl, "https://api.lob.com/v1");
  assert.equal(cfg.maxRetries, 3);
});

test("HIGH_RISK operations require matching approval token", () => {
  const cfg = loadConfig({ LOB_API_KEY: "test_abc123", LOB_APPROVAL_TOKEN: "human-approved" });
  assert.throws(() => requirePermission(cfg, "HIGH_RISK"), ApprovalError);
  assert.throws(() => requirePermission(cfg, "HIGH_RISK", "wrong-token"), ApprovalError);
  assert.doesNotThrow(() => requirePermission(cfg, "HIGH_RISK", "human-approved"));
});

test("DESTRUCTIVE operations are disabled by default", () => {
  const cfg = loadConfig({ LOB_API_KEY: "test_abc123", LOB_APPROVAL_TOKEN: "human-approved" });
  assert.throws(() => requirePermission(cfg, "DESTRUCTIVE", "human-approved"), /disabled/);
});

test("DESTRUCTIVE requires enable flag and approval", () => {
  const cfg = loadConfig({ LOB_API_KEY: "test_abc123", LOB_APPROVAL_TOKEN: "human-approved", LOB_ENABLE_DESTRUCTIVE: "true" });
  assert.doesNotThrow(() => requirePermission(cfg, "DESTRUCTIVE", "human-approved"));
});
