import test from 'node:test';
import assert from 'node:assert/strict';
import {config,invoke,TOOL_MAP} from '../src/server.js';

test('auth config requires credential',()=>assert.throws(()=>config({CORALOGIX_MCP_URL:'https://api.eu2.coralogix.com/mgmt/api/v1/mcp'}),/API_KEY/));
test('rejects non-Coralogix endpoint (SSRF boundary)',()=>assert.throws(()=>config({CORALOGIX_MCP_URL:'https://evil.example/mcp',CORALOGIX_API_KEY:'secret'}),/official HTTPS/));
test('tool map exposes only scoped read operations',()=>{assert.equal(Object.keys(TOOL_MAP).length,5); assert.ok(Object.keys(TOOL_MAP).every(x=>/^coralogix\./.test(x)));});
test('rejects arbitrary upstream calls',async()=>await assert.rejects(()=>invoke({callTool(){throw new Error('must not run')}},'delete_everything',{}),/allowlisted/));
test('read invokes mapped upstream tool',async()=>{let seen; const client={callTool:async x=>(seen=x,{content:[]})}; await invoke(client,'get_logs',{query:'source logs | limit 1'},{timeout:100,retries:0}); assert.equal(seen.name,'get_logs');});
test('auth errors are not retried',async()=>{let n=0; const client={callTool:async()=>{n++;throw new Error('401 unauthorized')}}; await assert.rejects(()=>invoke(client,'get_logs',{query:'x'},{timeout:100,retries:2}),/401/); assert.equal(n,1);});
test('transient failure is bounded and retried',async()=>{let n=0; const client={callTool:async()=>{n++; if(n<2) throw new Error('network reset'); return {ok:true}}}; const r=await invoke(client,'get_logs',{query:'x'},{timeout:100,retries:2}); assert.equal(r.ok,true); assert.equal(n,2);});
test('timeout abort path is bounded',async()=>{const client={callTool:(_x,o)=>new Promise((_r,j)=>o.signal.addEventListener('abort',()=>j(new Error('aborted'))))}; await assert.rejects(()=>invoke(client,'get_logs',{query:'x'},{timeout:5,retries:0}),/aborted/);});
