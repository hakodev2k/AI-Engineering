import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, approvalDigest } from '../src/auth/config.js';
import { authorize, TOOL_POLICY } from '../src/tools/policy.js';
import { TOOL_DEFINITIONS } from '../src/tools/definitions.js';
import { BrevoClient, BrevoError } from '../src/client/brevo-client.js';
import { sanitize } from '../src/models/sanitize.js';

test('tool registry matches policy', () => { const names=TOOL_DEFINITIONS.map(x=>x.name); assert.equal(names.length,14); assert.deepEqual([...names].sort(),Object.keys(TOOL_POLICY).sort()); });
test('config requires key and HTTPS', () => { assert.throws(()=>loadConfig({}),/BREVO_API_KEY/); assert.throws(()=>loadConfig({BREVO_API_KEY:'x',BREVO_API_URL:'http://api.brevo.com'}),/HTTPS/); });
test('approval is bound to exact payload', () => { const c={approvalSecret:'s',destructiveEnabled:false}, tool='brevo.campaign.send', p={campaignId:7}; const t=approvalDigest(c.approvalSecret,tool,p); assert.doesNotThrow(()=>authorize(c,tool,p,t)); assert.throws(()=>authorize(c,tool,{campaignId:8},t),/Invalid/); });
test('destructive webhook deletion is disabled by default', () => { assert.throws(()=>authorize({approvalSecret:'s',destructiveEnabled:false},'brevo.webhook.delete',{webhookId:1},'0'.repeat(64)),/disabled/); });
test('sanitizer redacts secret-shaped keys', () => { const out=sanitize({apiKey:'x',nested:{access_token:'y'},ok:1}); assert.equal(out.apiKey,'[REDACTED]'); assert.equal(out.nested.access_token,'[REDACTED]'); assert.equal(out.ok,1); });
test('client authenticates with api-key header', async () => { let seen; const f=async(url,init)=>{seen={url:String(url),init}; return new Response(JSON.stringify({plan:[{type:'free'}]}),{status:200});}; const c=new BrevoClient({baseUrl:'https://api.brevo.com',apiKey:'secret',timeoutMs:1000,maxRetries:0},f); await c.getAccount(); assert.equal(seen.init.headers['api-key'],'secret'); assert.equal(seen.url,'https://api.brevo.com/v3/account'); });
test('safe reads retry 429 but auth errors do not', async () => { let calls=0; const f=async()=>{calls++; if(calls===1)return new Response(JSON.stringify({message:'slow'}),{status:429,headers:{'retry-after':'0'}}); return new Response(JSON.stringify({contacts:[],count:0}),{status:200});}; const c=new BrevoClient({baseUrl:'https://api.brevo.com',apiKey:'x',timeoutMs:1000,maxRetries:1},f); await c.listContacts({limit:10}); assert.equal(calls,2); let authCalls=0; const bad=async()=>{authCalls++;return new Response(JSON.stringify({message:'Key not found'}),{status:401});}; const c2=new BrevoClient({baseUrl:'https://api.brevo.com',apiKey:'bad',timeoutMs:1000,maxRetries:3},bad); await assert.rejects(c2.getAccount(),e=>e instanceof BrevoError&&e.status===401); assert.equal(authCalls,1); });
test('mutations are never blindly retried', async () => { let calls=0; const f=async()=>{calls++; return new Response(JSON.stringify({message:'temporary'}),{status:503});}; const c=new BrevoClient({baseUrl:'https://api.brevo.com',apiKey:'x',timeoutMs:1000,maxRetries:3},f); await assert.rejects(c.sendCampaign({campaignId:1})); assert.equal(calls,1); });
