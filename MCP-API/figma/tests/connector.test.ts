import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertFileAllowed, approvalDigest } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { FigmaApiError, FigmaClient } from '../src/client.js';

function config(overrides: Record<string, string> = {}) {
  return loadConfig({
    FIGMA_AUTH_MODE: 'oauth',
    FIGMA_ACCESS_TOKEN: 'test-token',
    FIGMA_TIMEOUT_MS: '1000',
    FIGMA_MAX_RETRIES: '0',
    ...overrides
  });
}

describe('configuration and policy', () => {
  it('requires credentials', () => {
    expect(() => loadConfig({ FIGMA_AUTH_MODE: 'oauth' })).toThrow(/FIGMA_ACCESS_TOKEN/);
    expect(() => loadConfig({ FIGMA_AUTH_MODE: 'token' })).toThrow(/FIGMA_TOKEN/);
  });

  it('enforces file allowlists', () => {
    const c = config({ FIGMA_ALLOWED_FILE_KEYS: 'abc123,def456' });
    expect(() => assertFileAllowed(c, 'abc123')).not.toThrow();
    expect(() => assertFileAllowed(c, 'zzz999')).toThrow(/not allowed/);
  });

  it('requires valid approval for writes', () => {
    const secret = 'approval-secret';
    expect(() => assertApproval('figma.comment.create', undefined, secret)).toThrow(/approval/i);
    const approval = approvalDigest(secret, 'figma.comment.create');
    expect(() => assertApproval('figma.comment.create', approval, secret)).not.toThrow();
    expect(() => assertApproval('figma.file.get', undefined, undefined)).not.toThrow();
  });
});

describe('FigmaClient', () => {
  it('uses OAuth bearer auth and serializes query parameters', async () => {
    const fetchMock = vi.fn(async (url: URL | RequestInfo, init?: RequestInit) => {
      expect(String(url)).toContain('/v1/files/abc123?depth=2');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
      return new Response(JSON.stringify({ name: 'Demo' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new FigmaClient(config(), fetchMock as typeof fetch);
    await expect(client.get('/v1/files/abc123', { depth: 2 })).resolves.toEqual({ name: 'Demo' });
  });

  it('uses X-Figma-Token for personal or plan tokens', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)['X-Figma-Token']).toBe('pat-token');
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const c = loadConfig({ FIGMA_AUTH_MODE: 'token', FIGMA_TOKEN: 'pat-token', FIGMA_MAX_RETRIES: '0', FIGMA_TIMEOUT_MS: '1000' });
    await new FigmaClient(c, fetchMock as typeof fetch).get('/v1/files/abc123');
  });

  it('maps API errors without retrying authorization failures', async () => {
    const fetchMock = vi.fn(async () => new Response('forbidden', { status: 403 }));
    const client = new FigmaClient(config({ FIGMA_MAX_RETRIES: '3' }), fetchMock as typeof fetch);
    await expect(client.get('/v1/files/abc123')).rejects.toBeInstanceOf(FigmaApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries bounded GET throttling using Retry-After', async () => {
    let count = 0;
    const fetchMock = vi.fn(async () => {
      count += 1;
      if (count === 1) return new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const client = new FigmaClient(config({ FIGMA_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.get('/v1/files/abc123')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry write calls blindly', async () => {
    const fetchMock = vi.fn(async () => new Response('server error', { status: 500 }));
    const client = new FigmaClient(config({ FIGMA_MAX_RETRIES: '3' }), fetchMock as typeof fetch);
    await expect(client.post('/v1/files/abc123/comments', { message: 'x' })).rejects.toBeInstanceOf(FigmaApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
