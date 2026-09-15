import test from 'node:test';import assert from 'node:assert/strict';import {config,approve,NamecheapClient} from '../src/core.js';import {createHmac} from 'node:crypto';
const env={NAMECHEAP_API_USER:'u',NAMECHEAP_API_KEY:'k',NAMECHEAP_USERNAME:'u',NAMECHEAP_CLIENT_IP:'127.0.0.1'} as any;
test('requires credentials',()=>assert.throws(()=>config({} as any)));
test('requires ipv4',()=>assert.throws(()=>config({...env,NAMECHEAP_CLIENT_IP:'::1'})));
test('high risk default denied',()=>assert.throws(()=>approve(config(env),'x',{})));
test('approval bound to payload',()=>{const c=config({...env,NAMECHEAP_ENABLE_HIGH_RISK:'true',NAMECHEAP_APPROVAL_SECRET:'s'});const p={domain:'example.com'};const token=createHmac('sha256','s').update('x\n{"domain":"example.com"}').digest('hex');assert.doesNotThrow(()=>approve(c,'x',{...p,approval_token:token}));assert.throws(()=>approve(c,'x',{domain:'other.com',approval_token:token}))});
test('credential stays in transport query',async()=>{let url='';const f=async(u:any)=>{url=String(u);return new Response('<ApiResponse Status="OK"><Errors/></ApiResponse>',{status:200})};await new NamecheapClient(config(env),f as any).call('namecheap.domains.getList');assert.match(url,/ApiKey=k/)});
test('write-style call can disable retries',async()=>{let n=0;const f=async()=>{n++;return new Response('x',{status:503})};await assert.rejects(()=>new NamecheapClient(config({...env,NAMECHEAP_MAX_RETRIES:'4'}),f as any).call('x',{},false));assert.equal(n,1)});
