import test from 'node:test'; import assert from 'node:assert/strict';
import {loadConfig,requireApproval,ApprovalError,GetStreamClient} from '../src/core.js';
test('requires credentials',()=>assert.throws(()=>loadConfig({} as NodeJS.ProcessEnv)));
test('loads safe defaults',()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s'} as NodeJS.ProcessEnv);assert.equal(c.allowWrites,false);assert.equal(c.maxRetries,2)});
test('read needs no approval',()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s'} as NodeJS.ProcessEnv);assert.doesNotThrow(()=>requireApproval(c,false,'READ'))});
test('writes disabled by default',()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s'} as NodeJS.ProcessEnv);assert.throws(()=>requireApproval(c,true,'WRITE'),ApprovalError)});
test('writes require explicit approval',()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s',GETSTREAM_ALLOW_WRITES:'true'} as NodeJS.ProcessEnv);assert.throws(()=>requireApproval(c,false,'WRITE'),ApprovalError);assert.doesNotThrow(()=>requireApproval(c,true,'WRITE'))});
test('bounded retry retries transient failures',async()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s',GETSTREAM_MAX_RETRIES:'2'} as NodeJS.ProcessEnv);const x=new GetStreamClient(c);let n=0;const v=await x.retry(async()=>{n++;if(n<3)throw Object.assign(new Error('network'),{status:500});return 7});assert.equal(v,7);assert.equal(n,3)});
test('unsafe operations are never retried',async()=>{const c=loadConfig({GETSTREAM_API_KEY:'k',GETSTREAM_API_SECRET:'s'} as NodeJS.ProcessEnv);const x=new GetStreamClient(c);let n=0;await assert.rejects(()=>x.retry(async()=>{n++;throw new Error('fail')},false));assert.equal(n,1)});
