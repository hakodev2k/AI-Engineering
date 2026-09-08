import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { TOOL_DEFINITIONS, executeTool } from '../src/tools.js';

class FakeClient {
  calls: any[] = [];
  async request(options: any) {
    this.calls.push(options);
    return { status: 'ok', options };
  }
}

test('registers ten scoped Akamai tools with no raw request escape hatch', () => {
  assert.equal(TOOL_DEFINITIONS.length, 10);
  assert.ok(TOOL_DEFINITIONS.every(t => t.name.startsWith('akamai.')));
  assert.equal(TOOL_DEFINITIONS.some(t => /raw|execute_any|request/.test(t.name)), false);
});

test('read operation validates IDs and maps to PAPI', async () => {
  const fake = new FakeClient();
  const result: any = await executeTool(fake as any, 'akamai.property.get', { propertyId: 'prp_12345' });
  assert.equal(result.status, 'ok');
  assert.equal(fake.calls[0].method, 'GET');
  assert.equal(fake.calls[0].path, '/papi/v1/properties/prp_12345');
  await assert.rejects(() => executeTool(fake as any, 'akamai.property.get', { propertyId: '../secret' }));
});

test('write invalidation requires both configuration and explicit approval', async () => {
  const fake = new FakeClient();
  config.allowWrite = false;
  await assert.rejects(() => executeTool(fake as any, 'akamai.purge.url.invalidate', { network: 'production', objects: ['https://example.com/a'], approved: true }), /disabled/);
  config.allowWrite = true;
  await assert.rejects(() => executeTool(fake as any, 'akamai.purge.url.invalidate', { network: 'production', objects: ['https://example.com/a'] }));
  await executeTool(fake as any, 'akamai.purge.url.invalidate', { network: 'production', objects: ['https://example.com/a'], approved: true });
  assert.equal(fake.calls.at(-1).path, '/ccu/v3/invalidate/url/production');
  config.allowWrite = false;
});

test('production/staging activation is high risk and never silently approved', async () => {
  const fake = new FakeClient();
  const input = { propertyId: 'prp_1', propertyVersion: 2, network: 'STAGING', notifyEmails: ['ops@example.com'], approved: true };
  config.allowHighRisk = false;
  await assert.rejects(() => executeTool(fake as any, 'akamai.activation.create', input), /disabled/);
  config.allowHighRisk = true;
  await executeTool(fake as any, 'akamai.activation.create', input);
  assert.equal(fake.calls.at(-1).retrySafe, undefined);
  assert.equal(fake.calls.at(-1).body.propertyVersion, 2);
  config.allowHighRisk = false;
});

test('purge object limits are enforced before provider calls', async () => {
  const fake = new FakeClient();
  config.allowWrite = true;
  await assert.rejects(() => executeTool(fake as any, 'akamai.purge.cpcode.invalidate', { network: 'production', objects: Array.from({ length: 301 }, (_, i) => i + 1), approved: true }));
  assert.equal(fake.calls.length, 0);
  config.allowWrite = false;
});
