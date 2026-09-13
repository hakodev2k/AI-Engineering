import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("requires token", () => {
  assert.throws(() => loadConfig({}), /VAPI_TOKEN is required/);
});

test("loads secure defaults", () => {
  const config = loadConfig({ VAPI_TOKEN: "secret" });
  assert.equal(config.mcpUrl, "https://mcp.vapi.ai/mcp");
  assert.equal(config.allowWrites, false);
  assert.equal(config.allowHighRisk, false);
  assert.equal(config.timeoutMs, 20000);
});

test("rejects non-Vapi or insecure MCP endpoints", () => {
  assert.throws(() => loadConfig({ VAPI_TOKEN: "x", VAPI_MCP_URL: "http://mcp.vapi.ai/mcp" }), /https/);
  assert.throws(() => loadConfig({ VAPI_TOKEN: "x", VAPI_MCP_URL: "https://evil.example/mcp" }), /mcp.vapi.ai/);
});

test("validates booleans and timeout", () => {
  assert.throws(() => loadConfig({ VAPI_TOKEN: "x", VAPI_ALLOW_WRITES: "yes" }), /true or false/);
  assert.throws(() => loadConfig({ VAPI_TOKEN: "x", VAPI_TIMEOUT_MS: "0" }), /between 1 and 120000/);
});
