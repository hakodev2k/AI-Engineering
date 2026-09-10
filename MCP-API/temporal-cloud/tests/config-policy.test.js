import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { Risk, approvalFor, enforcePolicy } from '../src/policy.js';

test('requires API key',()=>assert.throws(()=>loadConfig({}),/API_KEY is required/));
test('pins official Cloud Ops API host',()=>assert.throws(()=>loadConfig({TEMPORAL_CLOUD_API_KEY:'x',TEMPORAL_CLOUD_API_BASE_URL:'https://evil.example'}),/saas-api/));
test('safe defaults deny writes',()=>{
  const c=loadConfig({TEMPORAL_CLOUD_API_KEY:'x'});
  assert.equal(c.allowWrite,false); assert.equal(c.allowHighRisk,false); assert.equal(c.allowDestructive,false);
  assert.throws(()=>enforcePolicy(c,'x',Risk.WRITE,{}),/disabled/);
});
test('approval is bound to exact payload',()=>{
  const c=loadConfig({TEMPORAL_CLOUD_API_KEY:'x',TEMPORAL_CLOUD_ALLOW_WRITE:'true',TEMPORAL_CLOUD_APPROVAL_SECRET:'1234567890123456'});
  const payload={namespace:'orders',tagsToUpsert:{env:'stage'}};
  const token=approvalFor(c.approvalSecret,'temporal_cloud.namespace.tags.update',payload);
  enforcePolicy(c,'temporal_cloud.namespace.tags.update',Risk.WRITE,{...payload,approvalToken:token});
  assert.throws(()=>enforcePolicy(c,'temporal_cloud.namespace.tags.update',Risk.WRITE,{namespace:'orders',tagsToUpsert:{env:'prod'},approvalToken:token}),/does not match/);
});
