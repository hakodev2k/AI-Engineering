import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { N8nMcpClient } from '../src/mcp-client.js';

describe('MCP fallback', () => {
  it('returns undefined without making an upstream call when MCP is disabled', async () => {
    const config = loadConfig({
      N8N_BASE_URL: 'https://example.app.n8n.cloud',
      N8N_API_KEY: 'test-key',
      N8N_ENABLE_MCP: 'false'
    });
    const client = new N8nMcpClient(config);
    await expect(client.callIfAvailable('search_workflows', { query: 'demo' })).resolves.toBeUndefined();
    await client.close();
  });
});
