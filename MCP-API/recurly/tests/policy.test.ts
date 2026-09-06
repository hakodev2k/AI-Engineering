import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed } from "../src/policy.js";
import type { Config } from "../src/config.js";

const base: Config = { apiKey:"x", apiVersion:"2021-02-25", permission:"read", requireWriteApproval:true, requireHighRiskApproval:true, timeoutMs:1000, maxRetries:0 };

test("read is allowed by default", () => assert.doesNotThrow(() => assertAllowed("READ", "read", {}, base)));
test("write is denied without permission", () => assert.throws(() => assertAllowed("WRITE", "write", { approved:true }, base)));
test("high-risk needs permission and approval", () => {
  const cfg = { ...base, permission:"high-risk" as const };
  assert.throws(() => assertAllowed("HIGH_RISK", "cancel", {}, cfg));
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "cancel", { approved:true }, cfg));
});
test("destructive is always disabled", () => assert.throws(() => assertAllowed("DESTRUCTIVE", "delete", { approved:true }, { ...base, permission:"high-risk" })));
