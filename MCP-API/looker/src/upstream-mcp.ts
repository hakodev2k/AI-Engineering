import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export class LookerManagedMcp {
  constructor(private config: Config) {}

  async query(args: Record<string, unknown>) {
    if (!this.config.useMcp || !this.config.mcpAccessToken) throw new Error('Managed MCP not configured');
    const client = new Client({ name: 'looker-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(`${this.config.baseUrl}/mcp`), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
    });
    try {
      await client.connect(transport);
      const tools = await client.listTools();
      if (!tools.tools.some(t => t.name === 'looker_query')) throw new Error('Official MCP tool looker_query is not enabled');
      return await client.callTool({ name: 'looker_query', arguments: args });
    } finally {
      await client.close().catch(() => undefined);
    }
  }
}
