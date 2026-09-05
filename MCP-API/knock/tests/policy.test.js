import test from "node:test";import assert from "node:assert/strict";import {assertAllowed} from "../src/policy.js";
test("read automatic",()=>assert.doesNotThrow(()=>assertAllowed("READ",undefined,true)));
test("write approval default",()=>assert.throws(()=>assertAllowed("WRITE",undefined,true),/approval/i));
test("high risk always approval",()=>assert.throws(()=>assertAllowed("HIGH_RISK",undefined,false),/approval/i));
test("destructive blocked",()=>assert.throws(()=>assertAllowed("DESTRUCTIVE",{confirmed:true,reason:"operator"},false),/Destructive/));
