import { describe, expect, it, vi } from 'vitest';
import { CanvaCredentialProvider } from '../src/auth.js';
import type { CanvaConfig } from '../src/config.js';

const config: CanvaConfig = {
  refreshToken: 'refresh-1', clientId: 'client', clientSecret: 'secret',
  apiBaseUrl: 'https://api.canva.com/rest/v1', mcpUrl: 'https://mcp.canva.com/mcp',
  timeoutMs: 1000, maxRetries: 0, requireWriteApproval: true, approvedActions: new Set(),
};

describe('CanvaCredentialProvider', () => {
  it('refreshes an OAuth token server-side without exposing the client secret to callers', async () => {
    const fetchMock = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({
      access_token: 'access-2', refresh_token: 'refresh-2', expires_in: 14400,
    }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const provider = new CanvaCredentialProvider(config, fetchMock as any);
    await expect(provider.getAccessToken()).resolves.toBe('access-2');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers.Authorization).toMatch(/^Basic /);
    expect(String(init.body)).toContain('grant_type=refresh_token');
    expect(String(init.body)).not.toContain('secret');
  });
});
