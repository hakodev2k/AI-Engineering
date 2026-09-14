import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { KeygenClient } from '../src/client.js';
import { approvalToken, assertAllowed } from '../src/policy.js';

test('configuration requires credentials and accepts safe defaults', () => {
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret' } as NodeJS.ProcessEnv);
  assert.equal(c.baseUrl, 'https://api.keygen.sh');
  assert.equal(c.allowWrites, false);
  assert.equal(c.allowDestructive, false);
});

test('write operations are denied by default', () => {
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret' } as NodeJS.ProcessEnv);
  assert.throws(() => assertAllowed('keygen.license.create', 'WRITE', undefined, c), /disabled/);
});

test('approved write succeeds only with host-held approval secret', () => {
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret', KEYGEN_ALLOW_WRITES: 'true', KEYGEN_APPROVAL_SECRET: 'host-secret' } as NodeJS.ProcessEnv);
  const token = approvalToken('keygen.license.create', 'host-secret');
  assert.doesNotThrow(() => assertAllowed('keygen.license.create', 'WRITE', token, c));
  assert.throws(() => assertAllowed('keygen.license.suspend', 'HIGH_RISK', token, c), /invalid/);
});

test('destructive operation requires its additional feature gate', () => {
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret', KEYGEN_ALLOW_WRITES: 'true', KEYGEN_APPROVAL_SECRET: 'host-secret' } as NodeJS.ProcessEnv);
  const token = approvalToken('keygen.machine.deactivate', 'host-secret');
  assert.throws(() => assertAllowed('keygen.machine.deactivate', 'DESTRUCTIVE', token, c), /KEYGEN_ALLOW_DESTRUCTIVE/);
});

test('client isolates bearer token and performs bounded list request', async () => {
  let seenUrl = '';
  let seenAuth = '';
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenAuth = new Headers(init?.headers).get('authorization') ?? '';
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/vnd.api+json' } });
  };
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret' } as NodeJS.ProcessEnv);
  const client = new KeygenClient(c, fakeFetch);
  const result = await client.listLicenses(10, 2);
  assert.deepEqual(result, { data: [] });
  assert.match(seenUrl, /\/v1\/accounts\/acct\/licenses/);
  assert.match(seenUrl, /limit=10/);
  assert.equal(seenAuth, 'Bearer secret');
});

test('client maps provider errors without leaking token', async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ errors: [{ detail: 'forbidden' }] }), { status: 403 });
  const c = loadConfig({ KEYGEN_ACCOUNT: 'acct', KEYGEN_TOKEN: 'secret-token' } as NodeJS.ProcessEnv);
  const client = new KeygenClient(c, fakeFetch);
  await assert.rejects(() => client.getLicense('11111111-1111-4111-8111-111111111111'), err => {
    assert.match(String(err), /forbidden/);
    assert.doesNotMatch(String(err), /secret-token/);
    return true;
  });
});
