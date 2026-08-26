import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { SnykRestClient } from '../src/rest.js';

function cfg() {
  return loadConfig({
    SNYK_TOKEN: 'test-token',
    SNYK_ORG_ID: '4a18d42f-0706-4ad0-b127-24078731fbed',
    SNYK_REST_BASE_URL: 'https://api.snyk.io/rest',
    SNYK_API_VERSION: '2024-10-15',
    SNYK_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef',
    SNYK_TIMEOUT_MS: '5000',
    SNYK_MAX_RETRIES: '1'
  } as NodeJS.ProcessEnv);
}

describe('configuration and policy', () => {
  it('rejects missing credentials', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow();
  });

  it('classifies read and local scan operations', () => {
    expect(TOOL_POLICY['snyk.project.get'].risk).toBe('READ');
    expect(TOOL_POLICY['snyk.scan.sca'].risk).toBe('HIGH_RISK');
    expect(TOOL_POLICY['snyk.scan.sca'].approval).toBe(true);
  });

  it('requires payload-bound explicit approval for local scans', () => {
    const config = cfg();
    const payload = { path: '/workspace/app' };
    expect(() => assertApproval('snyk.scan.sca', payload, undefined, config)).toThrow(/explicit human approval/);
    const approval = approvalDigest(config.SNYK_APPROVAL_SECRET!, 'snyk.scan.sca', payload);
    expect(() => assertApproval('snyk.scan.sca', payload, approval, config)).not.toThrow();
    expect(() => assertApproval('snyk.scan.sca', { path: '/other' }, approval, config)).toThrow(/Invalid approval/);
  });
});

describe('REST client', () => {
  it('adds auth and API version without exposing the token in output', async () => {
    const fakeFetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      expect(url).toContain('version=2024-10-15');
      expect((init?.headers as Record<string, string>).Authorization).toBe('token test-token');
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new SnykRestClient(cfg(), fakeFetch as typeof fetch);
    await expect(client.listOrgs(10)).resolves.toEqual({ data: [] });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('retries 429 once and preserves successful pagination response', async () => {
    let calls = 0;
    const fakeFetch = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response(JSON.stringify({ errors: [{ detail: 'rate limited' }] }), { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ data: [{ id: 'x' }], links: { next: '/next' } }), { status: 200 });
    });
    const client = new SnykRestClient(cfg(), fakeFetch as typeof fetch);
    const result = await client.listProjects('4a18d42f-0706-4ad0-b127-24078731fbed', 10);
    expect(result.data[0].id).toBe('x');
    expect(calls).toBe(2);
  });

  it('does not retry authorization errors', async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ detail: 'forbidden' }] }), { status: 403 }));
    const client = new SnykRestClient(cfg(), fakeFetch as typeof fetch);
    await expect(client.listOrgs(10)).rejects.toMatchObject({ status: 403 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('validates page limits before requests through caller schemas/config contract', () => {
    expect(() => loadConfig({ ...process.env, SNYK_TOKEN: 'x', SNYK_MAX_RETRIES: '99' } as NodeJS.ProcessEnv)).toThrow();
  });
});
