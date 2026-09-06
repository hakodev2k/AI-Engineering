import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("defaults to read-only policy", () => {
  const c = loadConfig({ FRONT_MCP_ACCESS_TOKEN:"test" });
  assert.deepEqual([...c.permissions], ["read"]);
  assert.equal(c.enableSend, false);
  assert.equal(c.requireWriteApproval, true);
});

test("rejects send enablement without send permission", () => {
  assert.throws(() => loadConfig({ FRONT_MCP_ACCESS_TOKEN:"x", FRONT_ENABLE_SEND:"true", FRONT_PERMISSIONS:"read,write" }));
});

test("requires credentials", () => assert.throws(() => loadConfig({})));
