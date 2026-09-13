import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config.js";

test("config requires credentials", () => assert.throws(() => loadConfig({}), /KINDE_DOMAIN is required/));

test("config uses secure defaults", () => {
  const config = loadConfig({
    KINDE_DOMAIN: "https://tenant.kinde.com",
    KINDE_CLIENT_ID: "client",
    KINDE_CLIENT_SECRET: "secret",
    KINDE_AUDIENCE: "https://tenant.kinde.com/api"
  });
  assert.equal(config.domain, "https://tenant.kinde.com");
  assert.equal(config.allowWrites, false);
  assert.equal(config.allowHighRisk, false);
  assert.equal(config.maxRetries, 2);
});

test("config rejects unsafe domain and cross-origin audience", () => {
  assert.throws(() => loadConfig({ KINDE_DOMAIN: "http://tenant.kinde.com", KINDE_CLIENT_ID: "c", KINDE_CLIENT_SECRET: "s", KINDE_AUDIENCE: "https://tenant.kinde.com/api" }), /HTTPS origin/);
  assert.throws(() => loadConfig({ KINDE_DOMAIN: "https://tenant.kinde.com", KINDE_CLIENT_ID: "c", KINDE_CLIENT_SECRET: "s", KINDE_AUDIENCE: "https://evil.example/api" }), /KINDE_AUDIENCE/);
});
