import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { approvalDigest,assertAllowed } from '../src/policy.js';
import { TOOL_MAP,TOOLS } from '../src/tools.js';

test('config requires API key and validates LIVE prefix',()=>{
 assert.throws(()=>loadConfig({} as NodeJS.ProcessEnv),/ADYEN_API_KEY/);
 assert.throws(()=>loadConfig({ADYEN_API_KEY:'x',ADYEN_ENV:'LIVE'} as NodeJS.ProcessEnv),/ADYEN_LIVE_PREFIX/);
 assert.equal(loadConfig({ADYEN_API_KEY:'x',ADYEN_ENV:'TEST'} as NodeJS.ProcessEnv).env,'TEST');
});

test('tool registry is unique and bounded',()=>{
 assert.equal(TOOLS.length,11);assert.equal(new Set(TOOLS.map(t=>t.name)).size,TOOLS.length);
 assert.equal(TOOL_MAP.get('adyen.payment.refund')?.risk,'HIGH_RISK');
 assert.equal(TOOL_MAP.get('adyen.merchant.list')?.risk,'READ');
});

test('strict schemas reject unknown fields',()=>{
 const t=TOOL_MAP.get('adyen.merchant.get')!;
 assert.throws(()=>t.schema.parse({merchantId:'abc',extra:true}));
});

test('approval is payload-bound',()=>{
 const cfg=loadConfig({ADYEN_API_KEY:'x',ADYEN_ENV:'TEST',ADYEN_APPROVAL_SECRET:'0123456789abcdef'} as NodeJS.ProcessEnv);
 const base={paymentReference:'PSP123'};const token=approvalDigest(cfg.approvalSecret!,'adyen.payment.cancel',base);
 assert.doesNotThrow(()=>assertAllowed('HIGH_RISK','adyen.payment.cancel',{...base,approvalToken:token},cfg));
 assert.throws(()=>assertAllowed('HIGH_RISK','adyen.payment.cancel',{paymentReference:'PSP999',approvalToken:token},cfg),/approval/i);
});

test('writes are approval-gated by default',()=>{
 const cfg=loadConfig({ADYEN_API_KEY:'x',ADYEN_ENV:'TEST'} as NodeJS.ProcessEnv);
 assert.throws(()=>assertAllowed('WRITE','adyen.payment_link.create',{},cfg),/Approval secret/);
});
