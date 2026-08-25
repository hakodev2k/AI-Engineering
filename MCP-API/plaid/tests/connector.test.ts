import { afterEach, describe, expect, it } from 'vitest';
import { approvalDigest, loadConfig, type Config } from '../src/config.js';
import { PlaidClient, PlaidError } from '../src/client.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; });

function config(overrides: Partial<Config> = {}): Config {
  return {
    clientId: 'client-id',
    secret: 'secret',
    env: 'sandbox',
    baseUrl: 'https://sandbox.plaid.com',
    timeoutMs: 1000,
    maxRetries: 1,
    requireWriteApproval: true,
    approvalSecret: 'approval-secret',
    ...overrides
  };
}

describe('configuration', () => {
  it('requires credentials', () => {
    delete process.env.PLAID_CLIENT_ID;
    delete process.env.PLAID_SECRET;
    expect(() => loadConfig()).toThrow(/required/);
  });

  it('uses sandbox by default and bounds retry settings', () => {
    process.env.PLAID_CLIENT_ID = 'id';
    process.env.PLAID_SECRET = 'secret';
    process.env.PLAID_MAX_RETRIES = '6';
    expect(() => loadConfig()).toThrow(/PLAID_MAX_RETRIES/);
  });
});

describe('tool policy', () => {
  it('classifies sensitive auth as high risk', () => {
    expect(TOOL_POLICY['plaid.auth.get']).toEqual({ risk: 'HIGH_RISK', approval: true });
  });

  it('denies missing approval and accepts exact scoped approval', () => {
    const cfg = config();
    const payload = { access_token: '[REDACTED]' };
    expect(() => assertApproval(cfg, 'plaid.auth.get', payload)).toThrow(/explicit approval/);
    const id = approvalDigest(cfg.approvalSecret!, 'plaid.auth.get', payload);
    expect(() => assertApproval(cfg, 'plaid.auth.get', payload, id)).not.toThrow();
    expect(() => assertApproval(cfg, 'plaid.transactions.refresh', payload, id)).toThrow(/Invalid approval/);
  });
});

describe('PlaidClient', () => {
  it('injects credentials internally without returning them', async () => {
    const fakeFetch: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      expect(body.client_id).toBe('client-id');
      expect(body.secret).toBe('secret');
      expect(body.access_token).toBe('access-token');
      return new Response(JSON.stringify({ accounts: [{ account_id: 'a1' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const value = await new PlaidClient(config(), fakeFetch).post<any>('/accounts/get', { access_token: 'access-token' });
    expect(value.accounts[0].account_id).toBe('a1');
    expect(JSON.stringify(value)).not.toContain('client-id');
  });

  it('maps application errors', async () => {
    const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ error_type: 'INVALID_INPUT', error_code: 'INVALID_ACCESS_TOKEN', error_message: 'bad token', request_id: 'req1' }), { status: 400, headers: { 'content-type': 'application/json' } });
    await expect(new PlaidClient(config({ maxRetries: 0 }), fakeFetch).post('/accounts/get', {})).rejects.toMatchObject<PlaidError>({ errorType: 'INVALID_INPUT', errorCode: 'INVALID_ACCESS_TOKEN', requestId: 'req1' });
  });

  it('honors Retry-After and retries bounded rate limits', async () => {
    let calls = 0;
    const fakeFetch: typeof fetch = async () => {
      calls++;
      if (calls === 1) return new Response(JSON.stringify({ error_type: 'RATE_LIMIT_EXCEEDED', error_code: 'RATE_LIMIT' }), { status: 429, headers: { 'retry-after': '0', 'content-type': 'application/json' } });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const value = await new PlaidClient(config({ maxRetries: 1 }), fakeFetch).post<any>('/item/get', {});
    expect(value.ok).toBe(true);
    expect(calls).toBe(2);
  });

  it('does not retry execution when retrySafe is false', async () => {
    let calls = 0;
    const fakeFetch: typeof fetch = async () => {
      calls++;
      return new Response(JSON.stringify({ error_type: 'RATE_LIMIT_EXCEEDED', error_code: 'RATE_LIMIT' }), { status: 429, headers: { 'content-type': 'application/json' } });
    };
    await expect(new PlaidClient(config({ maxRetries: 5 }), fakeFetch).post('/transactions/refresh', {}, undefined, false)).rejects.toBeInstanceOf(PlaidError);
    expect(calls).toBe(1);
  });
});
