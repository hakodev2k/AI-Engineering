import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/auth/config.js';
import { authorize } from '../src/models/policy.js';
import { NovuRestClient, NovuApiError } from '../src/client/rest.js';
import { buildTools } from '../src/tools/registry.js';

test('auth config requires secret key', () => assert.throws(() => loadConfig({} as any), /NOVU_SECRET_KEY/));
test('EU region selects EU endpoints', () => { const c=loadConfig({NOVU_SECRET_KEY:'x',NOVU_REGION:'eu'} as any); assert.equal(c.apiBase,'https://eu.api.novu.co'); assert.equal(c.mcpUrl,'https://eu.mcp.novu.co/'); });
test('write approval is enforced', () => assert.throws(() => authorize('WRITE', false, {requireWriteApproval:true,destructiveEnabled:false}), /APPROVAL_REQUIRED/));
test('high risk approval is enforced', () => assert.throws(() => authorize('HIGH_RISK', undefined, {requireWriteApproval:true,destructiveEnabled:false}), /APPROVAL_REQUIRED/));
test('destructive is disabled by default', () => assert.throws(() => authorize('DESTRUCTIVE', true, {requireWriteApproval:true,destructiveEnabled:false}), /DESTRUCTIVE_DISABLED/));
test('read is approval-free', () => assert.doesNotThrow(() => authorize('READ', undefined, {requireWriteApproval:true,destructiveEnabled:false})));
test('tool registry exposes expected stable tools', () => { const dummy:any={call:async()=>({})}; const tools=buildTools(dummy,dummy); assert.equal(tools.size,15); assert.ok(tools.has('novu.workflow.trigger')); assert.equal(tools.get('novu.workflow.trigger')!.risk,'HIGH_RISK'); assert.equal(tools.get('novu.subscriber.delete')!.risk,'DESTRUCTIVE'); });
test('strict validation rejects extra fields', () => { const dummy:any={call:async()=>({})}; const s=buildTools(dummy,dummy).get('novu.subscriber.get')!.schema; assert.throws(()=>s.parse({subscriberId:'u1',unexpected:true})); });
test('REST sends ApiKey auth without exposing it in URL', async () => { let seen:any; const f=async (url:any,init:any)=>{seen={url:String(url),init};return new Response(JSON.stringify({ok:true}),{status:200});}; const c=new NovuRestClient(loadConfig({NOVU_SECRET_KEY:'secret'} as any),f as any); await c.request('GET','/v2/workflows'); assert.equal(seen.init.headers.Authorization,'ApiKey secret'); assert.equal(seen.url.includes('secret'),false); });
test('REST maps authentication error without retry', async () => { let calls=0; const f=async()=>{calls++;return new Response(JSON.stringify({message:'Unauthorized'}),{status:401});}; const c=new NovuRestClient(loadConfig({NOVU_SECRET_KEY:'bad',NOVU_MAX_RETRIES:'2'} as any),f as any); await assert.rejects(()=>c.request('GET','/v2/workflows'),(e:any)=>e instanceof NovuApiError&&e.status===401); assert.equal(calls,1); });
test('REST retries 429 and preserves success', async () => { let calls=0; const f=async()=>{calls++; return calls===1?new Response('{}',{status:429,headers:{'retry-after':'0'}}):new Response(JSON.stringify({data:[]}),{status:200});}; const c=new NovuRestClient(loadConfig({NOVU_SECRET_KEY:'x',NOVU_MAX_RETRIES:'1'} as any),f as any); assert.deepEqual(await c.request('GET','/v2/workflows'),{data:[]}); assert.equal(calls,2); });
test('destructive REST requests are not blindly retried when caller marks retryable false', async () => { let calls=0; const f=async()=>{calls++;return new Response('{}',{status:503});}; const c=new NovuRestClient(loadConfig({NOVU_SECRET_KEY:'x',NOVU_MAX_RETRIES:'5'} as any),f as any); await assert.rejects(()=>c.request('DELETE','/v2/subscribers/u1',{retryable:false})); assert.equal(calls,1); });
