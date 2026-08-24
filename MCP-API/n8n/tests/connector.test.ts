import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertProjectAllowed, assertWorkflowAllowed } from '../src/config.js';
import { assertApproval, expectedApproval } from '../src/policy.js';
import { N8nRestClient, N8nApiError } from '../src/rest-client.js';

const env = {
  N8N_BASE_URL: 'https://example.app.n8n.cloud',
  N8N_API_KEY: 'test-key',
  N8N_ENABLE_MCP: 'false',
  N8N_ALLOWED_PROJECT_IDS: 'p1,p2',
  N8N_ALLOWED_WORKFLOW_IDS: 'w1,w2',
  N8N_APPROVAL_SECRET: 'approval-secret',
  N8N_TIMEOUT_MS: '5000',
  N8N_MAX_RETRIES: '1'
};

describe('configuration and policy', () => {
  it('requires API key', () => expect(() => loadConfig({ N8N_BASE_URL: env.N8N_BASE_URL })).toThrow(/N8N_API_KEY/));
  it('rejects insecure remote base URL', () => expect(() => loadConfig({ ...env, N8N_BASE_URL: 'http://example.com' })).toThrow(/HTTPS/));
  it('enforces project and workflow allowlists', () => {
    const c = loadConfig(env);
    expect(() => assertProjectAllowed(c, 'p3')).toThrow(/not allowed/);
    expect(() => assertWorkflowAllowed(c, 'w3')).toThrow(/not allowed/);
    expect(() => assertProjectAllowed(c, 'p1')).not.toThrow();
  });
  it('requires a valid approval for writes', () => {
    const token = expectedApproval(env.N8N_APPROVAL_SECRET, 'n8n.workflow.create');
    expect(() => assertApproval('n8n.workflow.create', token, env.N8N_APPROVAL_SECRET)).not.toThrow();
    expect(() => assertApproval('n8n.workflow.create', '0'.repeat(64), env.N8N_APPROVAL_SECRET)).toThrow(/Invalid approval/);
    expect(() => assertApproval('n8n.workflow.get', undefined, undefined)).not.toThrow();
  });
});

describe('REST client', () => {
  it('sends the API key without exposing it in the body', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('X-N8N-API-KEY')).toBe('test-key');
      expect(init?.body).toBeUndefined();
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new N8nRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.get('/workflows')).resolves.toEqual({ data: [] });
  });

  it('retries bounded GET throttling and preserves success', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new N8nRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.get('/executions')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry writes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('server error', { status: 500 }));
    const client = new N8nRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.post('/workflows', { name: 'x' })).rejects.toBeInstanceOf(N8nApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
