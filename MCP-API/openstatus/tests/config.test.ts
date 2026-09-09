import { afterEach, describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

const keys = [
  'OPENSTATUS_API_KEY',
  'OPENSTATUS_MCP_URL',
  'OPENSTATUS_REQUEST_TIMEOUT_MS',
  'OPENSTATUS_READ_RETRIES',
  'OPENSTATUS_REQUIRE_WRITE_APPROVAL',
  'OPENSTATUS_ALLOWED_MCP_HOSTS',
] as const;
const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    const value = original[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe('loadConfig', () => {
  it('requires an API key', () => {
    delete process.env.OPENSTATUS_API_KEY;
    expect(() => loadConfig()).toThrow('OPENSTATUS_API_KEY is required');
  });

  it('uses secure defaults', () => {
    process.env.OPENSTATUS_API_KEY = 'test-key';
    delete process.env.OPENSTATUS_MCP_URL;
    delete process.env.OPENSTATUS_ALLOWED_MCP_HOSTS;
    const cfg = loadConfig();
    expect(cfg.mcpUrl).toBe('https://api.openstatus.dev/mcp');
    expect(cfg.timeoutMs).toBe(15000);
    expect(cfg.readRetries).toBe(2);
    expect(cfg.requireWriteApproval).toBe(true);
  });

  it('rejects non-HTTPS and non-allowlisted MCP endpoints', () => {
    process.env.OPENSTATUS_API_KEY = 'test-key';
    process.env.OPENSTATUS_MCP_URL = 'http://api.openstatus.dev/mcp';
    expect(() => loadConfig()).toThrow('must use HTTPS');

    process.env.OPENSTATUS_MCP_URL = 'https://evil.example/mcp';
    process.env.OPENSTATUS_ALLOWED_MCP_HOSTS = 'api.openstatus.dev';
    expect(() => loadConfig()).toThrow('not allowlisted');
  });
});
