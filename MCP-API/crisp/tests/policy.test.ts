import test from 'node:test'; import assert from 'node:assert/strict'; import {authorize} from '../src/policy.js';
test('READ auto-runs',()=>assert.doesNotThrow(()=>authorize('READ',undefined,{requireWriteApproval:true,enableDestructive:false})));
test('WRITE defaults to approval',()=>assert.throws(()=>authorize('WRITE',false,{requireWriteApproval:true,enableDestructive:false}),/APPROVAL_REQUIRED/));
test('HIGH_RISK always requires approval',()=>assert.throws(()=>authorize('HIGH_RISK',false,{requireWriteApproval:false,enableDestructive:true}),/APPROVAL_REQUIRED/));
test('DESTRUCTIVE disabled by default',()=>assert.throws(()=>authorize('DESTRUCTIVE',true,{requireWriteApproval:true,enableDestructive:false}),/DESTRUCTIVE_DISABLED/));
