import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { CannyClient, CannyError } from '../src/client.js';
import { enforcePolicy, TOOL_POLICY } from '../src/policy.js';

test('config validates required settings', () => {
  assert.throws(() => loadConfig({}), /CANNY_API_KEY/);
  assert.throws(() => loadConfig({ CANNY_API_KEY:'test-key', CANNY_API_BASE_URL:'http://canny.io/api' }), /https/);
  assert.equal(loadConfig({ CANNY_API_KEY:'test-key' }).baseUrl, 'https://canny.io/api');
});

test('write and high-risk policies require approval', () => {
  assert.throws(() => enforcePolicy('canny.post.create', {}, true), /approval/i);
  assert.doesNotThrow(() => enforcePolicy('canny.post.create', { approved:true }, true));
  assert.throws(() => enforcePolicy('canny.post.change_status', {}, false), /Explicit human approval/);
  assert.equal(TOOL_POLICY['canny.board.list'].risk, 'READ');
});

test('client injects auth inside transport', async () => {
  let sentBody = '';
  const fakeFetch: typeof fetch = async (_input, init) => {
    sentBody = String(init?.body || '');
    return new Response(JSON.stringify({ boards: [] }), { status: 200 });
  };
  const client = new CannyClient({ apiKey:'test-key', baseUrl:'https://canny.io/api', timeoutMs:1000, maxRetries:0, requireWriteApproval:true }, fakeFetch);
  assert.deepEqual(await client.call('v1/boards/list', {}), { boards: [] });
  assert.match(sentBody, /apiKey/);
});

test('401 is not retried', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response(JSON.stringify({ error:'unauthorized' }), { status:401 }); };
  const client = new CannyClient({ apiKey:'test-key', baseUrl:'https://canny.io/api', timeoutMs:1000, maxRetries:3, requireWriteApproval:true }, fakeFetch);
  await assert.rejects(() => client.call('v1/boards/list', {}), (e: unknown) => e instanceof CannyError && e.status === 401);
  assert.equal(calls, 1);
});

test('429 is retried within configured bound', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => ++calls === 1 ? new Response(JSON.stringify({error:'throttled'}), {status:429,headers:{'retry-after':'0'}}) : new Response(JSON.stringify({boards:[]}), {status:200});
  const client = new CannyClient({ apiKey:'test-key', baseUrl:'https://canny.io/api', timeoutMs:1000, maxRetries:1, requireWriteApproval:true }, fakeFetch);
  await client.call('v1/boards/list', {});
  assert.equal(calls, 2);
});
