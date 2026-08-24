import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FireworksClient, FireworksApiError } from '../src/client.js';
import { approvalDigest, assertModelAllowed, loadConfig } from '../src/config.js';
import { assertApproval, TOOL_POLICIES } from '../src/policy.js';

const env = { FIREWORKS_API_KEY: 'unit-test-value', FIREWORKS_ACCOUNT_ID: 'acct' } as NodeJS.ProcessEnv;

describe('config', () => {
  it('requires API configuration', () => expect(() => loadConfig({})).toThrow('FIREWORKS_API_KEY is required'));
  it('enforces model allowlists', () => {
    const config = loadConfig({ ...env, FIREWORKS_ALLOWED_MODELS: 'model-a,model-b' });
    expect(() => assertModelAllowed(config, 'model-a')).not.toThrow();
    expect(() => assertModelAllowed(config, 'model-c')).toThrow('Model not allowed');
  });
  it('checks approvals for write tools', () => {
    const key = 'approval-test';
    const token = approvalDigest(key, 'fireworks.chat.create');
    expect(() => assertApproval('fireworks.chat.create', token, key)).not.toThrow();
    expect(() => assertApproval('fireworks.chat.create', '0'.repeat(64), key)).toThrow();
    expect(() => assertApproval('fireworks.model.list', undefined, undefined)).not.toThrow();
  });
  it('marks deployment creation high risk', () => {
    expect(TOOL_POLICIES['fireworks.deployment.create'].risk).toBe('HIGH_RISK');
  });
});

describe('client', () => {
  it('adds bearer authentication', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer unit-test-value');
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new FireworksClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.inferenceGet('/responses')).resolves.toEqual({ ok: true });
  });
  it('retries throttled GET requests within the configured bound', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response('busy', { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new FireworksClient(loadConfig({ ...env, FIREWORKS_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.platformGet('/accounts/acct/models')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('does not retry POST requests automatically', async () => {
    const fetchMock = vi.fn(async () => new Response('overloaded', { status: 503 }));
    const client = new FireworksClient(loadConfig({ ...env, FIREWORKS_MAX_RETRIES: '5' }), fetchMock as typeof fetch);
    await expect(client.inferencePost('/chat/completions', { model: 'm' })).rejects.toBeInstanceOf(FireworksApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('preserves retry-after on provider errors', async () => {
    const fetchMock = vi.fn(async () => new Response('too many', { status: 429, headers: { 'retry-after': '7' } }));
    const client = new FireworksClient(loadConfig({ ...env, FIREWORKS_MAX_RETRIES: '0' }), fetchMock as typeof fetch);
    await expect(client.inferenceGet('/responses')).rejects.toMatchObject({ status: 429, retryAfterSeconds: 7 });
  });
});

describe('tool registration', () => {
  it('matches the policy catalog', () => {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const source = fs.readFileSync(path.resolve(here, '../src/server.ts'), 'utf8');
    const registered = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(registered).toEqual(Object.keys(TOOL_POLICIES));
    expect(registered).toHaveLength(11);
  });
});
