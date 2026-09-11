import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { requireApproval } from '../src/policy.js';
import { SematextClient, SematextError } from '../src/client.js';

const cfg = loadConfig({ SEMATEXT_API_KEY: 'test-key', SEMATEXT_REGION: 'us', SEMATEXT_TIMEOUT_MS: '5000', SEMATEXT_MAX_RETRIES: '1', SEMATEXT_REQUIRE_WRITE_APPROVAL: 'true' });

describe('config', () => {
  it('selects US endpoints and keeps credentials inside config', () => {
    expect(cfg.syntheticsBaseUrl).toContain('apps.sematext.com');
    expect(cfg.logsSearchBaseUrl).toContain('logsene-search.sematext.com');
  });
  it('rejects missing API key', () => expect(() => loadConfig({ SEMATEXT_REGION: 'us' })).toThrow());
});

describe('approval policy', () => {
  it('allows READ without approval', () => expect(() => requireApproval('READ', undefined, true)).not.toThrow());
  it('blocks WRITE by default', () => expect(() => requireApproval('WRITE', false, true)).toThrow(/approval/i));
  it('allows explicitly approved WRITE', () => expect(() => requireApproval('WRITE', true, true)).not.toThrow());
  it('always blocks destructive category', () => expect(() => requireApproval('DESTRUCTIVE', true, true)).toThrow(/not implemented/i));
});

describe('client', () => {
  it('sends API key in Authorization header and parses a read result', async () => {
    const f = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ success: true, data: { apps: [] } }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new SematextClient(cfg, f as any);
    await expect(client.listApps()).resolves.toMatchObject({ success: true });
    expect(f.mock.calls[0][1].headers.Authorization).toBe('apiKey test-key');
  });
  it('maps provider auth errors without retrying them', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }));
    const client = new SematextClient(cfg, f as any);
    await expect(client.listApps()).rejects.toBeInstanceOf(SematextError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('preserves Retry-After on throttling after bounded retry', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ message: 'slow down' }), { status: 429, headers: { 'retry-after': '1' } }));
    const client = new SematextClient({ ...cfg, maxRetries: 0 }, f as any);
    await expect(client.listApps()).rejects.toMatchObject({ status: 429, retryAfter: 1 });
  });
  it('does not blindly retry write operations', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ message: 'server error' }), { status: 503 }));
    const client = new SematextClient(cfg, f as any);
    await expect(client.runMonitors(1, [{ monitorId: 2, regions: [1] }])).rejects.toBeInstanceOf(SematextError);
    expect(f).toHaveBeenCalledTimes(1);
  });
});
