import test from 'node:test';
import assert from 'node:assert/strict';
import { BunnyClient } from '../src/client.js';
import type { BunnyConfig } from '../src/config.js';
import { buildTools } from '../src/tools.js';

const baseConfig: BunnyConfig = {
  apiKey: 'test-key',
  apiBaseUrl: 'https://api.bunny.net',
  timeoutMs: 2000,
  maxRetries: 0,
  approvalMode: 'required',
  allowDestructive: false,
};

function fakeClient(responder?: (url: URL, init?: RequestInit) => Response | Promise<Response>) {
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input : input.url);
    return responder ? responder(url, init) : new Response('{}', { status: 200 });
  };
  return new BunnyClient(baseConfig, fetcher);
}

test('registers the documented connector tool surface', () => {
  const names = buildTools(fakeClient(), baseConfig).map((t) => t.name);
  assert.deepEqual(names, [
    'bunny.pull_zone.list',
    'bunny.pull_zone.get',
    'bunny.storage_zone.list',
    'bunny.storage_zone.get',
    'bunny.storage_zone.statistics',
    'bunny.dns_zone.list',
    'bunny.dns_zone.get',
    'bunny.dns_zone.export',
    'bunny.dns_record.create',
    'bunny.pull_zone.allowed_referrer.add',
    'bunny.pull_zone.delete',
  ]);
});

test('validates positive resource IDs before API execution', async () => {
  const tool = buildTools(fakeClient(), baseConfig).find((t) => t.name === 'bunny.pull_zone.get')!;
  await assert.rejects(() => tool.handler({ pullZoneId: 0 }));
});

test('blocks DNS mutation without approval and permits approved request', async () => {
  let method = '';
  const client = fakeClient((_url, init) => {
    method = init?.method ?? 'GET';
    return new Response(JSON.stringify({ Id: 99 }), { status: 201 });
  });
  const tool = buildTools(client, baseConfig).find((t) => t.name === 'bunny.dns_record.create')!;
  await assert.rejects(() => tool.handler({ dnsZoneId: 1, type: 0, name: 'www', value: '192.0.2.1', approved: false }), /approval/);
  const result = await tool.handler({ dnsZoneId: 1, type: 0, name: 'www', value: '192.0.2.1', approved: true });
  assert.deepEqual(result, { Id: 99 });
  assert.equal(method, 'PUT');
});

test('destructive Pull Zone deletion remains disabled even with approval', async () => {
  const tool = buildTools(fakeClient(), baseConfig).find((t) => t.name === 'bunny.pull_zone.delete')!;
  await assert.rejects(() => tool.handler({ pullZoneId: 1, approved: true, approvalToken: 'operator-approved' }), /disabled/);
});
