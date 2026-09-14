import test from "node:test";
import assert from "node:assert/strict";
import { ToolRouter, tools, ValidationError, ApprovalError } from "../src/tools.js";
import { assertPublicHttpsUrl, requireCostApproval } from "../src/security.js";

class FakeApi {
  calls:any[]=[];
  async get(path:string,params:any){ this.calls.push([path,params]); return {status:200,contentType:"application/json",encoding:"utf8",body:JSON.stringify({ok:true})}; }
}
class FakeMcp {
  constructor(private handled=false){}
  async call(name:string,args:any){ return this.handled ? {handled:true,data:{name,args}} : {handled:false}; }
}

test("registers ten unique tools",()=>{ assert.equal(tools.length,10); assert.equal(new Set(tools.map(t=>t.name)).size,10); });
test("all exposed tools are read-only provider operations",()=>{ assert.deepEqual(new Set(tools.map(t=>t.risk)),new Set(["READ"])); });
test("rejects local, credential-bearing and insecure targets",()=>{
  assert.throws(()=>assertPublicHttpsUrl("http://example.com"),ValidationError);
  assert.throws(()=>assertPublicHttpsUrl("https://127.0.0.1/x"),ValidationError);
  assert.throws(()=>assertPublicHttpsUrl("https://user:pass@example.com/x"),ValidationError);
});
test("accepts public HTTPS targets",()=>{ assert.match(assertPublicHttpsUrl("https://example.com/a"),/^https:/); });
test("premium proxy requires cost approval by default",()=>{
  process.env.SCRAPINGBEE_REQUIRE_COST_APPROVAL="true"; delete process.env.SCRAPINGBEE_COST_APPROVAL_TOKEN;
  assert.throws(()=>requireCostApproval(true,false),ApprovalError);
});
test("page text falls back to REST markdown",async()=>{
  process.env.SCRAPINGBEE_REQUIRE_COST_APPROVAL="false";
  const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp(false) as any);
  await router.execute("scrapingbee.page.text",{url:"https://example.com"});
  assert.equal(api.calls[0][1].return_page_markdown,true);
});
test("web search falls back to Google classic",async()=>{
  const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp(false) as any);
  await router.execute("scrapingbee.search.web",{query:"mcp security"});
  assert.equal(api.calls[0][0],"/google"); assert.equal(api.calls[0][1].search_type,"classic");
});
test("official MCP result is preferred over REST",async()=>{
  const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp(true) as any);
  const result:any=await router.execute("scrapingbee.search.web",{query:"mcp"});
  assert.equal(result.name,"fast_search"); assert.equal(api.calls.length,0);
});
test("extraction rule count and selector shape are validated",async()=>{
  process.env.SCRAPINGBEE_REQUIRE_COST_APPROVAL="false";
  const router=new ToolRouter(new FakeApi() as any,new FakeMcp(false) as any);
  await assert.rejects(()=>router.execute("scrapingbee.page.extract",{url:"https://example.com",rules:{x:""}}),ValidationError);
});
test("usage fails safely when official MCP is unavailable",async()=>{
  const router=new ToolRouter(new FakeApi() as any,new FakeMcp(false) as any);
  await assert.rejects(()=>router.execute("scrapingbee.account.usage",{}),/MCP usage tool is unavailable/);
});
