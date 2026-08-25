import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'WhoAmI', 'ListFolder', 'GetFileMetadata', 'Search', 'CreateFolder', 'CreateFile',
  'CreateSharedLink', 'ListSharedLinks', 'Copy', 'Move', 'Delete',
  'ListFileRevisions', 'RestoreFileRevision'
]);

export class DropboxUpstreamMcp {
  private client?: Client;
  constructor(private readonly config: Config) {}

  get enabled(): boolean { return Boolean(this.config.mcpAccessToken); }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.config.mcpAccessToken) throw new Error('DROPBOX_MCP_ACCESS_TOKEN is not configured');
    const client = new Client({ name: 'ai-engineering-dropbox-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(tool)) throw new Error(`Upstream Dropbox MCP tool is not allowlisted: ${tool}`);
    const client = await this.getClient();
    const result = await client.callTool({ name: tool, arguments: args });
    if ((result as any)?.isError) throw new Error(`Dropbox MCP tool ${tool} returned an error`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }
}
