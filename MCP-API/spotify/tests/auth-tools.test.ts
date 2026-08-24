import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';
import { SpotifyTokenProvider } from '../src/auth.js';
import { loadConfig } from '../src/config.js';

describe('Spotify auth and tool registration', () => {
  it('refreshes OAuth access tokens inside the auth layer', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ access_token: 'fresh', expires_in: 3600 }), { status: 200 }));
    const config = loadConfig({ SPOTIFY_CLIENT_ID: 'id', SPOTIFY_CLIENT_SECRET: 'secret', SPOTIFY_REFRESH_TOKEN: 'refresh' });
    const provider = new SpotifyTokenProvider(config, fetchMock as typeof fetch);
    await expect(provider.getToken()).resolves.toBe('fresh');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('registers the complete stable external tool contract', async () => {
    const source = await readFile(new URL('../src/server.ts', import.meta.url), 'utf8');
    const tools = [
      'spotify.catalog.search', 'spotify.track.get', 'spotify.artist.get', 'spotify.album.get',
      'spotify.user.me', 'spotify.user.top', 'spotify.playlist.list_mine', 'spotify.playlist.get',
      'spotify.playlist.items', 'spotify.playlist.create', 'spotify.playlist.add_items', 'spotify.playlist.remove_items'
    ];
    for (const tool of tools) expect(source).toContain(`server.tool('${tool}'`);
    expect(source).not.toContain('execute_any_api_request');
  });
});
