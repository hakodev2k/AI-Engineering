import test from "node:test";import assert from "node:assert/strict";import {loadConfig} from "../src/config.js";
test("requires isolated credentials and cluster id",()=>assert.throws(()=>loadConfig({} as any)));
test("defaults secure",()=>{const c=loadConfig({COCKROACHDB_CLOUD_API_KEY:"secret",COCKROACHDB_CLUSTER_ID:"cluster-id"} as any);assert.equal(c.readOnly,true);assert.equal(c.allowWrite,false);assert.equal(c.approvalMode,"required");assert.equal(c.timeoutMs,30000)});
