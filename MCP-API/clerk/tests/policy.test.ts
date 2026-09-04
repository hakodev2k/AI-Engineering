import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed, PolicyError } from "../src/policy.js";

const enabled = { readOnly: false, allowWrite: true, approvalMode: "required" as const };

test("reads do not need approval", () => assert.doesNotThrow(() => assertAllowed("READ", undefined, enabled)));
test("writes require approval", () => assert.throws(() => assertAllowed("WRITE", undefined, enabled), PolicyError));
test("approved write is allowed", () => assert.doesNotThrow(() => assertAllowed("WRITE", { confirmed: true, reason: "Operator approved profile update" }, enabled)));
test("read-only mode blocks writes", () => assert.throws(() => assertAllowed("WRITE", { confirmed: true, reason: "approved" }, { ...enabled, readOnly: true }), /READ_ONLY/));
test("destructive risk is disabled", () => assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, enabled), /Destructive/));
