import assert from 'node:assert/strict';
import test from 'node:test';
import { BrowserbaseMcp } from '../src/upstream.js';
import type { Config } from '../src/config.js';

const config: Config = { apiKey: 'test-key', apiBaseUrl: 'https://api.browserbase.com', mcpUrl: new URL('https://mcp.browserbase.com/mcp?browserbaseApiKey=test-key'), timeoutMs: 1000, allowedHosts: new Set() };

test('rejects non-allowlisted upstream MCP tools before connecting', async () => {
  const upstream = new BrowserbaseMcp(config);
  await assert.rejects(() => upstream.call('newly_discovered_admin_tool', {}), /not allowlisted/);
});
