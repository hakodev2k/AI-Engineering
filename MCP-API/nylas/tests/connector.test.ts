import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { authorize, loadConfig, toolDefinitions, verifyWebhook, type Config } from "../src/index.js";

const cfg: Config = {
  apiKey: "placeholder",
  region: "us",
  defaultGrantId: "grant-example",
  timeoutMs: 2000,
  maxRetries: 1,
  approveWrites: false,
  approveHighRisk: true,
  enableDestructive: false,
  webhookSecret: "example-secret"
};

test("configuration requires credentials", () => {
  assert.throws(() => loadConfig({}), /NYLAS_API_KEY/);
});

test("tool names are unique and provider scoped", () => {
  assert.equal(new Set(toolDefinitions.map(x => x.name)).size, toolDefinitions.length);
  assert.ok(toolDefinitions.every(x => x.name.startsWith("nylas.")));
});

test("write approval is enforced", () => {
  assert.throws(() => authorize("WRITE", false, cfg), /Approval required/);
  authorize("WRITE", true, cfg);
});

test("high-risk approval is explicit", () => {
  assert.throws(() => authorize("HIGH_RISK", false, cfg), /Approval required/);
  authorize("HIGH_RISK", true, cfg);
});

test("destructive operations are disabled by default", () => {
  assert.throws(() => authorize("DESTRUCTIVE", true, cfg), /Approval required/);
});

test("webhook HMAC verification", () => {
  const raw = JSON.stringify({ type: "message.created" });
  const signature = createHmac("sha256", "example-secret").update(raw).digest("hex");
  assert.equal(verifyWebhook(raw, signature, "example-secret"), true);
  assert.equal(verifyWebhook(raw, "0".repeat(64), "example-secret"), false);
});
