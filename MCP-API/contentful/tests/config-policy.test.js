import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig,approvalDigest } from "../src/auth/config.js";
import { CATALOG,externalDefinitions } from "../src/tools/catalog.js";
import { authorize } from "../src/tools/policy.js";

test("requires token and space",()=>{assert.throws(()=>loadConfig({}),/ACCESS_TOKEN/);assert.throws(()=>loadConfig({CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:"x"}),/SPACE_ID/);});
test("master is protected by default",()=>{const c=loadConfig({CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:"x",CONTENTFUL_SPACE_ID:"abc"},"/tmp/project");assert.equal(c.environmentId,"master");assert.deepEqual(c.protectedEnvironments,["master"]);});
test("catalog has exactly 15 stable tools",()=>{assert.equal(Object.keys(CATALOG).length,15);assert.ok(Object.keys(CATALOG).every(n=>n.startsWith("contentful.")));});
test("upstream schemas are reused and approval is added to writes",()=>{const upstream=Object.values(CATALOG).map(m=>({name:m.upstream,description:m.upstream,inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]}}));const defs=externalDefinitions(upstream);assert.equal(defs.find(d=>d.name==="contentful.entry.get").inputSchema.properties.approval_token,undefined);assert.equal(defs.find(d=>d.name==="contentful.entry.create").inputSchema.properties.approval_token.type,"string");});
test("missing upstream tool fails closed",()=>assert.throws(()=>externalDefinitions([]),/Required official upstream tool missing/));
test("protected environment blocks writes",()=>{const c={environmentId:"master",protectedEnvironments:["master"],destructiveEnabled:false,approvalSecret:"s"};assert.throws(()=>authorize(c,"contentful.entry.create",{x:1},"0".repeat(64)),/protected/);});
test("approval binds exact payload",()=>{const c={environmentId:"dev",protectedEnvironments:[],destructiveEnabled:false,approvalSecret:"secret"};const tool="contentful.entry.update",payload={entryId:"abc",version:2,fields:{title:{"en-US":"New"}}},token=approvalDigest(c.approvalSecret,tool,payload);assert.doesNotThrow(()=>authorize(c,tool,payload,token));assert.throws(()=>authorize(c,tool,{...payload,version:3},token),/Invalid approval/);});
test("destructive tool disabled by default",()=>{const c={environmentId:"dev",protectedEnvironments:[],destructiveEnabled:false,approvalSecret:"secret"};assert.throws(()=>authorize(c,"contentful.entry.delete",{entryId:"x"},"0".repeat(64)),/disabled/);});
