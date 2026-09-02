import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'accounts-list_accounts','workspaces-list_workspaces','forms-public_get_capabilities','forms-public_get_form','forms-public_list_forms',
  'forms-public_create_form','forms-public_validate_patch','forms-public_patch_form','forms-public_publish_form',
  'insights-public_discover','insights-public_aggregate'
]);

export class TypeformMcpClient {
  private client?: Client;
  constructor(private readonly config: Config) {}
  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-typeform-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpToken}` } }
    });
    await client.connect(transport);
    const advertised = new Set((await client.listTools()).tools.map(t => t.name));
    for (const name of ALLOWED) if (!advertised.has(name)) throw new Error(`Expected official Typeform MCP tool is unavailable: ${name}`);
    this.client = client;
    return client;
  }
  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`MCP tool not allowlisted: ${name}`);
    const client = await this.getClient();
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`Typeform MCP ${name} failed: ${JSON.stringify(result.content)}`);
    return result;
  }
  async close(): Promise<void> { await this.client?.close().catch(() => undefined); this.client = undefined; }
}
