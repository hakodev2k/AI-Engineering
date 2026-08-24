import { describe, expect, it, vi } from 'vitest';
import { ArgoCdClient, ArgoCdError } from '../src/client.js';
import { assertAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, TOOL_RISK } from '../src/policy.js';

const baseEnv = {
  ARGOCD_SERVER_URL: 'https://argocd.example.com',
  ARGOCD_TOKEN: 'test-token'
};

describe('configuration', () => {
  it('requires server URL and token', () => {
    expect(() => loadConfig({})).toThrow(/SERVER_URL/);
    expect(() => loadConfig({ ARGOCD_SERVER_URL: 'https://x.example' })).toThrow(/TOKEN/);
  });

  it('enforces HTTPS by default', () => {
    expect(() => loadConfig({ ARGOCD_SERVER_URL: 'http://argocd.local', ARGOCD_TOKEN: 'x' })).toThrow(/https/);
  });

  it('enforces project and application allowlists', () => {
    const cfg = loadConfig({ ...baseEnv, ARGOCD_ALLOWED_PROJECTS: 'prod,staging', ARGOCD_ALLOWED_APPLICATIONS: 'api,web' });
    expect(() => assertAllowed(cfg, 'api', 'prod')).not.toThrow();
    expect(() => assertAllowed(cfg, 'other', 'prod')).toThrow(/Application not allowed/);
    expect(() => assertAllowed(cfg, 'api', 'other')).toThrow(/Project not allowed/);
  });
});

describe('approval policy', () => {
  it('requires a valid approval for deployment sync', () => {
    const secret = 'unit-test-secret';
    const tool = 'argocd.application.sync';
    expect(TOOL_RISK[tool]).toBe('HIGH_RISK');
    expect(() => assertApproval(tool, undefined, secret)).toThrow(/explicit approval/);
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
  });
});

describe('client reliability', () => {
  it('maps permission errors without retrying', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('forbidden', { status: 403 }));
    const client = new ArgoCdClient(loadConfig(baseEnv), fetchMock);
    await expect(client.get('/api/v1/applications')).rejects.toBeInstanceOf(ArgoCdError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries rate-limited GET requests with a bound', async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('busy', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new ArgoCdClient(loadConfig({ ...baseEnv, ARGOCD_MAX_RETRIES: '1' }), fetchMock);
    await expect(client.get('/api/v1/applications')).resolves.toEqual({ items: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry POST deployment operations', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('busy', { status: 503 }));
    const client = new ArgoCdClient(loadConfig({ ...baseEnv, ARGOCD_MAX_RETRIES: '5' }), fetchMock);
    await expect(client.post('/api/v1/applications/api/sync', {})).rejects.toBeInstanceOf(ArgoCdError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('sends bearer auth without returning credentials', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (_input, init) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
      return new Response(JSON.stringify({ metadata: { name: 'api' } }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new ArgoCdClient(loadConfig(baseEnv), fetchMock);
    const result = await client.get<{ metadata: { name: string } }>('/api/v1/applications/api');
    expect(result.metadata.name).toBe('api');
    expect(JSON.stringify(result)).not.toContain('test-token');
  });
});
