import test from 'node:test';import assert from 'node:assert/strict';
process.env.NODE_ENV='test';
const mod=await import('../src/index.js');

test('READ does not require approval',()=>assert.doesNotThrow(()=>mod.approve('READ')));
test('WRITE denied by default',()=>{delete process.env.DIALPAD_APPROVE_WRITE;assert.throws(()=>mod.approve('WRITE'),mod.ApprovalError)});
test('HIGH_RISK requires explicit approval',()=>{delete process.env.DIALPAD_APPROVE_HIGH_RISK;assert.throws(()=>mod.approve('HIGH_RISK'),mod.ApprovalError);process.env.DIALPAD_APPROVE_HIGH_RISK='true';assert.doesNotThrow(()=>mod.approve('HIGH_RISK'))});
test('DESTRUCTIVE remains disabled',()=>assert.throws(()=>mod.approve('DESTRUCTIVE'),mod.ApprovalError));
test('missing token fails before network request',async()=>{delete process.env.DIALPAD_API_TOKEN;await assert.rejects(()=>mod.request('/call',{},0),(e:any)=>e.status===401)});
test('429 retries are bounded and provider errors map',async()=>{process.env.DIALPAD_API_TOKEN='test';let n=0;const old=globalThis.fetch;globalThis.fetch=async()=>{n++;return new Response(JSON.stringify({message:'slow down'}),{status:429,headers:{'content-type':'application/json','retry-after':'0'}})};try{await assert.rejects(()=>mod.request('/call',{},1),(e:any)=>e.status===429);assert.equal(n,2)}finally{globalThis.fetch=old}});
test('successful read returns JSON',async()=>{process.env.DIALPAD_API_TOKEN='test';const old=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({items:[{id:1}]}),{status:200,headers:{'content-type':'application/json'}});try{assert.deepEqual(await mod.request('/call',{},0),{items:[{id:1}]})}finally{globalThis.fetch=old}});
