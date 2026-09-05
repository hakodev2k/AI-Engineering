import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("requires API key", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /COURIER_API_KEY/);
});

test("safe defaults disable writes", () => {
  const cfg = loadConfig({ COURIER_API_KEY: "test-key" } as NodeJS.ProcessEnv);
  assert.equal(cfg.allowWrite, false);
  assert.equal(cfg.approvalMode, "required");
  assert.equal(cfg.readRetries, 2);
});

test("rejects insecure non-local MCP URL", () => {
  assert.throws(() => loadConfig({ COURIER_API_KEY: "x", COURIER_MCP_URL: "http://example.com" } as NodeJS.ProcessEnv), /HTTPS/);
});
