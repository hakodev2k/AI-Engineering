import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { MatomoConfig } from './config.js';

export interface MatomoMcpToolMetadata {
  name: string;
  description?: string;
  inputSchema?: unknown;
}

export class MatomoMcpDiscoveryClient {
  constructor(private readonly config: MatomoConfig) {}

  async listTools(): Promise<{ configured: boolean; tools: MatomoMcpToolMetadata[] }> {
    if (!this.config.mcpUrl) return { configured: false, tools: [] };
    const client = new Client({ name: 'daily-mcp-matomo-discovery', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: { headers: { Authorization: `Bearer ${this.config.tokenAuth}` } }
    });
    try {
      await client.connect(transport);
      const result = await client.listTools();
      return {
        configured: true,
        tools: result.tools.map((tool) => ({ name: tool.name, description: tool.description, inputSchema: tool.inputSchema }))
      };
    } finally {
      await client.close().catch(() => undefined);
    }
  }
}
