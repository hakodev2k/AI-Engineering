import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed, PolicyError } from "../src/policy.js";

const enabled = { readOnly: false, allowWrite: true, allowDestructive: true, approvalMode: "required" as const };

test("READ is automatic", () => assert.doesNotThrow(() => assertAllowed("READ", undefined, enabled)));

test("WRITE requires approval", () => {
  assert.throws(() => assertAllowed("WRITE", undefined, enabled), PolicyError);
  assert.doesNotThrow(() => assertAllowed("WRITE", { confirmed: true, reason: "Operator approved dial preparation" }, enabled));
});

test("read-only blocks every mutation", () => {
  assert.throws(() => assertAllowed("HIGH_RISK", { confirmed: true, reason: "approved" }, { ...enabled, readOnly: true }), /READ_ONLY/);
});

test("destructive operations require separate enablement", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, { ...enabled, allowDestructive: false }), /ALLOW_DESTRUCTIVE/);
});
