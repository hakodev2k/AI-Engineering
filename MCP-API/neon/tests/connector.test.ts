import test from "node:test";
import assert from "node:assert/strict";
import { ToolRouter, tools } from "../src/tools.js";
import { ApprovalError, ValidationError, requireApproval } from "../src/security.js";

class FakeApi {
  calls:any[]=[];
  async get(path:string){this.calls.push(["GET",path]);return {projects:[]};}
  async post(path:string,body?:unknown){this.calls.push(["POST",path,body]);return {id:"created"};}
  async delete(path:string){this.calls.push(["DELETE",path]);return {ok:true};}
}
class FakeMcp { async callIfAllowed(){return {handled:false};} }

test("registers exactly 12 stable tools",()=>{assert.equal(tools.length,12);assert.equal(new Set(tools.map(t=>t.name)).size,12);});
test("read project list bounds pagination",async()=>{const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp() as any);await r.execute("neon.project.list",{limit:25});assert.match(api.calls[0][1],/limit=25/);});
test("invalid resource id is rejected",async()=>{const r=new ToolRouter(new FakeApi() as any,new FakeMcp() as any);await assert.rejects(()=>r.execute("neon.project.get",{projectId:"../../etc"}),ValidationError);});
test("write approval is denied without grant",()=>{process.env.NEON_REQUIRE_WRITE_APPROVAL="true";delete process.env.NEON_APPROVAL_TOKEN;assert.throws(()=>requireApproval("WRITE"),ApprovalError);});
test("branch create maps to documented endpoint",async()=>{process.env.NEON_REQUIRE_WRITE_APPROVAL="false";const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp() as any);await r.execute("neon.branch.create",{projectId:"proj-abc",name:"feature"});assert.equal(api.calls[0][1],"/projects/proj-abc/branches");assert.equal(api.calls[0][2].branch.name,"feature");});
test("destructive branch delete disabled by default",async()=>{process.env.NEON_ENABLE_DESTRUCTIVE="false";process.env.NEON_APPROVAL_TOKEN="grant";const r=new ToolRouter(new FakeApi() as any,new FakeMcp() as any);await assert.rejects(()=>r.execute("neon.branch.delete",{projectId:"proj-abc",branchId:"br-abc",approvalId:"grant"}),ApprovalError);});
