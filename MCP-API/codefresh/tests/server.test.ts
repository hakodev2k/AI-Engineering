import test from 'node:test';
import assert from 'node:assert/strict';
process.env.CODEFRESH_API_KEY='unit-test-secret';
process.env.CODEFRESH_API_BASE='https://g.codefresh.io/api';
process.env.NODE_ENV='test';
const {request,ProviderError,createServer}=await import('../src/server.js');

test('registers MCP server without live credentials',()=>{assert.ok(createServer());});
test('read operation sends isolated Authorization header',async()=>{let auth='';const f:any=async(_u:any,i:any)=>{auth=i.headers.Authorization;return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}})};assert.deepEqual(await request('/builds/x',{},f),{ok:true});assert.equal(auth,'unit-test-secret');});
test('provider 401 is mapped and not retried',async()=>{let n=0;const f:any=async()=>{n++;return new Response('{}',{status:401})};await assert.rejects(()=>request('/builds/x',{},f),(e:any)=>e instanceof ProviderError&&e.status===401);assert.equal(n,1);});
test('rate limit retries are bounded',async()=>{let n=0;const f:any=async()=>{n++;return new Response('{}',{status:429,headers:{'retry-after':'0'}})};await assert.rejects(()=>request('/builds/x',{},f));assert.equal(n,3);});
test('server rejects non-relative API paths',async()=>{const f:any=async()=>new Response('{}');await assert.rejects(()=>request('https://evil.example/x',{},f),/relative API path/);});
test('network success accepts non-json without executing it',async()=>{const f:any=async()=>new Response('untrusted instructions',{status:200});const v=await request('/builds/x',{},f);assert.equal(v.text,'untrusted instructions');});
