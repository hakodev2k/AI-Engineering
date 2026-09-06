import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("loads least-privilege defaults", () => {
  const cfg = loadConfig({ RECURLY_API_KEY:"secret" });
  assert.equal(cfg.permission, "read");
  assert.equal(cfg.requireWriteApproval, true);
  assert.equal(cfg.requireHighRiskApproval, true);
  assert.equal(cfg.apiVersion, "2021-02-25");
});

test("requires a credential", () => {
  assert.throws(() => loadConfig({}));
});
