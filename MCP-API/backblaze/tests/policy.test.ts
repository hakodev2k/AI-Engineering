import test from "node:test";
import assert from "node:assert/strict";
import { assertPolicy, PolicyError } from "../src/policy.js";
import type { BackblazeConfig } from "../src/config.js";

const base: BackblazeConfig = {
  keyId: "id",
  applicationKey: "secret",
  region: "us-east-005",
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  allowWrite: false,
  allowDestructive: false,
  writeApprovalRequired: true,
  requestTimeoutMs: 1000,
  maxAttempts: 3
};

test("READ is allowed without approval", () => {
  assert.doesNotThrow(() => assertPolicy(base, "READ", false));
});

test("WRITE requires write enablement and approval when configured", () => {
  assert.throws(() => assertPolicy(base, "WRITE", true), PolicyError);
  const enabled = { ...base, allowWrite: true };
  assert.throws(() => assertPolicy(enabled, "WRITE", false), PolicyError);
  assert.doesNotThrow(() => assertPolicy(enabled, "WRITE", true));
});

test("HIGH_RISK always requires explicit approval", () => {
  const enabled = { ...base, allowWrite: true, writeApprovalRequired: false };
  assert.throws(() => assertPolicy(enabled, "HIGH_RISK", false), PolicyError);
  assert.doesNotThrow(() => assertPolicy(enabled, "HIGH_RISK", true));
});

test("DESTRUCTIVE also requires destructive enablement", () => {
  const writeOnly = { ...base, allowWrite: true };
  assert.throws(() => assertPolicy(writeOnly, "DESTRUCTIVE", true), PolicyError);
  const destructive = { ...writeOnly, allowDestructive: true };
  assert.doesNotThrow(() => assertPolicy(destructive, "DESTRUCTIVE", true));
});
