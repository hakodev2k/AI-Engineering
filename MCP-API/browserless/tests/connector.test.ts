import { describe, expect, it, vi } from 'vitest';
import { BrowserlessClient, BrowserlessError } from '../src/client.js';
import { assertPublicHttpUrl, requireApproval, POLICY } from '../src/security.js';

describe('security', () => {
  it('blocks local and private targets', () => {
    expect(() => assertPublicHttpUrl('http://127.0.0.1/admin')).toThrow();
    expect(() => assertPublicHttpUrl('http://10.0.0.1/')).toThrow();
    expect(assertPublicHttpUrl('https://example.com/')).toBe('https://example.com/');
  });
  it('requires approval for export', () => {
    expect(() => requireApproval('browserless.page.export', false)).toThrow(/approval/i);
    expect(() => requireApproval('browserless.page.export', true)).not.toThrow();
    expect(POLICY['browserless.page.content'].risk).toBe('READ');
  });
});

describe('client', () => {
  it('requires credentials', () => expect(() => new BrowserlessClient({ token: '' })).toThrow());
  it('rejects insecure base URLs', () => expect(() => new BrowserlessClient({ token: 'x', baseUrl: 'http://example.com' })).toThrow());
  it('returns JSON without exposing token in output', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const c = new BrowserlessClient({ token: 'secret', fetchImpl: f as typeof fetch });
    expect(await c.post('/content', { url: 'https://example.com' })).toEqual({ ok: true });
  });
  it('maps non-retryable API errors', async () => {
    const f = vi.fn(async () => new Response('bad auth', { status: 401 }));
    const c = new BrowserlessClient({ token: 'x', fetchImpl: f as typeof fetch });
    await expect(c.post('/content', {})).rejects.toBeInstanceOf(BrowserlessError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('retries throttling with bounded attempts', async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response('slow', { status: 429 })).mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const c = new BrowserlessClient({ token: 'x', fetchImpl: f as typeof fetch });
    await expect(c.post('/content', {})).resolves.toEqual({ ok: true });
    expect(f).toHaveBeenCalledTimes(2);
  });
});
