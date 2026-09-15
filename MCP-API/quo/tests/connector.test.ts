import test from 'node:test';import assert from 'node:assert/strict';import {definitions,authorize,ConnectorError} from '../src/connector.js';
test('registers 11 scoped tools',()=>assert.equal(Object.keys(definitions).length,11));
test('validates E164 and rejects extras',()=>assert.throws(()=>definitions['quo.message.send'].schema.parse({from:'pn_1',to:'555',content:'x',approved:true}))); 
test('high risk requires approval',()=>assert.throws(()=>authorize('HIGH_RISK',{}),(e:any)=>e instanceof ConnectorError&&e.code==='APPROVAL'));
test('write approval configurable',()=>{const old=process.env.QUO_WRITE_APPROVAL_REQUIRED;process.env.QUO_WRITE_APPROVAL_REQUIRED='false';assert.doesNotThrow(()=>authorize('WRITE',{}));if(old===undefined)delete process.env.QUO_WRITE_APPROVAL_REQUIRED;else process.env.QUO_WRITE_APPROVAL_REQUIRED=old});
test('destructive disabled by default',()=>{delete process.env.QUO_ALLOW_DESTRUCTIVE;assert.throws(()=>authorize('DESTRUCTIVE',{approved:true}))});
