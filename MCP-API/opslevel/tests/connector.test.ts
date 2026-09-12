import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { requireApproval } from '../src/policy.js';
import { OpsLevelClient, OpsLevelError } from '../src/client.js';

describe('config and policy', () => {
  it('requires a token', () => expect(() => loadConfig({})).toThrow('OPSLEVEL_API_TOKEN'));
  it('rejects unsafe endpoints', () => expect(() => loadConfig({ OPSLEVEL_API_TOKEN: 'x', OPSLEVEL_GRAPHQL_URL: 'http://evil.test/graphql' })).toThrow('HTTPS'));
  it('requires both runtime gate and call approval for writes', () => {
    const cfg = loadConfig({ OPSLEVEL_API_TOKEN: 'x', OPSLEVEL_WRITE_APPROVED: 'false' });
    expect(() => requireApproval(cfg, 'opslevel.service.create', true)).toThrow('explicit human approval');
    expect(() => requireApproval({ ...cfg, writeApproved: true }, 'opslevel.service.create', false)).toThrow('explicit human approval');
    expect(() => requireApproval({ ...cfg, writeApproved: true }, 'opslevel.service.create', true)).not.toThrow();
  });
});

describe('client', () => {
  const cfg = loadConfig({ OPSLEVEL_API_TOKEN: 'secret', OPSLEVEL_MAX_RETRIES: '0' });
  it('sends bearer auth and returns data', async () => {
    const fake = vi.fn(async (_u: any, init: any) => {
      expect(init.headers.Authorization).toBe('Bearer secret');
      return new Response(JSON.stringify({ data: { ok: true } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }) as any;
    expect(await new OpsLevelClient(cfg, fake).query('query { x }')).toEqual({ ok: true });
  });
  it('maps invalid credentials', async () => {
    const fake = vi.fn(async () => new Response('{}', { status: 401 })) as any;
    await expect(new OpsLevelClient(cfg, fake).query('query { x }')).rejects.toMatchObject({ code: 'AUTHENTICATION_FAILED' });
  });
  it('preserves rate-limit retry delay', async () => {
    const fake = vi.fn(async () => new Response('{}', { status: 429, headers: { 'RateLimit-Retry-After': '3' } })) as any;
    try { await new OpsLevelClient(cfg, fake).query('query { x }'); throw new Error('expected error'); }
    catch (e) { expect(e).toBeInstanceOf(OpsLevelError); expect((e as OpsLevelError).retryAfterMs).toBe(3000); }
  });
  it('maps GraphQL errors', async () => {
    const fake = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'bad query' }] }), { status: 200, headers: { 'Content-Type': 'application/json' } })) as any;
    await expect(new OpsLevelClient(cfg, fake).query('query { x }')).rejects.toMatchObject({ code: 'GRAPHQL_ERROR' });
  });
});
