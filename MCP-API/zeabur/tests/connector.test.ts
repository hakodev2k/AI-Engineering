import test from "node:test";
import assert from "node:assert/strict";
import { ApprovalError, requireApproval, requireToken } from "../src/security.js";
import { invoke, tools } from "../src/tools.js";

test("registers eight stable provider-scoped tools",()=>{assert.equal(tools.length,8);assert.ok(tools.every(t=>t.name.startsWith("zeabur.")));});
test("token validation rejects missing credentials",()=>assert.throws(()=>requireToken({}),/ZEABUR_TOKEN/));
test("write requires approval",()=>assert.throws(()=>requireApproval("WRITE",{}),ApprovalError));
test("high risk requires separate approval",()=>assert.throws(()=>requireApproval("HIGH_RISK",{ZEABUR_APPROVE_WRITE:"true"}),ApprovalError));
test("read is auto-approved",()=>assert.doesNotThrow(()=>requireApproval("READ",{})));
test("strict validation rejects extra input",()=>{const d=tools.find(t=>t.name==="zeabur.project.list")!;assert.throws(()=>d.schema.parse({ownerID:"x",token:"secret"}));});
test("read operation resolves official upstream tool and calls it",async()=>{const upstream={listTools:async()=>({tools:[{name:"listProjects"}]}),callTool:async(x:any)=>x,close:async()=>{}};const d=tools.find(t=>t.name==="zeabur.project.list")!;const r:any=await invoke(d,{},upstream);assert.equal(r.name,"listProjects");});
test("unsupported upstream capability fails closed",async()=>{const upstream={listTools:async()=>({tools:[{name:"unrelated"}]}),callTool:async()=>({}),close:async()=>{}};const d=tools.find(t=>t.name==="zeabur.project.list")!;await assert.rejects(()=>invoke(d,{},upstream),/does not expose/);});
