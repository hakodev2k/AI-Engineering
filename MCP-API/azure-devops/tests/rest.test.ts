import { describe, expect, it, vi } from 'vitest';
import { AzureDevOpsConfig } from '../src/config.js';
import { AzureDevOpsHttpError, AzureDevOpsRestClient } from '../src/rest.js';

const config: AzureDevOpsConfig = {
  organization: 'contoso', authMode: 'entra', bearerToken: 'fake', patEmail: 'x',
  allowedProjects: new Set(), allowedRepositories: new Set(), timeoutMs: 5000,
  maxRetries: 1, mcpEnabled: false
};

function response(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
}

describe('AzureDevOpsRestClient', () => {
  it('sends bearer credentials without exposing them in the URL', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer fake');
      return response({ value: [] });
    });
    const client = new AzureDevOpsRestClient(config, fetchMock as typeof fetch);
    await client.listProjects(10);
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).not.toContain('fake');
    expect(url).toContain('%24top=10');
  });

  it('retries bounded read throttling using Retry-After', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ message: 'busy' }, 429, { 'retry-after': '0' }))
      .mockResolvedValueOnce(response({ value: [{ id: '1' }] }));
    const client = new AzureDevOpsRestClient(config, fetchMock as typeof fetch);
    const result: any = await client.listProjects(1);
    expect(result.value).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry write failures', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ message: 'server failure' }, 500));
    const client = new AzureDevOpsRestClient(config, fetchMock as typeof fetch);
    await expect(client.createPullRequest('p', 'r', { title: 't', sourceRefName: 'refs/heads/a', targetRefName: 'refs/heads/main' })).rejects.toBeInstanceOf(AzureDevOpsHttpError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('uses Basic auth for PAT mode', async () => {
    const patConfig = { ...config, authMode: 'pat' as const, bearerToken: undefined, pat: 'secret-pat', patEmail: 'svc@example.invalid' };
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      const expected = Buffer.from('svc@example.invalid:secret-pat').toString('base64');
      expect(new Headers(init?.headers).get('authorization')).toBe(`Basic ${expected}`);
      return response({ value: [] });
    });
    await new AzureDevOpsRestClient(patConfig, fetchMock as typeof fetch).listProjects();
  });
});
