import test from 'node:test';import assert from 'node:assert/strict';import {execute,schemas,toolNames} from '../src/tools.js';import type {Upstream} from '../src/upstream.js';
class Fake implements Upstream{calls:any[]=[];async call(policy:any,args:any){this.calls.push({policy,args});return {ok:true,args}}async close(){}}
test('registers nine stable tools',()=>assert.equal(toolNames.length,9));
test('rejects empty search',()=>assert.throws(()=>schemas['loom.recording.search'].parse({query:''})));
test('read executes without approval',async()=>{const f=new Fake();await execute(f,'loom.recording.get',{recordingId:'abc'});assert.equal(f.calls.length,1);assert.equal(f.calls[0].policy.risk,'READ')});
test('write requires approval',async()=>{const f=new Fake();await assert.rejects(()=>execute(f,'loom.comment.create',{recordingId:'a',text:'hello'}),/approval/);assert.equal(f.calls.length,0)});
test('approved write strips approval before upstream',async()=>{const f=new Fake();await execute(f,'loom.recording.move',{recordingId:'a',folderId:'b',approved:true});assert.deepEqual(f.calls[0].args,{recordingId:'a',folderId:'b'})});
test('update requires a field',()=>assert.throws(()=>schemas['loom.recording.update'].parse({recordingId:'a',approved:true})));
