import test from 'node:test';import assert from 'node:assert/strict';import {loadConfig} from '../src/config.js';
test('requires key',()=>assert.throws(()=>loadConfig({} as any)));test('secure defaults',()=>{const c=loadConfig({BEEHIIV_API_KEY:'x'} as any);assert.equal(c.readOnly,true);assert.equal(c.allowWrite,false);assert.equal(c.approvalMode,'required')});
