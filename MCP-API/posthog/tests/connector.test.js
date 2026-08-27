import test from 'node:test';
import assert from 'node:assert/strict';
import { approvalDigest } from '../src/config.js';
import { authorize, POLICY } from '../src/policy.js';
import { TOOLS } from '../src/tools.js';
import { PostHogClient, PostHogError } from '../src/client.js';

test('tool registry matches policy',()=>{assert.deepEqual(TOOLS.map(x=>x.name).sort(),Object.keys(POLICY).sort());assert.equal(TOOLS.length,12);});
test('write approval is payload bound',()=>{const c={approvalSecret:'s',destructiveEnabled:false};const t='posthog.feature_flag.create';const p={key:'x',name:'X'};const token=approvalDigest(c.approvalSecret,t,p);assert.doesNotThrow(()=>authorize(c,t,p,token));assert.throws(()=>authorize(c,t,{...p,key:'y'},token),/Invalid/);});
test('delete disabled by default',()=>{assert.throws(()=>authorize({approvalSecret:'s',destructiveEnabled:false},'posthog.feature_flag.delete',{id:1},'0'.repeat(64)),/disabled/);});
test('client authenticates and reads',async()=>{let seen;const f=async(u,i)=>{seen=i;return new Response(JSON.stringify({id:1}),{status:200});};const c=new PostHogClient({baseUrl:'https://us.posthog.com',apiKey:'phx_x',projectId:'1',timeoutMs:1000,maxRetries:0},f);assert.equal((await c.dashboard(1)).id,1);assert.equal(seen.headers.Authorization,'Bearer phx_x');});
test('auth failure is not retried',async()=>{let n=0;const f=async()=>{n++;return new Response(JSON.stringify({detail:'bad',code:'invalid_personal_api_key'}),{status:401});};const c=new PostHogClient({baseUrl:'https://us.posthog.com',apiKey:'bad',projectId:'1',timeoutMs:1000,maxRetries:3},f);await assert.rejects(c.dashboard(1),e=>e instanceof PostHogError&&e.status===401);assert.equal(n,1);});
test('safe GET retries 429',async()=>{let n=0;const f=async()=>{n++;return n===1?new Response(JSON.stringify({detail:'slow'}),{status:429,headers:{'retry-after':'0'}}):new Response(JSON.stringify({results:[]}),{status:200});};const c=new PostHogClient({baseUrl:'https://us.posthog.com',apiKey:'x',projectId:'1',timeoutMs:1000,maxRetries:1},f);await c.flags({limit:20,offset:0});assert.equal(n,2);});
test('writes are not blindly retried',async()=>{let n=0;const f=async()=>{n++;return new Response(JSON.stringify({detail:'temporary'}),{status:503});};const c=new PostHogClient({baseUrl:'https://us.posthog.com',apiKey:'x',projectId:'1',timeoutMs:1000,maxRetries:3},f);await assert.rejects(c.createFlag({key:'x',name:'X'}));assert.equal(n,1);});
