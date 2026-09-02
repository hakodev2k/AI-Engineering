import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
export class CustomerIoMcpClient {
  private client?: Client;
  constructor(private readonly config: Config) {}
  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.config.mcpAccessToken) throw new Error('CUSTOMERIO_MCP_ACCESS_TOKEN is not configured; complete Customer.io OAuth in an MCP-capable host first');
    const client = new Client({ name: 'ai-engineering-customerio-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }
  async listTools(): Promise<string[]> {
    const client = await this.getClient();
    const result = await client.listTools();
    return result.tools.map(tool => tool.name).sort();
  }
  async authStatus(): Promise<unknown> {
    const client = await this.getClient();
    const result = await client.callTool({ name: 'cio_auth_status', arguments: {} });
    if (result.isError) throw new Error(`Customer.io MCP auth status failed: ${JSON.stringify(result.content)}`);
    return result;
  }
  async close(): Promise<void> { await this.client?.close().catch(() => undefined); this.client = undefined; }
}
