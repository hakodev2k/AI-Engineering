import test from 'node:test';import assert from 'node:assert/strict';import {assertAllowed,sanitize} from '../src/security.js';
test('default allowlist accepts expected read tool',()=>assert.doesNotThrow(()=>assertAllowed('list_chains')));
test('default allowlist rejects discovered/unapproved tool',()=>assert.throws(()=>assertAllowed('update_allowlist')));
test('sanitizer bounds arrays and strings',()=>{const x=sanitize({a:'x'.repeat(100001),b:Array(1001).fill(1)}) as any;assert.equal(x.a.length,100000);assert.equal(x.b.length,1000);});