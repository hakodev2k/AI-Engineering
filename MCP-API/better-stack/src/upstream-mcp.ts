import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED_UPSTREAM_TOOLS = new Set(['monitors', 'monitor', 'incidents']);

export class BetterStackMcpClient {
  private client?: Client;
  constructor(private readonly config: Config) {}

  private async connect() {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-better-stack-adapter', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          'X-MCP-Tools-Only': [...ALLOWED_UPSTREAM_TOOLS].join(',')
        }
      }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown> = {}) {
    if (!this.config.useMcp) throw new Error('UPSTREAM_MCP_DISABLED');
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`UPSTREAM_MCP_TOOL_NOT_ALLOWED: ${name}`);
    const client = await this.connect();
    return client.callTool({ name, arguments: args });
  }

  async close() {
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}
