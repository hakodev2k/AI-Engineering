import test from "node:test";import assert from "node:assert/strict";import {loadConfig} from "../src/config.js";
test("requires key",()=>assert.throws(()=>loadConfig({}),/KNOCK_API_KEY/));
test("secure defaults",()=>{const c=loadConfig({KNOCK_API_KEY:"sk_test_x"});assert.equal(c.requireWriteApproval,true);assert.equal(c.maxReadRetries,3);});
test("rejects non-https base",()=>assert.throws(()=>loadConfig({KNOCK_API_KEY:"x",KNOCK_API_BASE_URL:"http://evil.test"}),/https/));
