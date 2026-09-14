import test from "node:test";
import assert from "node:assert/strict";
import { ApprovalError, limit, ValidationError } from "../src/security.js";
import { ToolRouter, tools } from "../src/tools.js";

class FakeApi{calls:any[]=[];async get(p:string){this.calls.push(["GET",p]);return{data:[]};}async post(p:string,b:any){this.calls.push(["POST",p,b]);return{data:{id:"x"}};}}
class FakeMcp{constructor(private handled=false){}async call(n:string,a:any){return this.handled?{handled:true,data:{via:"mcp",n,a}}:{handled:false};}}
test("registers 13 unique stable tools",()=>{assert.equal(tools.length,13);assert.equal(new Set(tools.map(t=>t.name)).size,13);});
test("bounds pagination",()=>{assert.equal(limit(undefined),20);assert.throws(()=>limit(101),ValidationError);});
test("read falls back to REST when MCP is unavailable",async()=>{const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp(false) as any);await r.execute("inngest.app.list",{limit:25});assert.match(api.calls[0][1],/^\/apps\?/);});
test("read prefers official MCP when available",async()=>{const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp(true) as any);const out=await r.execute("inngest.account.get",{});assert.equal(out.via,"mcp");assert.equal(api.calls.length,0);});
test("high risk actions require explicit approval",async()=>{delete process.env.INNGEST_APPROVAL_TOKEN;const r=new ToolRouter(new FakeApi() as any,new FakeMcp(false) as any);await assert.rejects(()=>r.execute("inngest.event.send",{name:"test/event"}),ApprovalError);});
test("send event uses bounded REST fallback",async()=>{process.env.INNGEST_APPROVAL_TOKEN="grant";const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp(false) as any);await r.execute("inngest.event.send",{name:"test/event",data:{id:1},approvalId:"grant"});assert.deepEqual(api.calls[0],["POST","/events",{name:"test/event",data:{id:1},user:{}}]);});
test("cancel posts an empty body and is approval gated",async()=>{process.env.INNGEST_APPROVAL_TOKEN="grant";const api=new FakeApi();const r=new ToolRouter(api as any,new FakeMcp(false) as any);await r.execute("inngest.run.cancel",{runId:"01ABC",approvalId:"grant"});assert.deepEqual(api.calls[0],["POST","/runs/01ABC/cancel",{}]);});
test("invalid identifiers fail locally",async()=>{const r=new ToolRouter(new FakeApi() as any,new FakeMcp(false) as any);await assert.rejects(()=>r.execute("inngest.app.get",{appId:"bad id with spaces"}),ValidationError);});
