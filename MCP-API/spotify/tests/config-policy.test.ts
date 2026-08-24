import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';

describe('Spotify configuration and policy', () => {
  it('requires either an access token or refresh credentials', () => {
    expect(() => loadConfig({})).toThrow(/SPOTIFY_ACCESS_TOKEN/);
    expect(loadConfig({ SPOTIFY_ACCESS_TOKEN: 'token' }).accessToken).toBe('token');
  });

  it('validates timeout and retry bounds', () => {
    expect(() => loadConfig({ SPOTIFY_ACCESS_TOKEN: 'x', SPOTIFY_MAX_RETRIES: '9' })).toThrow(/MAX_RETRIES/);
    expect(() => loadConfig({ SPOTIFY_ACCESS_TOKEN: 'x', SPOTIFY_TIMEOUT_MS: '10' })).toThrow(/TIMEOUT_MS/);
  });

  it('requires tool-specific approval for writes', () => {
    const config = loadConfig({ SPOTIFY_ACCESS_TOKEN: 'x', SPOTIFY_APPROVAL_SECRET: 'secret' });
    const approval = approvalDigest('secret', 'spotify.playlist.create');
    expect(() => assertApproval('spotify.playlist.create', approval, config, 'WRITE')).not.toThrow();
    expect(() => assertApproval('spotify.playlist.add_items', approval, config, 'WRITE')).toThrow(/Invalid approvalId/);
  });

  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ SPOTIFY_ACCESS_TOKEN: 'x', SPOTIFY_APPROVAL_SECRET: 'secret' });
    const approval = approvalDigest('secret', 'spotify.playlist.remove_items');
    expect(() => assertApproval('spotify.playlist.remove_items', approval, config, 'DESTRUCTIVE')).toThrow(/disabled/);
  });
});
