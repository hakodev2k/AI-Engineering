import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed, PolicyError } from "../src/policy.js";

const writable = { readOnly: false, allowWrite: true, approvalMode: "required" as const };

test("READ requires no approval", () => {
  assert.doesNotThrow(() => assertAllowed("READ", undefined, writable));
});

test("WRITE requires explicit approval", () => {
  assert.throws(() => assertAllowed("WRITE", undefined, writable), PolicyError);
  assert.doesNotThrow(() => assertAllowed("WRITE", { confirmed: true, reason: "Operator approved publish" }, writable));
});

test("read-only and write gates deny writes", () => {
  const approval = { confirmed: true, reason: "approved" };
  assert.throws(() => assertAllowed("WRITE", approval, { ...writable, readOnly: true }), /READ_ONLY/);
  assert.throws(() => assertAllowed("HIGH_RISK", approval, { ...writable, allowWrite: false }), /ALLOW_WRITE/);
});

test("destructive operations are disabled", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, writable), /Destructive/);
});
