import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, requireApproval } from "../src/auth/config.js";

const baseEnv = { REVENUECAT_API_V2_KEY: "secret_test_key" } as NodeJS.ProcessEnv;

test("requires an API v2 key", () => {
  assert.throws(() => loadConfig({}), /REVENUECAT_API_V2_KEY is required/);
});

test("uses secure official defaults", () => {
  const config = loadConfig(baseEnv);
  assert.equal(config.mcpUrl, "https://mcp.revenuecat.ai/mcp");
  assert.equal(config.apiBaseUrl, "https://api.revenuecat.com/v2");
  assert.equal(config.timeoutMs, 15000);
});

test("rejects insecure endpoint overrides", () => {
  assert.throws(() => loadConfig({ ...baseEnv, REVENUECAT_MCP_URL: "http://localhost:3000" }), /must use HTTPS/);
});

test("read does not require approval", () => {
  const config = loadConfig(baseEnv);
  assert.doesNotThrow(() => requireApproval(config, "READ"));
});

test("write requires configured matching approval token", () => {
  const config = loadConfig({ ...baseEnv, REVENUECAT_APPROVAL_TOKEN: "human-approved" });
  assert.throws(() => requireApproval(config, "WRITE", "wrong"), /Explicit human approval/);
  assert.doesNotThrow(() => requireApproval(config, "WRITE", "human-approved"));
});
