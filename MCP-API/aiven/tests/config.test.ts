import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("authentication token is required", () => {
  assert.throws(() => loadConfig({}), /AIVEN_TOKEN/);
});

test("safe defaults enable read-only mode and disable writes", () => {
  const config = loadConfig({ AIVEN_TOKEN: "test-token" });
  assert.equal(config.readOnly, true);
  assert.equal(config.allowWrite, false);
  assert.equal(config.approvalMode, "required");
  assert.equal(config.timeoutMs, 30000);
});

test("timeout configuration is bounded", () => {
  assert.throws(() => loadConfig({ AIVEN_TOKEN: "test-token", AIVEN_TOOL_TIMEOUT_MS: "500" }));
  assert.throws(() => loadConfig({ AIVEN_TOKEN: "test-token", AIVEN_TOOL_TIMEOUT_MS: "130000" }));
});
