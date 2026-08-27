import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConfig,approvalDigest} from '../src/config.js';
import {authorize,TOOL_POLICY} from '../src/policy.js';
import {TOOL_DEFINITIONS} from '../src/tools.js';
import {InfisicalClient} from '../src/client.js';

test('registry and policies sync',()=>{assert.equal(TOOL_DEFINITIONS.length,8);assert.deepEqual(TOOL_DEFINITIONS.map(x=>x.name).sort(),Object.keys(TOOL_POLICY).sort())});
test('config rejects insecure URL',()=>assert.throws(()=>loadConfig({INFISICAL_CLIENT_ID:'i',INFISICAL_CLIENT_SECRET:'s',INFISICAL_SITE_URL:'http://x'}),/HTTPS/));
test('write approval is payload bound',()=>{const c={approvalSecret:'h',destructiveEnabled:false};const t='infisical.secret.create',p={projectId:'p',environment:'dev',secretName:'A',secretValue:'v'};const token=approvalDigest(c.approvalSecret,t,p);assert.doesNotThrow(()=>authorize(c,t,p,token));assert.throws(()=>authorize(c,t,{...p,secretName:'B'},token),/Invalid/)});
test('delete disabled by default',()=>assert.throws(()=>authorize({approvalSecret:'h',destructiveEnabled:false},'infisical.secret.delete',{projectId:'p',environment:'dev',secretName:'A'},'0'.repeat(64)),/disabled/));
function fake(){let logins=0,observed;return{sdk:{auth:()=>({universalAuth:{login:async()=>{logins++}}}),secrets:()=>({listSecrets:async o=>{observed=o;return{secrets:[{secretKey:'A',secretValue:'LEAK'}]}},getSecret:async o=>({secretKey:o.secretName,secretValue:'LEAK'}),createSecret:async(n,o)=>({secretKey:n,secretValue:o.secretValue}),updateSecret:async(n,o)=>({secretKey:n,secretValue:o.secretValue||'LEAK'}),deleteSecret:async n=>({secretKey:n,secretValue:'LEAK'})})},get:()=>({logins,observed})}};
test('metadata reads hide values and disable expansion',async()=>{const f=fake();const c=new InfisicalClient({siteUrl:'https://app.infisical.com',clientId:'i',clientSecret:'s',timeoutMs:1000},f.sdk);const r=await c.list({projectId:'p',environment:'dev'});assert.equal(f.get().observed.viewSecretValue,false);assert.equal(f.get().observed.expandSecretReferences,false);assert.equal(r.secrets[0].secretValue,undefined);assert.equal(f.get().logins,1)});
test('write responses are sanitized',async()=>{const f=fake();const c=new InfisicalClient({siteUrl:'https://app.infisical.com',clientId:'i',clientSecret:'s',timeoutMs:1000},f.sdk);const r=await c.create({projectId:'p',environment:'dev',secretName:'A',secretValue:'SENSITIVE'});assert.equal(r.secretValue,undefined);assert.equal(r.secretValueExposed,false)});
