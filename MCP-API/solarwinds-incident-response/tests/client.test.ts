import { describe, expect, it, vi } from 'vitest';
import type { ConnectorConfig } from '../src/config.js';
import { ProviderError, SolarWindsIncidentResponseClient } from '../src/client.js';

const config: ConnectorConfig = {
  region: 'us',
  refreshToken: 'refresh-secret',
  approvalToken: 'approval-secret',
  timeoutMs: 1000,
  maxRetries: 1,
  apiBaseUrl: 'https://api.squadcast.com',
  authUrl: 'https://auth.squadcast.com/oauth/access-token'
};

const response = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(body === undefined ? undefined : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers }
  });

describe('SolarWindsIncidentResponseClient', () => {
  it('exchanges refresh token internally and sends only bearer token to provider APIs', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, { data: { access_token: 'access-secret', expires_at: Math.floor(Date.now() / 1000) + 3600 } }))
      .mockResolvedValueOnce(response(200, { data: { id: 'inc-1' } }));

    const client = new SolarWindsIncidentResponseClient(config, fetchMock as unknown as typeof fetch);
    await client.get('/v3/incidents/inc-1');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1].headers['X-Refresh-Token']).toBe('refresh-secret');
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe('Bearer access-secret');
    expect(JSON.stringify(fetchMock.mock.calls[1])).not.toContain('refresh-secret');
  });

  it('retries a read after throttling but keeps retries bounded', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, { data: { access_token: 'access-secret', expires_at: Math.floor(Date.now() / 1000) + 3600 } }))
      .mockResolvedValueOnce(response(429, { message: 'throttled' }, { 'retry-after': '0' }))
      .mockResolvedValueOnce(response(200, { data: [] }));

    const client = new SolarWindsIncidentResponseClient(config, fetchMock as unknown as typeof fetch);
    const result = await client.get('/v3/services');
    expect(result).toEqual({ data: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not blindly retry write operations', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, { data: { access_token: 'access-secret', expires_at: Math.floor(Date.now() / 1000) + 3600 } }))
      .mockResolvedValueOnce(response(503, { message: 'unavailable' }));

    const client = new SolarWindsIncidentResponseClient(config, fetchMock as unknown as typeof fetch);
    await expect(client.post('/v3/incidents/inc-1/acknowledge')).rejects.toBeInstanceOf(ProviderError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('surfaces authentication failures without retrying permission/auth errors', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(401, { message: 'invalid refresh token' }));
    const client = new SolarWindsIncidentResponseClient(config, fetchMock as unknown as typeof fetch);
    await expect(client.get('/v3/services')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
