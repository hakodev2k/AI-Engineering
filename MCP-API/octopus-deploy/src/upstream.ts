import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { OctopusConfig } from './config.js';

const ALLOWED_TOOLS = new Set(['find_spaces', 'find_projects']);

export class OctopusMcpClient {
  private client?: Client;

  constructor(private readonly config: OctopusConfig) {}

  async call(tool: 'find_spaces' | 'find_projects', args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_TOOLS.has(tool)) throw new Error(`Upstream MCP tool is not allow-listed: ${tool}`);
    const client = await this.getClient();
    const result = await client.callTool({ name: tool, arguments: args });
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'octopus-deploy-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(`${this.config.baseUrl}/mcp`), {
      requestInit: { headers: { 'X-Octopus-ApiKey': this.config.apiKey } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }
}
