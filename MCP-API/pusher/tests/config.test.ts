import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

const credentials = {
  PUSHER_APP_ID: "app",
  PUSHER_KEY: "key",
  PUSHER_SECRET: "secret",
  PUSHER_CLUSTER: "eu"
};

test("requires all Pusher credentials", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv));
});

test("safe defaults are read-only with approvals required", () => {
  const cfg = loadConfig(credentials as NodeJS.ProcessEnv);
  assert.equal(cfg.readOnly, true);
  assert.equal(cfg.allowWrite, false);
  assert.equal(cfg.approvalMode, "required");
  assert.equal(cfg.useTLS, true);
});

test("timeout is bounded", () => {
  assert.throws(() => loadConfig({ ...credentials, PUSHER_TIMEOUT_MS: "999999" } as NodeJS.ProcessEnv));
});
