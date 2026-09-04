import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowed } from "../src/policy.js";

const enabled = { allowWrite: true, allowDestructive: false, approvalMode: "required" as const };

test("read is automatic", () => assert.doesNotThrow(() => assertAllowed("READ", undefined, enabled)));
test("write needs approval", () => assert.throws(() => assertAllowed("WRITE", undefined, enabled), /approval/i));
test("write gate defaults closed", () => assert.throws(() => assertAllowed("WRITE", { confirmed: true, reason: "approved" }, { ...enabled, allowWrite: false }), /disabled/i));
test("destructive gate is separate", () => assert.throws(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved" }, enabled), /Destructive/));
test("destructive can run only with both gates and approval", () => assert.doesNotThrow(() => assertAllowed("DESTRUCTIVE", { confirmed: true, reason: "approved deletion" }, { ...enabled, allowDestructive: true })));
