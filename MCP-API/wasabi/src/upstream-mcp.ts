import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED = new Set(['wasabi_s3_list_buckets']);

export class WasabiOfficialMcp {
  constructor(private readonly config: Config) {}

  get enabled(): boolean { return Boolean(this.config.mcpAccessToken); }

  async listBuckets(): Promise<unknown> {
    if (!this.config.mcpAccessToken) throw new Error('Official Wasabi MCP OAuth token is not configured');
    const client = new Client({ name: 'wasabi-safe-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpS3Url), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
    });
    try {
      await client.connect(transport);
      const tools = await client.listTools();
      const names = new Set(tools.tools.map(t => t.name));
      for (const name of ALLOWED) if (!names.has(name)) throw new Error(`Required official MCP tool is unavailable: ${name}`);
      return await client.callTool({ name: 'wasabi_s3_list_buckets', arguments: {} });
    } finally {
      await client.close().catch(() => undefined);
    }
  }
}
