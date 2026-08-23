import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { RovoBitbucketClient } from '../src/rovo.js';

const restOnlyEnv = {
  BITBUCKET_AUTH_MODE: 'api-token',
  BITBUCKET_EMAIL: 'agent@example.com',
  BITBUCKET_API_TOKEN: 'rest-token',
  BITBUCKET_PREFER_MCP: 'true',
  BITBUCKET_TIMEOUT_MS: '5000',
  BITBUCKET_MAX_RETRIES: '0'
};

describe('Rovo MCP fallback', () => {
  it('fails closed when MCP credentials are not configured so the router can use REST', async () => {
    const rovo = new RovoBitbucketClient(loadConfig(restOnlyEnv));
    expect(rovo.configured).toBe(false);
    await expect(rovo.call('bitbucketRepository', 'get', { workspace: 'acme', repo: 'platform' })).resolves.toBeNull();
  });
});
