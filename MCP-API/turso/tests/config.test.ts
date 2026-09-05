import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("requires credentials and organization", () => assert.throws(() => loadConfig({} as NodeJS.ProcessEnv)));
test("defaults to writes disabled and bounded timeout", () => {
  const c = loadConfig({ TURSO_PLATFORM_TOKEN: "test-token", TURSO_ORG: "demo-org" } as NodeJS.ProcessEnv);
  assert.equal(c.allowWrite, false); assert.equal(c.approvalMode, "required"); assert.equal(c.timeoutMs, 30000); assert.equal(c.baseUrl, "https://api.turso.tech");
});
