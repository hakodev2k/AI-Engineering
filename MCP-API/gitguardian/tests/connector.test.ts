import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { GitGuardianClient, GitGuardianError } from '../src/client.js';

describe('configuration', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow(/GITGUARDIAN_API_KEY/));
  it('accepts only official API hosts', () => expect(() => loadConfig({ GITGUARDIAN_API_KEY: 'x', GITGUARDIAN_BASE_URL: 'https://evil.example/v1' })).toThrow(/official/));
});

describe('policy', () => {
  it('registers ten tool policies', () => expect(Object.keys(TOOL_POLICY)).toHaveLength(10));
  it('allows READ without approval', () => expect(() => assertApproval(loadConfig({ GITGUARDIAN_API_KEY: 'x' }), 'gitguardian.incident.get', '1')).not.toThrow());
  it('requires valid approval for WRITE', () => {
    const config = loadConfig({ GITGUARDIAN_API_KEY: 'x', GITGUARDIAN_APPROVAL_SECRET: 'secret' });
    expect(() => assertApproval(config, 'gitguardian.incident.note.create', '42')).toThrow(/approval/);
    const token = approvalDigest('secret', 'gitguardian.incident.note.create', '42');
    expect(() => assertApproval(config, 'gitguardian.incident.note.create', '42', token)).not.toThrow();
  });
});

describe('client', () => {
  const config = loadConfig({ GITGUARDIAN_API_KEY: 'token', GITGUARDIAN_MAX_RETRIES: '0' });
  it('isolates credentials in Authorization header', async () => {
    const fetchFn = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new GitGuardianClient(config, fetchFn as typeof fetch);
    await client.request('GET', '/teams');
    expect(fetchFn).toHaveBeenCalledOnce();
    expect((fetchFn.mock.calls[0][1]?.headers as Record<string,string>).Authorization).toBe('Token token');
  });
  it('maps API errors without leaking response bodies', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ detail: 'Invalid API key' }), { status: 401 }));
    const client = new GitGuardianClient(config, fetchFn as typeof fetch);
    await expect(client.request('GET', '/teams')).rejects.toBeInstanceOf(GitGuardianError);
  });
  it('does not retry write operations by default', async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 503 }));
    const client = new GitGuardianClient(config, fetchFn as typeof fetch);
    await expect(client.request('POST', '/incidents/secrets/1/notes', { body: { comment: 'x' } })).rejects.toBeInstanceOf(GitGuardianError);
    expect(fetchFn).toHaveBeenCalledOnce();
  });
});
