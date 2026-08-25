import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertPolicy, TOOL_POLICY } from '../src/policy.js';
import { SendGridClient, SendGridError } from '../src/client.js';
import { buildServer } from '../src/server.js';

const baseConfig = {
  apiKey: 'SG.test',
  baseUrl: 'https://api.sendgrid.com',
  timeoutMs: 1000,
  maxRetries: 0,
  approvalSecret: 'secret',
  allowWrites: true,
  allowHighRisk: true
};

describe('configuration', () => {
  it('requires an API key', () => {
    expect(() => loadConfig({})).toThrow(/SENDGRID_API_KEY/);
  });

  it('selects EU API base URL when requested', () => {
    const cfg = loadConfig({ SENDGRID_API_KEY: 'x', SENDGRID_REGION: 'eu' });
    expect(cfg.baseUrl).toBe('https://api.eu.sendgrid.com');
  });
});

describe('policy', () => {
  it('registers read/write/high-risk classifications', () => {
    expect(TOOL_POLICY['sendgrid.account.scopes.get'].risk).toBe('READ');
    expect(TOOL_POLICY['sendgrid.template.create'].risk).toBe('WRITE');
    expect(TOOL_POLICY['sendgrid.email.send'].risk).toBe('HIGH_RISK');
  });

  it('denies writes when disabled', () => {
    const cfg = { ...baseConfig, allowWrites: false };
    expect(() => assertPolicy(cfg, 'sendgrid.template.create', { name: 'x' }, 'bad')).toThrow(/disabled/);
  });

  it('requires payload-bound approval', () => {
    const payload = { name: 'Welcome', generation: 'dynamic' };
    const token = approvalDigest('secret', 'sendgrid.template.create', payload);
    expect(() => assertPolicy(baseConfig, 'sendgrid.template.create', payload, token)).not.toThrow();
    expect(() => assertPolicy(baseConfig, 'sendgrid.template.create', { ...payload, name: 'Changed' }, token)).toThrow(/Invalid approval/);
  });
});

describe('client', () => {
  it('keeps credentials inside Authorization header and parses JSON', async () => {
    const fake = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer SG.test');
      return new Response(JSON.stringify({ scopes: ['mail.send'] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new SendGridClient(baseConfig, fake);
    await expect(client.request('GET', '/v3/scopes')).resolves.toEqual({ scopes: ['mail.send'] });
  });

  it('maps provider errors', async () => {
    const fake = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'forbidden' }] }), { status: 403 })) as unknown as typeof fetch;
    const client = new SendGridClient(baseConfig, fake);
    await expect(client.request('GET', '/v3/scopes')).rejects.toMatchObject({ status: 403, message: 'forbidden' });
  });

  it('exposes reset delay on rate limits without unbounded retries', async () => {
    const now = Math.floor(Date.now() / 1000);
    const fake = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'too many requests' }] }), {
      status: 429,
      headers: { 'x-ratelimit-reset': String(now + 2) }
    })) as unknown as typeof fetch;
    const client = new SendGridClient(baseConfig, fake);
    try {
      await client.request('GET', '/v3/scopes');
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(SendGridError);
      expect((error as SendGridError).status).toBe(429);
      expect((error as SendGridError).retryAfter).toBeGreaterThanOrEqual(0);
    }
    expect(fake).toHaveBeenCalledTimes(1);
  });
});

describe('server', () => {
  it('constructs without live credentials or network access', () => {
    const fakeClient = { request: vi.fn() } as unknown as SendGridClient;
    expect(buildServer(baseConfig, fakeClient)).toBeTruthy();
  });
});
