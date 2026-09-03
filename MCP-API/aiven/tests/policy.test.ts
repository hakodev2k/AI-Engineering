import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed, PolicyError } from "../src/policy.js";

const base = { readOnly: false, allowWrite: true, approvalMode: "required" as const };

test("READ is allowed without approval", () => {
  assert.doesNotThrow(() => assertAllowed("READ", undefined, base));
});

test("WRITE requires explicit approval", () => {
  assert.throws(() => assertAllowed("WRITE", undefined, base), PolicyError);
  assert.doesNotThrow(() => assertAllowed("WRITE", { confirmed: true, reason: "Operator approved provisioning" }, base));
});

test("read-only mode blocks writes", () => {
  assert.throws(() => assertAllowed("WRITE", { confirmed: true, reason: "approved" }, { ...base, readOnly: true }), /READ_ONLY/);
});

test("write gate blocks writes even when approved", () => {
  assert.throws(() => assertAllowed("HIGH_RISK", { confirmed: true, reason: "approved" }, { ...base, allowWrite: false }), /ALLOW_WRITE/);
});

test("destructive operations are always disabled", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, base), /Destructive/);
});
