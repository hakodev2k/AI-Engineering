import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, assertTargetAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { AirtableError, AirtableRestClient } from '../src/rest.js';
import { AirtableMcpClient } from '../src/mcp.js';

const env = {
  AIRTABLE_TOKEN: 'pat-test',
  AIRTABLE_ALLOWED_BASES: 'appAllowed',
  AIRTABLE_ALLOWED_TABLES: 'appallowed/tasks',
  AIRTABLE_APPROVAL_SECRET: 'test-secret',
  AIRTABLE_USE_MCP: 'false',
  AIRTABLE_TIMEOUT_MS: '5000',
  AIRTABLE_MAX_RETRIES: '0'
};

describe('configuration and permissions', () => {
  it('requires a token', () => expect(() => loadConfig({})).toThrow(/AIRTABLE_TOKEN/));
  it('enforces allowed bases and tables', () => {
    const c = loadConfig(env);
    expect(() => assertTargetAllowed(c, 'appAllowed', 'Tasks')).not.toThrow();
    expect(() => assertTargetAllowed(c, 'appDenied', 'Tasks')).toThrow(/Base not allowed/);
    expect(() => assertTargetAllowed(c, 'appAllowed', 'Secrets')).toThrow(/Table not allowed/);
  });
  it('requires a valid approval digest for write tools', () => {
    const digest = approvalDigest('test-secret', 'airtable.record.create');
    expect(() => assertApproval('airtable.record.create', digest, 'test-secret')).not.toThrow();
    expect(() => assertApproval('airtable.record.create', '0'.repeat(64), 'test-secret')).toThrow(/Invalid approval/);
  });
});

describe('REST client', () => {
  it('sends bearer auth and returns JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer pat-test');
      return new Response(JSON.stringify({ records: [{ id: 'rec1' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new AirtableRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.get('/appAllowed/Tasks')).resolves.toEqual({ records: [{ id: 'rec1' }] });
  });

  it('does not retry permission failures', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: { type: 'AUTHENTICATION_REQUIRED' } }), { status: 403 }));
    const client = new AirtableRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.get('/meta/bases')).rejects.toBeInstanceOf(AirtableError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves Retry-After on a terminal rate-limit response', async () => {
    const fetchMock = vi.fn(async () => new Response('rate limited', { status: 429, headers: { 'retry-after': '30' } }));
    const client = new AirtableRestClient(loadConfig(env), fetchMock as typeof fetch);
    try {
      await client.get('/meta/bases');
      throw new Error('expected failure');
    } catch (e) {
      expect(e).toBeInstanceOf(AirtableError);
      expect((e as AirtableError).retryAfter).toBe(30);
    }
  });
});

describe('MCP fallback', () => {
  it('returns undefined without MCP credentials so callers can use REST', async () => {
    const client = new AirtableMcpClient(loadConfig(env));
    await expect(client.tryCall(['list_bases'], {})).resolves.toBeUndefined();
  });
});
