import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";
import { WorkableMcpClient, WorkableMcpError } from "../src/upstream.js";

test("tool registry exposes the intended scoped tools",()=>{assert.equal(TOOLS.length,13);assert.ok(TOOL_MAP.has("workable.job.search"));assert.ok(TOOL_MAP.has("workable.candidate.move"));});
test("config requires credential",()=>{assert.throws(()=>loadConfig({} as NodeJS.ProcessEnv),/WORKABLE_MCP_ACCESS_TOKEN/);});
test("config defaults to read only",()=>{const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"secret"} as NodeJS.ProcessEnv);assert.ok(c.permissions.has("read"));assert.equal(c.permissions.has("write"),false);});
test("strict schemas reject ambiguous input",()=>{assert.throws(()=>TOOL_MAP.get("workable.job.search")!.schema.parse({query:""}));assert.throws(()=>TOOL_MAP.get("workable.candidate.create")!.schema.parse({shortcode:"ENG",firstname:"A"}));});
test("write is denied without permission",()=>{const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"x"} as NodeJS.ProcessEnv);assert.throws(()=>assertAllowed("WRITE",{approved:true},c),/Permission denied/);});
test("write approval is enforced",()=>{const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"x",WORKABLE_PERMISSIONS:"read,write"} as NodeJS.ProcessEnv);assert.throws(()=>assertAllowed("WRITE",{},c),/approval/);assert.doesNotThrow(()=>assertAllowed("WRITE",{approved:true},c));});
test("high risk requires distinct permission and approval",()=>{const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"x",WORKABLE_PERMISSIONS:"read,high_risk"} as NodeJS.ProcessEnv);assert.throws(()=>assertAllowed("HIGH_RISK",{},c),/approval/);assert.doesNotThrow(()=>assertAllowed("HIGH_RISK",{approved:true},c));});
test("upstream sends bearer credential only in transport layer",async()=>{let auth="";let body:any;const fake=async(_u:any,i:any)=>{auth=i.headers.authorization;body=JSON.parse(i.body);return new Response(JSON.stringify({jsonrpc:"2.0",id:1,result:{content:[]}}),{status:200,headers:{"content-type":"application/json"}})};const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"topsecret"} as NodeJS.ProcessEnv);const client=new WorkableMcpClient(c,fake as typeof fetch);await client.callTool("get_accounts",{});assert.equal(auth,"Bearer topsecret");assert.equal(JSON.stringify(body).includes("topsecret"),false);});
test("429 preserves retry-after after bounded retry",async()=>{let calls=0;const fake=async()=>{calls++;return new Response("slow",{status:429,headers:{"retry-after":"0"}})};const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"x",WORKABLE_MAX_RETRIES:"1"} as NodeJS.ProcessEnv);const client=new WorkableMcpClient(c,fake as typeof fetch);await assert.rejects(()=>client.callTool("get_accounts",{}),e=>e instanceof WorkableMcpError&&e.status===429&&e.retryAfter==="0");assert.equal(calls,2);});
test("non-retryable write is called once on server error",async()=>{let calls=0;const fake=async()=>{calls++;return new Response("bad",{status:503})};const c=loadConfig({WORKABLE_MCP_ACCESS_TOKEN:"x",WORKABLE_MAX_RETRIES:"5"} as NodeJS.ProcessEnv);const client=new WorkableMcpClient(c,fake as typeof fetch);await assert.rejects(()=>client.callTool("create_candidate",{},false));assert.equal(calls,1);});
