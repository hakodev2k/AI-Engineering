import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, approvalDigest } from '../src/auth/config.js';
import { authorize, TOOL_POLICY } from '../src/tools/policy.js';
import { TOOL_DEFINITIONS } from '../src/tools/definitions.js';
import { SanityTransportRouter } from '../src/client/router.js';
import { SanityRestFallback } from '../src/client/sanity-rest.js';

test('tool registry and policies remain synchronized',()=>{
  assert.deepEqual(TOOL_DEFINITIONS.map(t=>t.name).sort(),Object.keys(TOOL_POLICY).sort());
  assert.equal(TOOL_DEFINITIONS.length,10);
});
test('configuration rejects insecure MCP URL',()=>{
  assert.throws(()=>loadConfig({SANITY_PROJECT_ID:'abc',SANITY_DATASET:'production',SANITY_API_TOKEN:'x',SANITY_MCP_URL:'http://mcp.example.com'}),/HTTPS/);
});
test('read tools need no approval',()=>assert.doesNotThrow(()=>authorize({approvalSecret:'',destructiveEnabled:false},'sanity.content.query',{query:'*[]'})));
test('write approval is bound to exact payload',()=>{
  const config={approvalSecret:'secret',destructiveEnabled:false},tool='sanity.document.publish',payload={documentIds:['drafts.a']};
  const token=approvalDigest(config.approvalSecret,tool,payload);
  assert.doesNotThrow(()=>authorize(config,tool,payload,token));
  assert.throws(()=>authorize(config,tool,{documentIds:['drafts.b']},token),/Invalid approval/);
});
test('destructive tools are disabled by default',()=>assert.throws(()=>authorize({approvalSecret:'x',destructiveEnabled:false},'sanity.document.discard_draft',{documentIds:['drafts.a']},'0'.repeat(64)),/disabled/));
test('read prefers official MCP',async()=>{
  const mcp={call:async(name,args)=>({name,args,transport:'mcp'})},rest={query:async()=>({transport:'rest'})};
  const router=new SanityTransportRouter({projectId:'p',dataset:'d',mcpEnabled:true},mcp,rest);
  const result=await router.query({query:'*[]'}); assert.equal(result.transport,'mcp'); assert.equal(result.args.projectId,'p');
});
test('read falls back to official SDK when MCP fails',async()=>{
  const mcp={call:async()=>{throw new Error('mcp down')}},rest={query:async()=>({transport:'rest'})};
  const router=new SanityTransportRouter({projectId:'p',dataset:'d',mcpEnabled:true},mcp,rest);
  assert.equal((await router.query({query:'*[]'})).transport,'rest');
});
test('writes never silently fall back',async()=>{
  const router=new SanityTransportRouter({projectId:'p',dataset:'d',mcpEnabled:true},{call:async()=>{throw new Error('mcp down')}},{});
  await assert.rejects(router.write('publish_documents',{documentIds:['a']}),/mcp down/);
});
test('SDK fallback uses read-only GROQ fetch',async()=>{
  const fake={fetch:async(q,p,o)=>({q,p,o}),getDocument:async id=>({_id:id})};
  const client=new SanityRestFallback({},fake);
  const result=await client.query({query:'*[_type==$t]',params:{t:'post'},perspective:'published'});
  assert.equal(result.o.perspective,'published');
});
