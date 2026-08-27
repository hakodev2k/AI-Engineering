import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED = new Set(['read_post', 'read_channel', 'search_posts', 'create_post', 'get_channel_info', 'get_team_info', 'search_users', 'get_channel_members', 'get_team_members']);

export class MattermostUpstreamMcp {
  private client?: Client;
  constructor(private readonly config: Config) {}

  get enabled(): boolean { return Boolean(this.config.upstreamMcpUrl); }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.config.upstreamMcpUrl) throw new Error('Mattermost upstream MCP is not configured');
    const headers: Record<string, string> = {};
    if (this.config.upstreamMcpBearerToken) headers.Authorization = `Bearer ${this.config.upstreamMcpBearerToken}`;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.upstreamMcpUrl), { requestInit: { headers } });
    const client = new Client({ name: 'ai-engineering-mattermost-connector', version: '1.0.0' });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`Upstream MCP tool not allowlisted: ${name}`);
    const client = await this.getClient();
    return client.callTool({ name, arguments: args });
  }

  async close(): Promise<void> { await this.client?.close(); this.client = undefined; }
}
