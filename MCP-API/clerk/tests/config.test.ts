import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("secret key is required", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /CLERK_SECRET_KEY/);
});

test("safe defaults are read-only", () => {
  const c = loadConfig({ CLERK_SECRET_KEY: "sk_test_example" } as NodeJS.ProcessEnv);
  assert.equal(c.readOnly, true);
  assert.equal(c.allowWrite, false);
  assert.equal(c.approvalMode, "required");
  assert.equal(c.maxRetries, 2);
});

test("rejects non-https custom API origin", () => {
  assert.throws(() => loadConfig({ CLERK_SECRET_KEY: "x", CLERK_API_BASE_URL: "http://evil.example" } as NodeJS.ProcessEnv), /HTTPS/);
});
