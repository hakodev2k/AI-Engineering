import test from 'node:test';
import assert from 'node:assert/strict';
import { TemporalCloudClient, TemporalCloudError } from '../src/client.js';
import { loadConfig } from '../src/config.js';
import { executeTool, toolDefinitions } from '../src/tools.js';

const cfg=loadConfig({TEMPORAL_CLOUD_API_KEY:'secret'});

test('tool names are unique and provider scoped',()=>{
  const names=toolDefinitions.map(t=>t.name);
  assert.equal(new Set(names).size,names.length);
  assert.ok(names.every(n=>n.startsWith('temporal_cloud.')));
});

test('client injects bearer credential and reads account',async()=>{
  let seen;
  const f=async(url,init)=>{seen={url:String(url),init};return new Response(JSON.stringify({account:{id:'a1'}}),{status:200,headers:{'content-type':'application/json'}})};
  const c=new TemporalCloudClient(cfg,f);
  const r=await c.request('GET','/cloud/account');
  assert.equal(r.account.id,'a1');
  assert.equal(seen.init.headers.Authorization,'Bearer secret');
  assert.ok(seen.url.startsWith('https://saas-api.tmprl.cloud/cloud/account'));
});

test('auth errors are not retried',async()=>{
  let calls=0; const f=async()=>{calls++;return new Response('{"message":"no"}',{status:401})};
  const c=new TemporalCloudClient(cfg,f);
  await assert.rejects(()=>c.request('GET','/cloud/account'),e=>e instanceof TemporalCloudError&&e.status===401);
  assert.equal(calls,1);
});

test('writes are single attempt',async()=>{
  let calls=0; const f=async()=>{calls++;return new Response('{"message":"busy"}',{status:503})};
  const c=new TemporalCloudClient(cfg,f);
  await assert.rejects(()=>c.request('POST','/cloud/namespaces',{body:{},retryable:false}));
  assert.equal(calls,1);
});

test('destructive namespace delete denied by default before provider call',async()=>{
  let calls=0; const c={request:async()=>{calls++;}};
  await assert.rejects(()=>executeTool(cfg,c,'temporal_cloud.namespace.delete',{namespace:'orders',resourceVersion:'1',confirmation:'DELETE TEMPORAL NAMESPACE orders',approvalToken:'0'.repeat(64)}),/disabled/);
  assert.equal(calls,0);
});
