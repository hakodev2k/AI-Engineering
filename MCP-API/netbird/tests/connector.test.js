import test from 'node:test';
import assert from 'node:assert/strict';
import { NetBirdClient, NetBirdError } from '../src/client.js';
import { groupBody, safeId, authorize } from '../src/policy.js';

test('auth configuration requires token', () => {
  assert.throws(() => new NetBirdClient({NETBIRD_API_URL:'https://api.netbird.io'}, async()=>{}), /NETBIRD_TOKEN/);
});

test('rejects unsafe remote HTTP endpoint', () => {
  assert.throws(() => new NetBirdClient({NETBIRD_API_URL:'http://evil.example',NETBIRD_TOKEN:'x'}, async()=>{}), /HTTPS/);
});

test('strict identifiers and group validation', () => {
  assert.equal(safeId('peer-1'), 'peer-1');
  assert.throws(() => safeId('../peer'), /Invalid/);
  assert.deepEqual(groupBody('ops',['p-1']), {name:'ops',peers:['p-1']});
  assert.throws(() => groupBody('',[]), /group name/);
});

test('read request uses PAT without leaking it in URL', async () => {
  let seen;
  const fake = async (url, init) => { seen={url:String(url),init}; return new Response(JSON.stringify([{id:'p1'}]),{status:200,headers:{'content-type':'application/json'}}); };
  const c = new NetBirdClient({NETBIRD_API_URL:'https://api.netbird.io',NETBIRD_TOKEN:'secret'},fake);
  const result = await c.request('/peers');
  assert.equal(result[0].id,'p1');
  assert.equal(seen.init.headers.Authorization,'Token secret');
  assert.equal(seen.url.includes('secret'),false);
});

test('MSP account scoping is encoded as query parameter', async () => {
  let url;
  const fake = async (u) => { url=String(u); return new Response('[]',{status:200}); };
  const c = new NetBirdClient({NETBIRD_API_URL:'https://api.netbird.io',NETBIRD_TOKEN:'x',NETBIRD_ACCOUNT_ID:'tenant 1'},fake);
  await c.request('/groups');
  assert.match(url,/account=tenant\+1/);
});

test('provider errors are mapped and permission errors are not retried', async () => {
  let calls=0;
  const fake = async () => { calls++; return new Response(JSON.stringify({message:'forbidden'}),{status:403}); };
  const c = new NetBirdClient({NETBIRD_API_URL:'https://api.netbird.io',NETBIRD_TOKEN:'x',NETBIRD_MAX_RETRIES:'4'},fake);
  await assert.rejects(c.request('/peers'), e => e instanceof NetBirdError && e.status===403);
  assert.equal(calls,1);
});

test('GET retries throttling with bounded retry count', async () => {
  let calls=0;
  const fake = async () => { calls++; return calls===1 ? new Response('{"message":"slow"}',{status:429,headers:{'retry-after':'0'}}) : new Response('[]',{status:200}); };
  const c = new NetBirdClient({NETBIRD_API_URL:'https://api.netbird.io',NETBIRD_TOKEN:'x',NETBIRD_MAX_RETRIES:'1'},fake);
  await c.request('/events');
  assert.equal(calls,2);
});

test('high-risk mutation requires enabled permission and matching approval', () => {
  const oldPerm=process.env.NETBIRD_ALLOWED_PERMISSIONS, oldToken=process.env.NETBIRD_APPROVAL_TOKEN;
  process.env.NETBIRD_ALLOWED_PERMISSIONS='READ,HIGH_RISK'; process.env.NETBIRD_APPROVAL_TOKEN='approved';
  assert.throws(() => authorize('HIGH_RISK','wrong'), /approval/);
  assert.doesNotThrow(() => authorize('HIGH_RISK','approved'));
  if(oldPerm===undefined) delete process.env.NETBIRD_ALLOWED_PERMISSIONS; else process.env.NETBIRD_ALLOWED_PERMISSIONS=oldPerm;
  if(oldToken===undefined) delete process.env.NETBIRD_APPROVAL_TOKEN; else process.env.NETBIRD_APPROVAL_TOKEN=oldToken;
});
