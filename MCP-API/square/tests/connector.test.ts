import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { approvalToken, EnvironmentCredentialProvider } from '../src/auth.js';
import { enforcePolicy, TOOL_POLICY } from '../src/policy.js';
import { SquareApiError, SquareClient } from '../src/client.js';

describe('configuration', () => {
  it('requires a credential and validates environment', () => {
    expect(() => loadConfig({})).toThrow(/SQUARE_ACCESS_TOKEN/);
    expect(() => loadConfig({ SQUARE_ACCESS_TOKEN: 'x', SQUARE_ENVIRONMENT: 'bad' })).toThrow(/sandbox or production/);
  });

  it('defaults to sandbox and bounded retries', () => {
    const c = loadConfig({ SQUARE_ACCESS_TOKEN: 'secret' });
    expect(c.environment).toBe('sandbox');
    expect(c.maxRetries).toBe(3);
    expect(c.requireWriteApproval).toBe(true);
  });
});

describe('permission policy', () => {
  const config = loadConfig({ SQUARE_ACCESS_TOKEN: 'secret', SQUARE_APPROVAL_SECRET: 'approval-secret' });

  it('classifies read, write and high-risk tools', () => {
    expect(TOOL_POLICY['square.payment.get'].risk).toBe('READ');
    expect(TOOL_POLICY['square.customer.create'].risk).toBe('WRITE');
    expect(TOOL_POLICY['square.refund.create'].risk).toBe('HIGH_RISK');
  });

  it('allows reads and denies unapproved writes', () => {
    expect(() => enforcePolicy(config, 'square.payment.get', { paymentId: 'p' })).not.toThrow();
    expect(() => enforcePolicy(config, 'square.customer.create', { givenName: 'A' })).toThrow(/explicit approval/);
  });

  it('accepts an exact payload-bound approval and rejects a changed payload', () => {
    const payload = { givenName: 'Ada' };
    const token = approvalToken('approval-secret', 'square.customer.create', payload);
    expect(() => enforcePolicy(config, 'square.customer.create', payload, token)).not.toThrow();
    expect(() => enforcePolicy(config, 'square.customer.create', { givenName: 'Grace' }, token)).toThrow(/Invalid approval/);
  });

  it('always requires approval for financial refunds', () => {
    const relaxed = { ...config, requireWriteApproval: false };
    expect(() => enforcePolicy(relaxed, 'square.refund.create', { paymentId: 'p', amount: 10, currency: 'USD' })).toThrow(/explicit approval/);
  });
});

describe('Square REST client', () => {
  const config = loadConfig({ SQUARE_ACCESS_TOKEN: 'secret', SQUARE_MAX_RETRIES: '0' });

  it('keeps credentials in the connector layer and sends required Square headers', async () => {
    const fakeFetch = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer secret');
      expect((init?.headers as Record<string,string>)['Square-Version']).toBe('2026-08-19');
      return new Response(JSON.stringify({ locations: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new SquareClient(config, new EnvironmentCredentialProvider(config), fakeFetch);
    await expect(client.request('GET', '/locations')).resolves.toEqual({ locations: [] });
  });

  it('maps API errors without retrying permission failures', async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ code: 'INSUFFICIENT_SCOPES', detail: 'Missing scope' }] }), { status: 403 })) as unknown as typeof fetch;
    const client = new SquareClient(config, new EnvironmentCredentialProvider(config), fakeFetch);
    await expect(client.request('GET', '/locations')).rejects.toMatchObject({ status: 403, code: 'INSUFFICIENT_SCOPES' } satisfies Partial<SquareApiError>);
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('surfaces rate-limit retry metadata when retries are disabled', async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ code: 'RATE_LIMITED', detail: 'Slow down' }] }), { status: 429, headers: { 'retry-after': '2' } })) as unknown as typeof fetch;
    const client = new SquareClient(config, new EnvironmentCredentialProvider(config), fakeFetch);
    await expect(client.request('GET', '/payments')).rejects.toMatchObject({ status: 429, code: 'RATE_LIMITED', retryAfter: '2' });
  });

  it('does not blindly retry non-idempotent writes', async () => {
    const retryConfig = loadConfig({ SQUARE_ACCESS_TOKEN: 'secret', SQUARE_MAX_RETRIES: '3' });
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ code: 'INTERNAL_SERVER_ERROR' }] }), { status: 500 })) as unknown as typeof fetch;
    const client = new SquareClient(retryConfig, new EnvironmentCredentialProvider(retryConfig), fakeFetch);
    await expect(client.request('POST', '/customers', { body: { given_name: 'A' } })).rejects.toBeInstanceOf(SquareApiError);
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });
});
