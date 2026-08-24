import { describe, expect, it, vi } from 'vitest';
import crypto from 'node:crypto';
import { loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { QuickBooksTokenProvider } from '../src/auth.js';
import { QuickBooksClient, QuickBooksApiError } from '../src/client.js';
import { verifyQuickBooksWebhook } from '../src/webhook.js';

const baseEnv = {
  QUICKBOOKS_REALM_ID: '123456789',
  QUICKBOOKS_ACCESS_TOKEN: 'test-access-token',
  QUICKBOOKS_ENVIRONMENT: 'sandbox',
  QUICKBOOKS_TIMEOUT_MS: '5000',
  QUICKBOOKS_MAX_RETRIES: '0'
};

describe('configuration and policy', () => {
  it('loads a sandbox access-token configuration', () => {
    const config = loadConfig(baseEnv);
    expect(config.realmId).toBe('123456789');
    expect(config.environment).toBe('sandbox');
  });

  it('rejects missing credentials', () => {
    expect(() => loadConfig({ QUICKBOOKS_REALM_ID: '123' })).toThrow(/ACCESS_TOKEN|REFRESH_TOKEN/);
  });

  it('requires a valid write approval', () => {
    const secret = 'unit-test-secret';
    const tool = 'quickbooks.invoice.create';
    expect(() => assertApproval(tool, undefined, secret)).toThrow(/approval/i);
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
  });
});

describe('client', () => {
  it('adds bearer auth, realm and minorversion for reads', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      expect(url).toContain('/v3/company/123456789/customer/7');
      expect(url).toContain('minorversion=75');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-access-token');
      return new Response(JSON.stringify({ Customer: { Id: '7' } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    const config = loadConfig(baseEnv);
    const tokens = new QuickBooksTokenProvider(config, fetchMock as typeof fetch);
    const client = new QuickBooksClient(config, tokens, fetchMock as typeof fetch);
    const result = await client.get<{ Customer: { Id: string } }>('/customer/7');
    expect(result.Customer.Id).toBe('7');
  });

  it('does not retry POST failures', async () => {
    const fetchMock = vi.fn(async () => new Response('busy', { status: 503 }));
    const config = loadConfig({ ...baseEnv, QUICKBOOKS_MAX_RETRIES: '3' });
    const tokens = new QuickBooksTokenProvider(config, fetchMock as typeof fetch);
    const client = new QuickBooksClient(config, tokens, fetchMock as typeof fetch);
    await expect(client.post('/customer', { DisplayName: 'Example' })).rejects.toBeInstanceOf(QuickBooksApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('surfaces rate limit retry-after when retries are disabled', async () => {
    const fetchMock = vi.fn(async () => new Response('limited', { status: 429, headers: { 'retry-after': '7' } }));
    const config = loadConfig(baseEnv);
    const tokens = new QuickBooksTokenProvider(config, fetchMock as typeof fetch);
    const client = new QuickBooksClient(config, tokens, fetchMock as typeof fetch);
    try {
      await client.get('/companyinfo/123456789');
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(QuickBooksApiError);
      expect((error as QuickBooksApiError).retryAfter).toBe(7);
    }
  });
});

describe('webhook verification', () => {
  it('accepts the expected HMAC-SHA256 signature', () => {
    const body = JSON.stringify({ eventNotifications: [] });
    const verifier = 'verifier-token';
    const signature = crypto.createHmac('sha256', verifier).update(body).digest('base64');
    expect(verifyQuickBooksWebhook(body, signature, verifier)).toBe(true);
    expect(verifyQuickBooksWebhook(body + 'x', signature, verifier)).toBe(false);
  });
});
