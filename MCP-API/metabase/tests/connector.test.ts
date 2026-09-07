import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { MetabaseClient, MetabaseError } from '../src/client.js';
import { enforce } from '../src/policy.js';
import { createTools } from '../src/tools.js';

const cfg=loadConfig({METABASE_BASE_URL:'https://metabase.example.com',METABASE_API_KEY:'mb_key_1234567890123456',METABASE_TIMEOUT_MS:'2000',METABASE_MAX_RETRIES:'1',METABASE_REQUIRE_WRITE_APPROVAL:'true'} as NodeJS.ProcessEnv);

test('config rejects non-http URL',()=>assert.throws(()=>loadConfig({METABASE_BASE_URL:'file:///tmp/x',METABASE_API_KEY:'mb_key_1234567890123456'} as NodeJS.ProcessEnv)));
test('write policy requires approval',()=>assert.throws(()=>enforce('WRITE',{allowWrite:true},true),/approval_required/));
test('write policy permits explicitly approved write',()=>assert.doesNotThrow(()=>enforce('WRITE',{allowWrite:true,approved:true},true)));
test('destructive operations remain disabled',()=>assert.throws(()=>enforce('DESTRUCTIVE',{allowWrite:true,approved:true},true),/disabled/));

test('client sends isolated API key header and parses JSON',async()=>{
 let seen='';
 const fake=(async(_u:any,init:any)=>{seen=init.headers['X-API-Key'];return new Response(JSON.stringify({id:1}),{status:200,headers:{'content-type':'application/json'}});}) as typeof fetch;
 const c=new MetabaseClient(cfg,fake); const out=await c.request<any>('GET','/api/card/1');
 assert.equal(seen,cfg.METABASE_API_KEY); assert.equal(out.id,1);
});

test('client maps non-retriable provider error',async()=>{
 const fake=(async()=>new Response(JSON.stringify({message:'Forbidden'}),{status:403})) as typeof fetch;
 await assert.rejects(()=>new MetabaseClient(cfg,fake).request('GET','/api/card/1'),(e:any)=>e instanceof MetabaseError&&e.status===403);
});

test('client retries bounded GET throttling and honors eventual success',async()=>{
 let calls=0; const fake=(async()=>{calls++;return calls===1?new Response('{"message":"slow"}',{status:429,headers:{'retry-after':'0'}}):new Response('{"ok":true}',{status:200});}) as typeof fetch;
 const out=await new MetabaseClient(cfg,fake).request<any>('GET','/api/search?q=x'); assert.equal(out.ok,true); assert.equal(calls,2);
});

test('tool set is stable and validates inputs',async()=>{
 const fakeClient={request:async()=>({ok:true})} as unknown as MetabaseClient;
 const tools=createTools(fakeClient,cfg); assert.equal(tools.length,12); assert.ok(tools.some(t=>t.name==='metabase.agent.search'));
 const t=tools.find(t=>t.name==='metabase.collection.get')!;
 await assert.rejects(()=>t.run({collection_id:-1},{allowWrite:true}),/greater than 0/i);
});

test('write tool blocks missing approval',async()=>{
 const fakeClient={request:async()=>({id:2})} as unknown as MetabaseClient;
 const t=createTools(fakeClient,cfg).find(t=>t.name==='metabase.dashboard.create')!;
 await assert.rejects(()=>t.run({name:'Ops'},{allowWrite:true}),/approval_required/);
});
