import test from "node:test";
import assert from "node:assert/strict";
import { ApprovalError, publicHttpsUrl, requireResearchApproval, ValidationError } from "../src/security.js";
import { ToolRouter, tools } from "../src/tools.js";

class FakeApi {
  calls:any[]=[];
  async get(path:string){this.calls.push(["GET",path]);return {ok:true};}
  async post(path:string,body:any){this.calls.push(["POST",path,body]);return {request_id:"r-12345678",status:"pending"};}
}
class FakeMcp { constructor(private handled=false){} async call(name:string,args:any){ return this.handled ? {handled:true,data:{via:"mcp",name,args}} : {handled:false}; } }

test("registers seven unique tools",()=>{assert.equal(tools.length,7);assert.equal(new Set(tools.map(t=>t.name)).size,7);});
test("rejects localhost and plain HTTP URLs",()=>{assert.throws(()=>publicHttpsUrl("https://127.0.0.1/x"),ValidationError);assert.throws(()=>publicHttpsUrl("http://example.com"),ValidationError);});
test("search falls back to REST",async()=>{const api=new FakeApi();const router=new ToolRouter(api as any,new FakeMcp(false) as any);await router.execute("tavily.web.search",{query:"latest dotnet"});assert.equal(api.calls[0][1],"/search");assert.equal(api.calls[0][2].max_results,5);});
test("search uses official MCP when available",async()=>{const api=new FakeApi();const router=new ToolRouter(api as any,new FakeMcp(true) as any);const r:any=await router.execute("tavily.web.search",{query:"mcp"});assert.equal(r.via,"mcp");assert.equal(api.calls.length,0);});
test("crawl defaults to external links disabled",async()=>{const api=new FakeApi();const router=new ToolRouter(api as any,new FakeMcp(false) as any);await router.execute("tavily.website.crawl",{url:"https://example.com"});assert.equal(api.calls[0][2].allow_external,false);});
test("research creation requires approval by default",async()=>{process.env.TAVILY_REQUIRE_RESEARCH_APPROVAL="true";delete process.env.TAVILY_APPROVAL_TOKEN;assert.throws(()=>requireResearchApproval(),ApprovalError);});
test("approved research request is created without streaming",async()=>{process.env.TAVILY_REQUIRE_RESEARCH_APPROVAL="true";process.env.TAVILY_APPROVAL_TOKEN="grant";const api=new FakeApi();const router=new ToolRouter(api as any,new FakeMcp(false) as any);await router.execute("tavily.research.create",{input:"Compare two database vendors",approvalId:"grant"});assert.equal(api.calls[0][1],"/research");assert.equal(api.calls[0][2].stream,false);});
test("usage is a GET operation",async()=>{const api=new FakeApi();const router=new ToolRouter(api as any,new FakeMcp(false) as any);await router.execute("tavily.usage.get",{});assert.deepEqual(api.calls[0],["GET","/usage"]);});
