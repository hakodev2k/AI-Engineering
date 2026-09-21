import test from 'node:test';import assert from 'node:assert/strict';import {SendbirdClient} from '../src/client.js';import {clean,qs,requireApproval} from '../src/policy.js';
test('auth config rejects missing credentials',()=>assert.throws(()=>new SendbirdClient({} as any)));
test('auth config accepts app and token',()=>assert.doesNotThrow(()=>new SendbirdClient({SENDBIRD_APPLICATION_ID:'app_1',SENDBIRD_API_TOKEN:'secret'} as any)));
test('validation rejects control chars and empty ids',()=>{assert.throws(()=>clean('','id'));assert.throws(()=>clean('a\n','id'))});
test('query builder omits undefined and encodes',()=>assert.equal(qs({limit:20,token:'a b',x:undefined}),'limit=20&token=a+b'));
test('write denied without approval by default',()=>assert.throws(()=>requireApproval('WRITE',false,{} as any)));
test('high risk always requires explicit approval',()=>assert.throws(()=>requireApproval('HIGH_RISK',false,{SENDBIRD_WRITE_APPROVAL_REQUIRED:'false'} as any)));
test('read does not require approval',()=>assert.doesNotThrow(()=>requireApproval('READ',false,{} as any)));
