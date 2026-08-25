import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { MailchimpClient, MailchimpError } from '../src/client.js';
import { assertApproval, createApprovalToken, subscriberHash, TOOL_POLICY } from '../src/security.js';

const baseConfig = {
  baseUrl: 'https://us1.api.mailchimp.com/3.0',
  apiKey: 'test-key-us1',
  timeoutMs: 5000,
  maxRetries: 2,
  approvalSecret: '01234567890123456789012345678901'
};

describe('configuration', () => {
  it('accepts API key authentication', () => {
    const cfg = loadConfig({ MAILCHIMP_API_KEY: 'abc-us1', MAILCHIMP_SERVER_PREFIX: 'us1' });
    expect(cfg.baseUrl).toBe('https://us1.api.mailchimp.com/3.0');
    expect(cfg.apiKey).toBe('abc-us1');
  });

  it('accepts OAuth access-token authentication', () => {
    const cfg = loadConfig({ MAILCHIMP_OAUTH_ACCESS_TOKEN: 'oauth', MAILCHIMP_SERVER_PREFIX: 'us20' });
    expect(cfg.oauthToken).toBe('oauth');
  });

  it('rejects missing credentials and unsafe server prefixes', () => {
    expect(() => loadConfig({ MAILCHIMP_SERVER_PREFIX: 'us1' })).toThrow();
    expect(() => loadConfig({ MAILCHIMP_API_KEY: 'x', MAILCHIMP_SERVER_PREFIX: 'evil.example.com' })).toThrow();
  });
});

describe('security and permissions', () => {
  it('normalizes and hashes subscriber email locally', () => {
    expect(subscriberHash(' User@Example.COM ')).toBe(subscriberHash('user@example.com'));
    expect(subscriberHash('user@example.com')).toHaveLength(32);
  });

  it('binds approval to the exact tool and arguments', () => {
    const args = { audienceId: 'list1', email: 'a@example.com', statusIfNew: 'subscribed' };
    const token = createApprovalToken(baseConfig.approvalSecret, 'mailchimp.member.upsert', args);
    expect(() => assertApproval('mailchimp.member.upsert', { ...args, approvalToken: token }, baseConfig.approvalSecret)).not.toThrow();
    expect(() => assertApproval('mailchimp.member.upsert', { ...args, email: 'b@example.com', approvalToken: token }, baseConfig.approvalSecret)).toThrow(/Invalid approval/);
  });

  it('requires approval for send and archive but not reads', () => {
    expect(TOOL_POLICY['mailchimp.campaign.send']).toEqual({ risk: 'HIGH_RISK', approvalRequired: true });
    expect(TOOL_POLICY['mailchimp.member.archive']).toEqual({ risk: 'DESTRUCTIVE', approvalRequired: true });
    expect(() => assertApproval('mailchimp.audience.list', {}, undefined)).not.toThrow();
    expect(() => assertApproval('mailchimp.campaign.send', { campaignId: 'c1' }, baseConfig.approvalSecret)).toThrow(/explicit approval/);
  });
});

describe('MailchimpClient reliability', () => {
  it('uses Basic auth without exposing the API key in the URL', async () => {
    const mockFetch = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      expect(String(input)).toBe('https://us1.api.mailchimp.com/3.0/ping');
      expect(String(input)).not.toContain('test-key-us1');
      expect((init?.headers as Record<string, string>).Authorization).toMatch(/^Basic /);
      return new Response(JSON.stringify({ health_status: "Everything's Chimpy!" }), { status: 200 });
    });
    const client = new MailchimpClient(baseConfig, mockFetch as typeof fetch);
    await expect(client.request('GET', '/ping')).resolves.toMatchObject({ health_status: "Everything's Chimpy!" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries GET on 429 with bounded attempts', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'throttled' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ lists: [] }), { status: 200 }));
    const client = new MailchimpClient(baseConfig, mockFetch as typeof fetch);
    await expect(client.request('GET', '/lists')).resolves.toEqual({ lists: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry writes', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: 'server error' }), { status: 500 }));
    const client = new MailchimpClient(baseConfig, mockFetch as typeof fetch);
    await expect(client.request('POST', '/campaigns', { body: {} })).rejects.toBeInstanceOf(MailchimpError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('maps authentication failures without retrying', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: 'API Key Invalid' }), { status: 401 }));
    const client = new MailchimpClient(baseConfig, mockFetch as typeof fetch);
    await expect(client.request('GET', '/')).rejects.toMatchObject({ status: 401 });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
