import test from 'node:test';import assert from 'node:assert/strict';import {approve} from '../src/core.js';
const c={readOnly:false,allowWrite:true,allowPublic:false,approvalMode:'required' as const,timeoutMs:30000};
test('read auto',()=>assert.doesNotThrow(()=>approve('READ',{},c)));
test('write requires approval',()=>assert.throws(()=>approve('WRITE',{},c),/approval/i));
test('approved write allowed',()=>assert.doesNotThrow(()=>approve('WRITE',{approval:{confirmed:true,reason:'operator approved'}},c)));
test('read-only blocks write',()=>assert.throws(()=>approve('WRITE',{approval:{confirmed:true,reason:'ok now'}},{...c,readOnly:true}),/disabled/i));
test('destructive blocked',()=>assert.throws(()=>approve('DESTRUCTIVE',{},{...c}),/Destructive/i));
