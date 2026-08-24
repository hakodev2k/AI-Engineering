import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertSubredditAllowed } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { RedditAuth } from '../src/auth.js';
import { RedditClient, RedditApiError } from '../src/client.js';

describe('Reddit connector configuration', () => {
  it('requires credentials and a user agent', () => {
    expect(() => loadConfig({})).toThrow(/ACCESS_TOKEN or REDDIT_REFRESH_TOKEN/);
    expect(() => loadConfig({ REDDIT_ACCESS_TOKEN: 'x' })).toThrow(/USER_AGENT/);
  });

  it('enforces subreddit allowlist', () => {
    const cfg = loadConfig({ REDDIT_ACCESS_TOKEN: 'x', REDDIT_USER_AGENT: 'test-agent', REDDIT_ALLOWED_SUBREDDITS: 'typescript,node' });
    expect(() => assertSubredditAllowed(cfg, 'TypeScript')).not.toThrow();
    expect(() => assertSubredditAllowed(cfg, 'golang')).toThrow(/not allowed/);
  });
});

describe('approval policy', () => {
  it('requires a valid HMAC for writes', () => {
    const secret = 'secret';
    expect(() => assertApproval('reddit.comment.create', undefined, secret)).toThrow(/approval required/i);
    const id = approvalDigest(secret, 'reddit.comment.create');
    expect(() => assertApproval('reddit.comment.create', id, secret)).not.toThrow();
  });
});

describe('OAuth refresh', () => {
  it('refreshes a token without exposing credentials to callers', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ access_token: 'fresh' }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const cfg = loadConfig({
      REDDIT_REFRESH_TOKEN: 'refresh', REDDIT_CLIENT_ID: 'client', REDDIT_CLIENT_SECRET: 'secret', REDDIT_USER_AGENT: 'test-agent'
    });
    const auth = new RedditAuth(cfg, fetchMock as typeof fetch);
    expect(await auth.getAccessToken()).toBe('fresh');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('API client', () => {
  it('maps non-retryable provider errors', async () => {
    const fetchMock = vi.fn(async () => new Response('{"message":"Forbidden"}', { status: 403 }));
    const cfg = loadConfig({ REDDIT_ACCESS_TOKEN: 'token', REDDIT_USER_AGENT: 'test-agent', REDDIT_MAX_RETRIES: '0' });
    const auth = { getAccessToken: async () => 'token' } as RedditAuth;
    const client = new RedditClient(cfg, auth, fetchMock as typeof fetch);
    await expect(client.get('/api/v1/me')).rejects.toBeInstanceOf(RedditApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a rate limit once and preserves bounded behavior', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ name: 'tester' }), { status: 200 }));
    const cfg = loadConfig({ REDDIT_ACCESS_TOKEN: 'token', REDDIT_USER_AGENT: 'test-agent', REDDIT_MAX_RETRIES: '1' });
    const auth = { getAccessToken: async () => 'token' } as RedditAuth;
    const client = new RedditClient(cfg, auth, fetchMock as typeof fetch);
    await expect(client.get('/api/v1/me')).resolves.toEqual({ name: 'tester' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
