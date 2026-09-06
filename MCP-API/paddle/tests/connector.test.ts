import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { loadConfig, type PaddleConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { PaddleApiError, PaddleClient } from "../src/client.js";
import { TOOLS, TOOL_MAP } from "../src/tools.js";
import { verifyPaddleWebhook } from "../src/webhooks.js";

const base: PaddleConfig={apiKey:"secret",environment:"sandbox",baseUrl:"https://sandbox-api.paddle.com",permissions:new Set(["read","write","high_risk","destructive"]),requireWriteApproval:true,enableDestructive:false,timeoutMs:1000,maxRetries:2};
const response=(body:unknown,status=200,headers:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json",...headers}});

test("safe config defaults and auth environment validation",()=>{
  const c=loadConfig({PADDLE_API_KEY:"pdl_sdbx_test",PADDLE_ENVIRONMENT:"sandbox"});
  assert.deepEqual([...c.permissions],["read"]);
  assert.equal(c.requireWriteApproval,true);
  assert.equal(c.enableDestructive,false);
  assert.throws(()=>loadConfig({PADDLE_API_KEY:"pdl_live_test",PADDLE_ENVIRONMENT:"sandbox"}),/cannot be used/);
  assert.throws(()=>loadConfig({PADDLE_API_KEY:"pdl_sdbx_test",PADDLE_ENVIRONMENT:"sandbox",PADDLE_PERMISSIONS:"read,admin"}),/Unknown permission/);
});

test("policy gates writes, high risk, and destructive operations",()=>{
  assert.doesNotThrow(()=>assertAllowed("READ","x",{},base));
  assert.throws(()=>assertAllowed("WRITE","x",{},base),/APPROVE_WRITE/);
  assert.throws(()=>assertAllowed("HIGH_RISK","x",{},base),/APPROVE_HIGH_RISK/);
  assert.throws(()=>assertAllowed("DESTRUCTIVE","x",{approval:"APPROVE_DESTRUCTIVE"},base),/disabled/);
  assert.doesNotThrow(()=>assertAllowed("DESTRUCTIVE","x",{approval:"APPROVE_DESTRUCTIVE"},{...base,enableDestructive:true}));
});

test("client keeps bearer credential inside connector and uses official host",async()=>{
  let auth="",host="";
  const fake:typeof fetch=async(input,init)=>{auth=new Headers(init?.headers).get("authorization")||"";host=new URL(String(input)).host;return response({data:{id:"pro_x"}})};
  await new PaddleClient(base,fake).request("GET","/products/pro_x");
  assert.equal(auth,"Bearer secret");
  assert.equal(host,"sandbox-api.paddle.com");
});

test("bounded read retry honors Retry-After",async()=>{
  let calls=0;const sleeps:number[]=[];
  const fake:typeof fetch=async()=>{calls++;return calls===1?response({error:{detail:"slow"}},429,{"retry-after":"1"}):response({data:[]})};
  await new PaddleClient(base,fake,async ms=>{sleeps.push(ms)}).request("GET","/products");
  assert.equal(calls,2);assert.deepEqual(sleeps,[1000]);
});

test("writes are never automatically retried",async()=>{
  let calls=0;const fake:typeof fetch=async()=>{calls++;return response({error:{detail:"busy"}},503)};
  await assert.rejects(()=>new PaddleClient(base,fake,async()=>{}).request("POST","/products",{body:{}}),PaddleApiError);
  assert.equal(calls,1);
});

test("cursor pagination is bounded and aggregates pages",async()=>{
  let calls=0;
  const fake:typeof fetch=async()=>{calls++;return calls===1?response({data:[1],meta:{request_id:"a",pagination:{has_more:true,next:"https://sandbox-api.paddle.com/products?after=pro_x"}}}):response({data:[2],meta:{request_id:"b",pagination:{has_more:false,next:"https://sandbox-api.paddle.com/products?after=pro_y"}}})};
  const out=await new PaddleClient({...base,maxRetries:0},fake).list<number>("/products",{per_page:10},2);
  assert.deepEqual(out.data,[1,2]);assert.equal(out.pages,2);assert.equal(out.hasMore,false);
});

test("pagination refuses an unexpected host",async()=>{
  const fake:typeof fetch=async()=>response({data:[1],meta:{pagination:{has_more:true,next:"https://evil.example/products?after=x"}}});
  await assert.rejects(()=>new PaddleClient({...base,maxRetries:0},fake).list("/products",{per_page:10},2),/unexpected host/);
});

test("registers exactly 20 scoped tools with strict schemas and metadata",()=>{
  assert.equal(TOOLS.length,20);assert.equal(TOOL_MAP.size,20);
  for(const t of TOOLS){assert.match(t.name,/^paddle\.[a-z_]+\.[a-z_]+$/);assert.ok(t.purpose&&t.permission&&t.risk&&t.approval&&t.output&&t.errors);assert.equal(t.inputSchema.additionalProperties,false);}
});

test("validation rejects ambiguous customer and partial adjustment inputs",()=>{
  assert.throws(()=>TOOL_MAP.get("paddle.customer.create")!.schema.parse({email:"bad",surprise:true,approval:"APPROVE_WRITE"}));
  assert.throws(()=>TOOL_MAP.get("paddle.adjustment.create")!.schema.parse({action:"refund",transactionId:"txn_01abcdefghijklmnopqrstuv",reason:"duplicate",items:[{itemId:"txnitm_01abcdefghijklmnopqrstuv",type:"partial"}],approval:"APPROVE_HIGH_RISK"}));
});

test("webhook verifier uses HMAC SHA256 over timestamp:rawBody with replay tolerance",()=>{
  const ts=1_700_000_000,body='{"event_id":"evt_x"}',secret="whsec";
  const sig=createHmac("sha256",secret).update(`${ts}:${body}`).digest("hex");
  assert.equal(verifyPaddleWebhook(body,`ts=${ts};h1=${sig}`,secret,5,ts),true);
  assert.equal(verifyPaddleWebhook(body,`ts=${ts};h1=${sig}`,secret,5,ts+6),false);
});
