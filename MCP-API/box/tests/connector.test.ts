import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertApproved, TOOL_POLICY } from '../src/policy.js';
import { BoxClient, BoxError } from '../src/client.js';

describe('configuration and policy', () => {
  it('rejects missing credentials', () => {
    expect(() => loadConfig({})).toThrow(/BOX_ACCESS_TOKEN/);
  });

  it('requires approval for writes and disables destructive operations by default', () => {
    const cfg = loadConfig({ BOX_ACCESS_TOKEN: 'token', BOX_APPROVAL_SECRET: 'secret' });
    expect(() => assertApproved('box.folder.create', undefined, cfg)).toThrow(/explicit approval/);
    expect(() => assertApproved('box.folder.create', approvalDigest('secret', 'box.folder.create'), cfg)).not.toThrow();
    expect(() => assertApproved('box.webhook.delete', approvalDigest('secret', 'box.webhook.delete'), cfg)).toThrow(/disabled/);
  });

  it('defines a policy for every expected tool', () => {
    expect(Object.keys(TOOL_POLICY)).toHaveLength(12);
    expect(TOOL_POLICY['box.item.search'].risk).toBe('READ');
    expect(TOOL_POLICY['box.webhook.delete'].risk).toBe('DESTRUCTIVE');
  });
});

describe('BoxClient', () => {
  const config = loadConfig({ BOX_ACCESS_TOKEN: 'secret-token', BOX_MAX_RETRIES: '1', BOX_TIMEOUT_MS: '2000' });

  it('adds bearer auth and performs read operation', async () => {
    const f = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get('authorization')).toBe('Bearer secret-token');
      return new Response(JSON.stringify({ id: '123', type: 'file' }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new BoxClient(config, f);
    expect(await client.getFile('123')).toMatchObject({ id: '123' });
  });

  it('preserves rate-limit retry-after on non-retried write errors', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ code: 'rate_limit_exceeded' }), { status: 429, headers: { 'retry-after': '3' } })) as unknown as typeof fetch;
    const client = new BoxClient(config, f);
    await expect(client.createComment('123', 'hello')).rejects.toMatchObject({ status: 429, retryAfter: 3 });
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read failures', async () => {
    let calls = 0;
    const f = vi.fn(async () => {
      calls++;
      return calls === 1 ? new Response('temporary', { status: 500 }) : new Response(JSON.stringify({ entries: [] }), { status: 200 });
    }) as unknown as typeof fetch;
    const client = new BoxClient(config, f);
    await expect(client.listFolder('0')).resolves.toMatchObject({ entries: [] });
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('maps provider errors', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ code: 'invalid_grant' }), { status: 401 })) as unknown as typeof fetch;
    const client = new BoxClient(config, f);
    try {
      await client.getFile('123');
      throw new Error('expected failure');
    } catch (e) {
      expect(e).toBeInstanceOf(BoxError);
      expect((e as BoxError).status).toBe(401);
    }
  });
});
