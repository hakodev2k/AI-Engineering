import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { requireApproval } from '../src/policy.js';
import { PortTokenProvider } from '../src/auth.js';

const baseEnv = {
  PORT_CLIENT_ID:'client', PORT_CLIENT_SECRET:'secret', PORT_MCP_URL:'https://mcp.port.io/v1', PORT_API_URL:'https://api.port.io/v1',
  PORT_TIMEOUT_MS:'1000', PORT_MAX_RETRIES:'1', PORT_WRITE_APPROVED:'false'
};

test('configuration requires credentials',()=>{ assert.throws(()=>loadConfig({})); });
test('writes require both runtime gate and explicit approval',()=>{ const c=loadConfig(baseEnv); assert.throws(()=>requireApproval(c,'WRITE',true)); });
test('read operations require no approval',()=>{ const c=loadConfig(baseEnv); assert.doesNotThrow(()=>requireApproval(c,'READ')); });
test('destructive operations stay disabled',()=>{ const c=loadConfig({...baseEnv,PORT_WRITE_APPROVED:'true'}); assert.throws(()=>requireApproval(c,'DESTRUCTIVE',true)); });
test('MCP token is cached until near expiry',async()=>{
  let calls=0;
  const fake=async()=>{ calls++; return new Response(JSON.stringify({access_token:'token',expires_in:10800}),{status:200,headers:{'content-type':'application/json'}}); };
  const p=new PortTokenProvider(loadConfig(baseEnv),fake as typeof fetch);
  assert.equal(await p.mcpToken(),'token'); assert.equal(await p.mcpToken(),'token'); assert.equal(calls,1);
});
test('invalid credentials surface as auth error',async()=>{
  const fake=async()=>new Response('unauthorized',{status:401});
  const p=new PortTokenProvider(loadConfig(baseEnv),fake as typeof fetch);
  await assert.rejects(()=>p.mcpToken(),/authentication failed/);
});
