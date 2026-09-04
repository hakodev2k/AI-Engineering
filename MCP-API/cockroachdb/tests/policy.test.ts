import test from "node:test";import assert from "node:assert/strict";import {assertAllowed,PolicyError} from "../src/policy.js";
const cfg={readOnly:false,allowWrite:true,approvalMode:"required" as const};
test("reads need no approval",()=>assert.doesNotThrow(()=>assertAllowed("READ",undefined,cfg)));
test("write needs approval",()=>assert.throws(()=>assertAllowed("WRITE",undefined,cfg),PolicyError));
test("approved write passes when enabled",()=>assert.doesNotThrow(()=>assertAllowed("WRITE",{confirmed:true,reason:"Operator approved exact change"},cfg)));
test("read-only and write gates deny mutations",()=>{assert.throws(()=>assertAllowed("WRITE",{confirmed:true,reason:"approved"},{...cfg,readOnly:true}));assert.throws(()=>assertAllowed("WRITE",{confirmed:true,reason:"approved"},{...cfg,allowWrite:false}))});
test("destructive is always disabled",()=>assert.throws(()=>assertAllowed("DESTRUCTIVE",{confirmed:true,reason:"approved"},cfg)));
