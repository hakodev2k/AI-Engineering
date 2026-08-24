import { describe, expect, it } from 'vitest';
import { ElasticAgentBuilderClient } from '../src/agent-builder.js';
import { loadConfig } from '../src/config.js';

describe('Elastic Agent Builder MCP routing', () => {
  it('returns null so callers can use REST fallback when MCP is not configured', async () => {
    const config = loadConfig({
      ELASTICSEARCH_URL: 'https://elastic.example',
      ELASTICSEARCH_API_KEY: 'key',
      ELASTIC_PREFER_MCP: 'true'
    });
    const client = new ElasticAgentBuilderClient(config);
    expect(client.configured).toBe(false);
    await expect(client.call('platform.core.search', { index: 'products', query: 'hello' })).resolves.toBeNull();
  });

  it('refuses unknown upstream MCP tools even when requested by a caller', async () => {
    const config = loadConfig({
      ELASTICSEARCH_URL: 'https://elastic.example',
      ELASTICSEARCH_API_KEY: 'key',
      ELASTIC_PREFER_MCP: 'false'
    });
    const client = new ElasticAgentBuilderClient(config);
    await expect(client.call('platform.core.execute_connector_sub_action', {})).resolves.toBeNull();
  });
});
