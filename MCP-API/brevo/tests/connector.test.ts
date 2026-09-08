import test from 'node:test';
import assert from 'node:assert/strict';
import { BrevoClient } from '../src/client.js';
import { assertAllowed, assertPublicHttpsUrl } from '../src/policy.js';
import { invoke, tools } from '../src/tools.js';

const set = (k:string,v?:string) => v === undefined ? delete process.env[k] : process.env[k]=v;

test('client requires credentials',()=>{ const old=process.env.BREVO_API_KEY; set('BREVO_API_KEY'); assert.throws(()=>new BrevoClient(),/BREVO_API_KEY/); set('BREVO_API_KEY',old); });
test('base URL is pinned against SSRF',()=>{ assert.throws(()=>new BrevoClient({apiKey:'x',baseUrl:'https://example.com'}),/must be/); });
test('write/high-risk/destructive are denied by default',()=>{ set('BREVO_ALLOW_WRITE','false'); set('BREVO_ALLOW_HIGH_RISK','false'); set('BREVO_ALLOW_DESTRUCTIVE','false'); assert.throws(()=>assertAllowed('WRITE')); assert.throws(()=>assertAllowed('HIGH_RISK')); assert.throws(()=>assertAllowed('DESTRUCTIVE')); assert.doesNotThrow(()=>assertAllowed('READ')); });
test('host can allow one risk class without escalating others',()=>{ set('BREVO_ALLOW_WRITE','true'); set('BREVO_ALLOW_HIGH_RISK','false'); assert.doesNotThrow(()=>assertAllowed('WRITE')); assert.throws(()=>assertAllowed('HIGH_RISK')); set('BREVO_ALLOW_WRITE','false'); });
test('webhook URL validation blocks private and credential-bearing targets',()=>{ for(const url of ['http://example.com/h','https://localhost/h','https://127.0.0.1/h','https://10.0.0.1/h','https://192.168.1.2/h','https://u:p@example.com/h']) assert.throws(()=>assertPublicHttpsUrl(url)); assert.doesNotThrow(()=>assertPublicHttpsUrl('https://hooks.example.com/brevo')); });
test('tool names are unique and provider scoped',()=>{ const names=tools.map(t=>t.name); assert.equal(new Set(names).size,names.length); assert.ok(names.every(n=>n.startsWith('brevo.'))); assert.ok(names.length>=8); });
test('strict validation rejects unknown arguments before network call',async()=>{ const tool=tools.find(t=>t.name==='brevo.account.get')!; const fake:any={request:async()=>({})}; await assert.rejects(()=>invoke(tool,{unexpected:true},fake),/Unrecognized key/); });
test('write tool enforces approval before provider call',async()=>{ set('BREVO_ALLOW_WRITE','false'); let called=false; const fake:any={request:async()=>{called=true;return {};}}; const tool=tools.find(t=>t.name==='brevo.contact.create')!; await assert.rejects(()=>invoke(tool,{email:'a@example.com',updateEnabled:false},fake),/approval/); assert.equal(called,false); });
test('read tool calls provider with validated pagination',async()=>{ let seen:any; const fake:any={request:async(path:string,opts:any)=>{seen={path,opts};return {contacts:[]};}}; const tool=tools.find(t=>t.name==='brevo.contact.list')!; const out=await invoke(tool,{limit:10,offset:20},fake); assert.deepEqual(out,{contacts:[]}); assert.equal(seen.path,'/contacts'); assert.equal(seen.opts.query.limit,10); });
