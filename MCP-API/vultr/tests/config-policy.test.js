import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { approvalDigest, assertPermission, RISK, TOOL_RISKS } from "../src/policy.js";
import { TOOL_NAMES } from "../src/tools.js";

const baseEnv = { VULTR_API_KEY: "test-key" };

test("configuration requires API key and pins official API origin", () => {
  assert.throws(() => loadConfig({}), /VULTR_API_KEY/);
  assert.equal(loadConfig(baseEnv).apiBaseUrl, "https://api.vultr.com/v2");
  assert.throws(() => loadConfig({ ...baseEnv, VULTR_API_BASE_URL: "https://example.com/v2" }), /official/);
  assert.throws(() => loadConfig({ ...baseEnv, VULTR_MAX_RETRIES: "99" }), /VULTR_MAX_RETRIES/);
});

test("tool registry and policy map are synchronized and provider scoped", () => {
  assert.deepEqual(new Set(TOOL_NAMES), new Set(Object.keys(TOOL_RISKS)));
  assert.equal(TOOL_NAMES.length, 16);
  for (const name of TOOL_NAMES) assert.match(name, /^vultr\./);
});

test("reads execute without approval", () => {
  const config = loadConfig(baseEnv);
  assert.doesNotThrow(() => assertPermission("vultr.instance.list", {}, config));
  assert.equal(TOOL_RISKS["vultr.instance.list"], RISK.READ);
});

test("write approval is bound to exact payload", () => {
  const secret = "a-strong-test-secret-123";
  const config = loadConfig({ ...baseEnv, VULTR_APPROVAL_SECRET: secret });
  const input = { instanceId: "abc123", tags: ["blue"] };
  const approvalToken = approvalDigest(secret, "vultr.instance.tags.update", input);
  assert.doesNotThrow(() => assertPermission("vultr.instance.tags.update", { ...input, approvalToken }, config));
  assert.throws(() => assertPermission("vultr.instance.tags.update", { instanceId: "abc123", tags: ["red"], approvalToken }, config), /approval/);
});

test("high-risk and destructive operations are disabled by default", () => {
  const secret = "a-strong-test-secret-123";
  const config = loadConfig({ ...baseEnv, VULTR_APPROVAL_SECRET: secret });
  assert.throws(() => assertPermission("vultr.instance.create", {}, config), /HIGH_RISK/);
  assert.throws(() => assertPermission("vultr.instance.delete", {}, config), /DESTRUCTIVE/);
});

test("explicit gates plus exact approval permit configured risky calls", () => {
  const secret = "a-strong-test-secret-123";
  const config = loadConfig({ ...baseEnv, VULTR_APPROVAL_SECRET: secret, VULTR_ENABLE_HIGH_RISK: "true", VULTR_ENABLE_DESTRUCTIVE: "true" });
  const reboot = { instanceId: "abc123" };
  const rebootToken = approvalDigest(secret, "vultr.instance.reboot", reboot);
  assert.doesNotThrow(() => assertPermission("vultr.instance.reboot", { ...reboot, approvalToken: rebootToken }, config));
  const del = { instanceId: "abc123", confirmId: "abc123" };
  const deleteToken = approvalDigest(secret, "vultr.instance.delete", del);
  assert.doesNotThrow(() => assertPermission("vultr.instance.delete", { ...del, approvalToken: deleteToken }, config));
});
