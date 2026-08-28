import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, approvalDigest } from "../src/auth/config.js";
import { TOOL_DEFINITIONS } from "../src/tools/definitions.js";
import { TOOL_POLICY, authorize } from "../src/tools/policy.js";

test("tool definitions and policy remain synchronized", () => {
  const tools = TOOL_DEFINITIONS.map((tool) => tool.name).sort();
  assert.equal(tools.length, 18);
  assert.deepEqual(tools, Object.keys(TOOL_POLICY).sort());
});

test("OAuth M2M is preferred when client credentials are configured", () => {
  const config = loadConfig({
    DATABRICKS_HOST: "https://example.cloud.databricks.com",
    DATABRICKS_CLIENT_ID: "client",
    DATABRICKS_CLIENT_SECRET: "secret",
    DATABRICKS_TOKEN: "legacy"
  });
  assert.equal(config.authMode, "oauth_m2m");
});

test("PAT fallback works without OAuth credentials", () => {
  const config = loadConfig({
    DATABRICKS_HOST: "https://example.cloud.databricks.com",
    DATABRICKS_TOKEN: "legacy"
  });
  assert.equal(config.authMode, "pat");
  assert.equal(config.token, "legacy");
});

test("workspace host rejects insecure URL and path prefixes", () => {
  assert.throws(() => loadConfig({ DATABRICKS_HOST: "http://example.com", DATABRICKS_TOKEN: "x" }), /HTTPS/);
  assert.throws(() => loadConfig({ DATABRICKS_HOST: "https://example.com/workspace", DATABRICKS_TOKEN: "x" }), /without a path/);
});

test("approval is bound to exact tool and payload", () => {
  const config = { approvalSecret: "human-secret", enableClusterTerminate: false };
  const tool = "databricks.cluster.start";
  const payload = { cluster_id: "abc" };
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => authorize(config, tool, payload, token));
  assert.throws(() => authorize(config, tool, { cluster_id: "other" }, token), /Invalid approval_token/);
});

test("cluster termination is disabled by default", () => {
  const config = { approvalSecret: "human-secret", enableClusterTerminate: false };
  assert.throws(() => authorize(config, "databricks.cluster.terminate", { cluster_id: "abc" }, "0".repeat(64)), /disabled/);
});
