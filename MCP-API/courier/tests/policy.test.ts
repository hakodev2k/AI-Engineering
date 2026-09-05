import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed, PolicyError } from "../src/policy.js";

const enabled = { allowWrite: true, approvalMode: "required" as const };

test("READ executes without approval", () => {
  assert.doesNotThrow(() => assertAllowed("READ", undefined, enabled));
});

test("WRITE and HIGH_RISK require approval", () => {
  assert.throws(() => assertAllowed("WRITE", undefined, enabled), PolicyError);
  assert.throws(() => assertAllowed("HIGH_RISK", { confirmed: true, reason: "" }, enabled), PolicyError);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", { confirmed: true, reason: "Operator approved exact send" }, enabled));
});

test("write gate denies mutation even with approval", () => {
  assert.throws(() => assertAllowed("WRITE", { confirmed: true, reason: "approved" }, { ...enabled, allowWrite: false }), /ALLOW_WRITE/);
});

test("DESTRUCTIVE is always disabled", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, enabled), /Destructive/);
});
