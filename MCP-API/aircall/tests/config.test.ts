import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("accepts private Basic Auth configuration", () => {
  const cfg = loadConfig({ AIRCALL_API_ID: "id", AIRCALL_API_TOKEN: "token" } as NodeJS.ProcessEnv);
  assert.equal(cfg.auth.type, "basic");
  assert.equal(cfg.readOnly, true);
  assert.equal(cfg.allowWrite, false);
});

test("accepts OAuth bearer configuration", () => {
  const cfg = loadConfig({ AIRCALL_ACCESS_TOKEN: "oauth-token" } as NodeJS.ProcessEnv);
  assert.equal(cfg.auth.type, "bearer");
});

test("requires exactly one auth mode", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /exactly one auth mode/i);
  assert.throws(() => loadConfig({ AIRCALL_API_ID: "id", AIRCALL_API_TOKEN: "token", AIRCALL_ACCESS_TOKEN: "oauth" } as NodeJS.ProcessEnv), /exactly one auth mode/i);
});
