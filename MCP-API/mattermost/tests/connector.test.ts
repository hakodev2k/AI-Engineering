import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';
import { MattermostRestClient, MattermostError } from '../src/rest.js';

describe('configuration and policy', () => {
  const env = { MATTERMOST_SERVER_URL: 'https://mm.example', MATTERMOST_ACCESS_TOKEN: 'token', MATTERMOST_APPROVAL_SECRET: 'secret' } as NodeJS.ProcessEnv;
  it('loads least-privilege runtime configuration without exposing credentials', () => {
    const cfg = loadConfig(env);
    expect(cfg.serverUrl).toBe('https://mm.example');
    expect(cfg.maxRetries).toBe(3);
  });
  it('rejects invalid URLs and missing tokens', () => {
    expect(() => loadConfig({ MATTERMOST_SERVER_URL: 'x', MATTERMOST_ACCESS_TOKEN: '' })).toThrow();
  });
  it('registers read/write/destructive policy classes', () => {
    expect(TOOL_POLICY['mattermost.post.get'].risk).toBe('READ');
    expect(TOOL_POLICY['mattermost.post.create'].risk).toBe('WRITE');
    expect(TOOL_POLICY['mattermost.post.delete'].risk).toBe('DESTRUCTIVE');
  });
  it('requires approval for writes', () => {
    const cfg = loadConfig(env);
    expect(() => assertAllowed('mattermost.post.create', undefined, cfg)).toThrow(/approval/);
    expect(() => assertAllowed('mattermost.post.create', approvalDigest('secret', 'mattermost.post.create'), cfg)).not.toThrow();
  });
  it('keeps destructive actions disabled by default', () => {
    const cfg = loadConfig(env);
    expect(() => assertAllowed('mattermost.post.delete', approvalDigest('secret', 'mattermost.post.delete'), cfg)).toThrow(/disabled/);
  });
});

describe('REST reliability', () => {
  const cfg = loadConfig({ MATTERMOST_SERVER_URL: 'https://mm.example', MATTERMOST_ACCESS_TOKEN: 'token', MATTERMOST_MAX_RETRIES: '1' });
  it('sends bearer auth and parses JSON', async () => {
    const f = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer token');
      return new Response(JSON.stringify({ id: 'u1' }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    expect(await new MattermostRestClient(cfg, f).me()).toEqual({ id: 'u1' });
  });
  it('retries bounded server failures', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response('busy', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'u1' }), { status: 200 })) as unknown as typeof fetch;
    expect(await new MattermostRestClient(cfg, f).me()).toEqual({ id: 'u1' });
    expect(f).toHaveBeenCalledTimes(2);
  });
  it('does not retry permission errors', async () => {
    const f = vi.fn().mockResolvedValue(new Response('forbidden', { status: 403 })) as unknown as typeof fetch;
    await expect(new MattermostRestClient(cfg, f).me()).rejects.toBeInstanceOf(MattermostError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('surfaces rate-limit retry-after when retries are disabled', async () => {
    const noRetry = loadConfig({ MATTERMOST_SERVER_URL: 'https://mm.example', MATTERMOST_ACCESS_TOKEN: 'token', MATTERMOST_MAX_RETRIES: '0' });
    const f = vi.fn().mockResolvedValue(new Response('limited', { status: 429, headers: { 'retry-after': '2' } })) as unknown as typeof fetch;
    await expect(new MattermostRestClient(noRetry, f).me()).rejects.toMatchObject({ status: 429, retryAfterMs: 2000 });
  });
});
