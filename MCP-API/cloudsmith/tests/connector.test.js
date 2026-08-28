import test from "node:test";
import assert from "node:assert/strict";
import { approvalDigest, loadConfig } from "../src/config.js";
import { assertAuthorized, TOOL_POLICY } from "../src/policy.js";
import { TOOL_DEFINITIONS } from "../src/tools.js";
import { CloudsmithClient, CloudsmithError } from "../src/client.js";

test("tool registry matches policy",()=>{
  const names=TOOL_DEFINITIONS.map(t=>t.name).sort();
  assert.deepEqual(names,Object.keys(TOOL_POLICY).sort());
  assert.equal(names.length,12);
});

test("configuration requires API key",()=>{
  const old=process.env.CLOUDSMITH_API_KEY;
  delete process.env.CLOUDSMITH_API_KEY;
  try { assert.throws(loadConfig,/CLOUDSMITH_API_KEY/); }
  finally { if(old===undefined) delete process.env.CLOUDSMITH_API_KEY; else process.env.CLOUDSMITH_API_KEY=old; }
});

test("write approval is payload-bound",()=>{
  const config={approvalSecret:"approve",enableDestructive:false};
  const tool="cloudsmith.package.copy";
  const payload={owner:"acme",repo:"dev",identifier:"abc",destination:"prod",republish:false};
  const token=approvalDigest(config.approvalSecret,tool,payload);
  assert.doesNotThrow(()=>assertAuthorized(config,tool,payload,token));
  assert.throws(()=>assertAuthorized(config,tool,{...payload,destination:"other"},token),/Invalid approval/);
});

test("delete is disabled by default",()=>{
  const config={approvalSecret:"approve",enableDestructive:false};
  assert.throws(()=>assertAuthorized(config,"cloudsmith.package.delete",{owner:"a",repo:"b",identifier:"c"},"x"),/disabled/);
});

test("read request uses token auth and returns pagination/rate metadata",async()=>{
  let captured;
  const fakeFetch=async(url,init)=>{
    captured={url:String(url),init};
    return new Response(JSON.stringify([{slug:"repo"}]),{status:200,headers:{
      "x-pagination-page":"1","x-pagination-pagetotal":"2","x-ratelimit-remaining":"49999"
    }});
  };
  const client=new CloudsmithClient({baseUrl:"https://api.cloudsmith.io",apiKey:"secret",timeoutMs:1000,maxRetries:0},fakeFetch);
  const result=await client.listRepositories({owner:"acme",page:1,pageSize:20});
  assert.equal(captured.init.headers.Authorization,"token secret");
  assert.equal(result.pagination.page,"1");
  assert.equal(result.rateLimit.remaining,"49999");
});

test("429 is retried for safe reads",async()=>{
  let calls=0;
  const fakeFetch=async()=>{
    calls++;
    if(calls===1) return new Response(JSON.stringify({detail:"throttled"}),{status:429,headers:{"retry-after":"0"}});
    return new Response(JSON.stringify([]),{status:200});
  };
  const client=new CloudsmithClient({baseUrl:"https://api.cloudsmith.io",apiKey:"secret",timeoutMs:1000,maxRetries:1},fakeFetch);
  await client.listNamespaces({page:1,pageSize:20});
  assert.equal(calls,2);
});

test("mutations are not blindly retried",async()=>{
  let calls=0;
  const fakeFetch=async()=>{ calls++; return new Response(JSON.stringify({detail:"temporary"}),{status:503}); };
  const client=new CloudsmithClient({baseUrl:"https://api.cloudsmith.io",apiKey:"secret",timeoutMs:1000,maxRetries:3},fakeFetch);
  await assert.rejects(client.copy({owner:"a",repo:"b",identifier:"c",destination:"d"}),CloudsmithError);
  assert.equal(calls,1);
});
