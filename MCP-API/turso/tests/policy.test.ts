import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed } from "../src/policy.js";

const writable = { allowWrite: true, approvalMode: "required" as const };
test("READ does not require approval", () => assert.doesNotThrow(() => assertAllowed("READ", undefined, writable)));
test("WRITE requires human approval", () => assert.throws(() => assertAllowed("WRITE", undefined, writable), /approval/i));
test("WRITE succeeds with explicit approval", () => assert.doesNotThrow(() => assertAllowed("WRITE", { confirmed: true, reason: "Operator approved provisioning" }, writable)));
test("write feature flag blocks mutations", () => assert.throws(() => assertAllowed("WRITE", { confirmed: true, reason: "approved" }, { ...writable, allowWrite: false }), /TURSO_ALLOW_WRITE/));
test("DESTRUCTIVE operations are always disabled", () => assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, writable), /disabled/));
