import { describe, expect, it, vi } from 'vitest';
import { SpotifyClient, SpotifyApiError } from '../src/client.js';
import { SpotifyTokenProvider } from '../src/auth.js';
import { loadConfig } from '../src/config.js';

describe('Spotify client reliability', () => {
  it('adds bearer auth and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer token');
      return new Response(JSON.stringify({ id: 'abc' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const config = loadConfig({ SPOTIFY_ACCESS_TOKEN: 'token', SPOTIFY_MAX_RETRIES: '0' });
    const client = new SpotifyClient(config, new SpotifyTokenProvider(config, fetchMock as typeof fetch), fetchMock as typeof fetch);
    await expect(client.get('/tracks/abc')).resolves.toEqual({ id: 'abc' });
  });

  it('does not retry POST writes on server errors', async () => {
    const fetchMock = vi.fn(async () => new Response('{"error":"boom"}', { status: 500 }));
    const config = loadConfig({ SPOTIFY_ACCESS_TOKEN: 'token', SPOTIFY_MAX_RETRIES: '3' });
    const client = new SpotifyClient(config, new SpotifyTokenProvider(config, fetchMock as typeof fetch), fetchMock as typeof fetch);
    await expect(client.post('/me/playlists', { name: 'x' })).rejects.toBeInstanceOf(SpotifyApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves Retry-After on a terminal 429', async () => {
    const fetchMock = vi.fn(async () => new Response('{"reason":"QUOTA_EXCEEDED"}', { status: 429, headers: { 'retry-after': '7' } }));
    const config = loadConfig({ SPOTIFY_ACCESS_TOKEN: 'token', SPOTIFY_MAX_RETRIES: '0' });
    const client = new SpotifyClient(config, new SpotifyTokenProvider(config, fetchMock as typeof fetch), fetchMock as typeof fetch);
    try {
      await client.get('/me');
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(SpotifyApiError);
      expect((error as SpotifyApiError).retryAfter).toBe(7);
    }
  });
});
