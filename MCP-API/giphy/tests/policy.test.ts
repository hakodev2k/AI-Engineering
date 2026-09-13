import test from "node:test";
import assert from "node:assert/strict";
import { authorize } from "../src/policy.js";

test("READ is allowed", () => assert.doesNotThrow(() => authorize("READ")));
test("WRITE is denied", () => assert.throws(() => authorize("WRITE"), /Permission denied/));
test("HIGH_RISK is denied", () => assert.throws(() => authorize("HIGH_RISK"), /Permission denied/));
test("DESTRUCTIVE is denied", () => assert.throws(() => authorize("DESTRUCTIVE"), /Permission denied/));
