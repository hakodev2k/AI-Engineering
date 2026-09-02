import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('config', () => {
  it('requires an API token', () => expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/ROOTLY_API_TOKEN/));
  it('uses official defaults and validates reliability bounds', () => {
    const config = loadConfig({ ROOTLY_API_TOKEN: 'token', ROOTLY_MAX_RETRIES: '3', ROOTLY_TIMEOUT_MS: '2000' } as NodeJS.ProcessEnv);
    expect(config.apiBaseUrl).toBe('https://api.rootly.com/v1');
    expect(config.mcpUrl).toContain('mcp.rootly.com');
    expect(config.maxRetries).toBe(3);
    expect(config.timeoutMs).toBe(2000);
  });
});
