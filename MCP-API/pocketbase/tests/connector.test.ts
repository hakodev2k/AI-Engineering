import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { PocketBaseApiError, PocketBaseClient } from '../src/client.js';
import { buildTools } from '../src/tools.js';

const base = { baseUrl: 'https://pb.example.com', authToken: 'token', timeoutMs: 2000, requireWriteApproval: true, destructiveEnabled: false };

test('config requires a base URL', () => assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /POCKETBASE_BASE_URL/));
test('config rejects insecure remote HTTP', () => assert.throws(() => loadConfig({ POCKETBASE_BASE_URL: 'http://example.com' } as NodeJS.ProcessEnv), /HTTPS/));
test('config allows HTTP localhost', () => assert.equal(loadConfig({ POCKETBASE_BASE_URL: 'http://127.0.0.1:8090' } as NodeJS.ProcessEnv).baseUrl, 'http://127.0.0.1:8090'));
test('read requires no approval', () => assert.doesNotThrow(() => authorize('READ', undefined, base)));
test('write requires approval', () => assert.throws(() => authorize('WRITE', false, base), /APPROVAL_REQUIRED/));
test('destructive actions are disabled by default', () => assert.throws(() => authorize('DESTRUCTIVE', true, base), /DESTRUCTIVE_DISABLED/));
test('all expected tools are registered', () => {
  const fake = { request: async () => ({}) } as any;
  const tools = buildTools(fake);
  assert.equal(tools.size, 15);
  assert.ok(tools.has('pocketbase.record.create'));
  assert.ok(tools.has('pocketbase.backup.restore'));
});
test('record create validation rejects oversized payload', () => {
  const tools = buildTools({ request: async () => ({}) } as any);
  const schema = tools.get('pocketbase.record.create')!.schema;
  assert.throws(() => schema.parse({ collection: 'posts', data: { text: 'x'.repeat(300000) }, approved: true }));
});
test('health call does not require auth', async () => {
  let authHeader: string | null = null;
  const f = async (_input: RequestInfo | URL, init?: RequestInit) => {
    authHeader = new Headers(init?.headers).get('authorization');
    return new Response(JSON.stringify({ status: 200, message: 'API is healthy.' }), { status: 200 });
  };
  const c = new PocketBaseClient({ ...base, authToken: undefined }, f as typeof fetch);
  await c.request('GET', '/api/health', { auth: false });
  assert.equal(authHeader, null);
});
test('API error maps provider status and message', async () => {
  const f = async () => new Response(JSON.stringify({ status: 403, message: 'Only superusers can perform this action.', data: {} }), { status: 403 });
  const c = new PocketBaseClient(base, f as typeof fetch);
  await assert.rejects(() => c.request('GET', '/api/logs'), (e: any) => e instanceof PocketBaseApiError && e.status === 403);
});
test('bounded retry succeeds after one 429', async () => {
  let count = 0;
  const f = async () => {
    count++;
    if (count === 1) return new Response(JSON.stringify({ message: 'throttled' }), { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ items: [] }), { status: 200 });
  };
  const c = new PocketBaseClient(base, f as typeof fetch);
  assert.deepEqual(await c.request('GET', '/api/logs'), { items: [] });
  assert.equal(count, 2);
});
