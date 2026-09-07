import test from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS, TOOL_MAP } from '../src/tools.js';
import { createRuntime } from '../src/server.js';

const config={apiToken:'x',apiBaseUrl:'https://coda.io/apis/v1',mcpUrl:'https://coda.io/apis/mcp',timeoutMs:100,maxRetries:0,allowWrites:false,allowHighRisk:false};

test('registers meaningful stable provider-scoped tools', () => {
  assert.ok(TOOLS.length>=15 && TOOLS.length<=20);
  assert.ok(TOOLS.every(t=>t.name.startsWith('coda.')));
  assert.equal(new Set(TOOLS.map(t=>t.name)).size,TOOLS.length);
});

test('strict validation rejects unknown fields and unsafe IDs', () => {
  assert.throws(()=>TOOL_MAP.get('coda.doc.get').validate({docId:'abc',extra:true}),/Unknown/);
  assert.throws(()=>TOOL_MAP.get('coda.doc.get').validate({docId:'../etc'}),/unsupported/);
  assert.throws(()=>TOOL_MAP.get('coda.row.upsert').validate({docId:'d',tableIdOrName:'t',cells:[],approvalToken:'1234567890123456'}),/cells/);
});

test('MCP runtime exposes tools and blocks writes by default', async () => {
  const handle=createRuntime(config,async()=>new Response('{}',{status:200}));
  const listed=await handle({jsonrpc:'2.0',id:1,method:'tools/list',params:{}});
  assert.equal(listed.result.tools.length,TOOLS.length);
  const denied=await handle({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'coda.doc.create',arguments:{title:'New',approvalToken:'1234567890123456'}}});
  assert.equal(denied.result.isError,true); assert.match(denied.result.content[0].text,/disabled/);
});


test('enum validation and page mutation validation are enforced', () => {
  assert.throws(()=>TOOL_MAP.get('coda.row.list').validate({docId:'d',tableIdOrName:'t',sortBy:'bogus'}),/one of/);
  assert.throws(()=>TOOL_MAP.get('coda.page.update').validate({docId:'d',pageIdOrName:'p',approvalToken:'1234567890123456'}),/requires at least one/);
  assert.doesNotThrow(()=>TOOL_MAP.get('coda.page.update').validate({docId:'d',pageIdOrName:'p',html:'<p>Updated</p>',insertionMode:'append',approvalToken:'1234567890123456'}));
});

test('approved write uses deterministic REST body and never retries mutation', async () => {
  const calls=[];
  const writeConfig={...config,allowWrites:true,approvalToken:'abcdefghijklmnop'};
  const handle=createRuntime(writeConfig,async (url,init)=>{ calls.push({url:String(url),init}); return new Response(JSON.stringify({id:'d1'}),{status:201,headers:{'content-type':'application/json'}}); });
  const response=await handle({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'coda.doc.create',arguments:{title:'Agent Notes',approvalToken:'abcdefghijklmnop'}}});
  assert.equal(response.result.isError,undefined);
  assert.equal(calls.length,1);
  assert.equal(calls[0].init.method,'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body),{title:'Agent Notes'});
  assert.ok(!calls[0].init.body.includes('abcdefghijklmnop'));
});
