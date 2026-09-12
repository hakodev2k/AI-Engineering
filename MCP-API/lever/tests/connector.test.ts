import test from "node:test";
import assert from "node:assert/strict";
import { LeverClient, LeverError } from "../src/client.js";
import { execute, SPECS } from "../src/tools.js";
import type { Config } from "../src/config.js";

const config: Config = { apiKey:"secret", baseUrl:"https://api.lever.co/v1", timeoutMs:1000, maxRetries:0, allowWrites:false, allowHighRisk:false, allowConfidential:false };

test("registers meaningful unique tools",()=>{ assert.equal(SPECS.length,14); assert.equal(new Set(SPECS.map(x=>x.name)).size,SPECS.length); });
test("read call uses Basic auth without leaking token in URL",async()=>{
  let seen=""; const fetcher:any=async(url:URL,init:any)=>{ seen=String(url); assert.match(init.headers.Authorization,/^Basic /); assert.ok(!String(url).includes("secret")); return new Response(JSON.stringify({data:[]}),{status:200,headers:{"content-type":"application/json"}}); };
  const client=new LeverClient(config,fetcher); await client.request("GET","/postings",{limit:10}); assert.match(seen,/postings/);
});
test("write denied by default",async()=>{ const spec=SPECS.find(x=>x.name==="lever.opportunity.stage.update")!; await assert.rejects(()=>execute(spec,{id:"o",stage:"s",approval:"approved"},{} as any,config),/disabled/); });
test("confidential read denied by default",async()=>{ const spec=SPECS.find(x=>x.name==="lever.opportunity.read")!; await assert.rejects(()=>execute(spec,{id:"o"},{} as any,config),/confidential/); });
test("429 exposes retry-after",async()=>{ const client=new LeverClient(config,async()=>new Response("slow",{status:429,headers:{"retry-after":"3"}})); await assert.rejects(()=>client.request("GET","/postings"),e=>e instanceof LeverError && e.status===429 && e.retryAfter===3); });
test("pagination parameters are forwarded",async()=>{ let url=""; const client=new LeverClient(config,async(u)=>{url=String(u);return new Response("{}",{status:200});}); await client.request("GET","/postings",{limit:25,offset:"abc"}); assert.match(url,/limit=25/); assert.match(url,/offset=abc/); });
