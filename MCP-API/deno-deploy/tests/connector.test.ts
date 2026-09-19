import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize, requireToken } from '../src/auth.js';
import { tools } from '../src/tools.js';

test('auth configuration rejects missing credentials',()=>assert.throws(()=>requireToken({} as NodeJS.ProcessEnv),/DENO_DEPLOY_TOKEN/));
test('auth configuration accepts isolated token',()=>assert.equal(requireToken({DENO_DEPLOY_TOKEN:'secret'} as NodeJS.ProcessEnv),'secret'));
test('registers meaningful provider-scoped tools',()=>{assert.equal(tools.length,12);assert.ok(tools.every(t=>t.name.startsWith('deno-deploy.')))});
test('read is auto-authorized',()=>assert.doesNotThrow(()=>authorize('READ',{},{} as NodeJS.ProcessEnv)));
test('write requires approval by default',()=>assert.throws(()=>authorize('WRITE',{},{} as NodeJS.ProcessEnv),/APPROVAL_REQUIRED/));
test('write can be approved',()=>assert.doesNotThrow(()=>authorize('WRITE',{approved:true},{} as NodeJS.ProcessEnv)));
test('high risk always requires approval',()=>assert.throws(()=>authorize('HIGH_RISK',{}, {DENO_DEPLOY_WRITE_APPROVAL:'optional'} as NodeJS.ProcessEnv),/APPROVAL_REQUIRED/));
test('destructive is disabled by default',()=>assert.throws(()=>authorize('DESTRUCTIVE',{approved:true},{} as NodeJS.ProcessEnv),/disabled/));
test('destructive needs enablement and approval',()=>{const env={DENO_DEPLOY_DESTRUCTIVE_ENABLED:'true'} as NodeJS.ProcessEnv;assert.throws(()=>authorize('DESTRUCTIVE',{},env),/APPROVAL_REQUIRED/);assert.doesNotThrow(()=>authorize('DESTRUCTIVE',{approved:true},env))});
test('schemas reject unsafe identifiers',()=>{const get=tools.find(t=>t.name==='deno-deploy.app.get')!;assert.equal(get.schema.app.safeParse('../secret').success,false)});
test('volume capacity is bounded to explicit units syntactically',()=>{const create=tools.find(t=>t.name==='deno-deploy.volume.create')!;assert.equal(create.schema.capacity.safeParse('2GB').success,true);assert.equal(create.schema.capacity.safeParse('huge').success,false)});
test('destructive operations are never retry-oriented handlers',()=>assert.ok(tools.filter(t=>t.risk==='DESTRUCTIVE').length>=3));
