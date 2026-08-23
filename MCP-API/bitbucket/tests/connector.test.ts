import { describe, expect, it, vi } from 'vitest';
import { BitbucketClient } from '../src/client.js';
import { approvalDigest, assertTargetAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';

const baseEnv = {
  BITBUCKET_AUTH_MODE: 'api-token',
  BITBUCKET_EMAIL: 'agent@example.com',
  BITBUCKET_API_TOKEN: 'token-value',
  BITBUCKET_APPROVAL_SECRET: 'approval-secret',
  BITBUCKET_ALLOWED_WORKSPACES: 'acme',
  BITBUCKET_ALLOWED_REPOSITORIES: 'acme/platform',
  BITBUCKET_MAX_RETRIES: '1',
  BITBUCKET_TIMEOUT_MS: '5000',
  BITBUCKET_PREFER_MCP: 'false'
};

describe('configuration and policy', () => {
  it('loads least-privilege target allowlists', () => {
    const config = loadConfig(baseEnv);
    expect(config.authMode).toBe('api-token');
    expect(() => assertTargetAllowed(config, 'acme', 'platform')).not.toThrow();
    expect(() => assertTargetAllowed(config, 'other', 'platform')).toThrow(/Workspace not allowed/);
    expect(() => assertTargetAllowed(config, 'acme', 'secret')).toThrow(/Repository not allowed/);
  });

  it('requires approval for writes and accepts a valid scoped digest', () => {
    const digest = approvalDigest('approval-secret', 'bitbucket.pull_request.create');
    expect(() => assertApproval('bitbucket.pull_request.create', undefined, 'approval-secret')).toThrow(/approval/i);
    expect(() => assertApproval('bitbucket.pull_request.create', digest, 'approval-secret')).not.toThrow();
    expect(() => assertApproval('bitbucket.repository.get', undefined, undefined)).not.toThrow();
  });

  it('rejects incomplete authentication configuration', () => {
    expect(() => loadConfig({ BITBUCKET_AUTH_MODE: 'api-token', BITBUCKET_EMAIL: 'x@example.com' })).toThrow(/API_TOKEN/);
  });
});

describe('REST client', () => {
  it('uses API-token basic auth without exposing credentials in request URL', async () => {
    const mock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: `Basic ${Buffer.from('agent@example.com:token-value').toString('base64')}` });
      return new Response(JSON.stringify({ uuid: '{repo}' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new BitbucketClient(loadConfig(baseEnv), mock as typeof fetch);
    await expect(client.get('/repositories/acme/platform')).resolves.toEqual({ uuid: '{repo}' });
    expect(String(mock.mock.calls[0][0])).not.toContain('token-value');
  });

  it('retries throttling once and then succeeds', async () => {
    let calls = 0;
    const mock = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ values: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new BitbucketClient(loadConfig(baseEnv), mock as typeof fetch);
    await expect(client.get('/repositories/acme')).resolves.toEqual({ values: [] });
    expect(calls).toBe(2);
  });

  it('does not retry permission errors', async () => {
    let calls = 0;
    const mock = vi.fn(async () => { calls++; return new Response('forbidden', { status: 403 }); });
    const client = new BitbucketClient(loadConfig(baseEnv), mock as typeof fetch);
    await expect(client.get('/repositories/acme/platform')).rejects.toThrow(/403/);
    expect(calls).toBe(1);
  });
});
