import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { SauceConfig } from './config.js';
import { basicAuthorization } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'get_account_info',
  'get_my_active_team',
  'get_active_region',
  'lookup_teams',
  'lookup_users',
  'get_recent_jobs',
  'lookup_builds',
  'get_storage_files',
  'get_storage_groups',
  'listDevices',
  'listDeviceStatus',
  'listSessions'
]);

export class SauceMcpClient {
  private client?: Client;
  constructor(private readonly config: SauceConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'ai-engineering-sauce-labs-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: basicAuthorization(this.config),
          'X-Sauce-Region': this.config.region
        }
      }
    });
    await client.connect(transport);
    const listed = await client.listTools();
    const names = new Set(listed.tools.map((tool) => tool.name));
    for (const required of ALLOWED_UPSTREAM_TOOLS) {
      if (!names.has(required)) throw new Error(`UPSTREAM_TOOL_MISSING:${required}`);
    }
    this.client = client;
  }

  async call(name: string): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error('UPSTREAM_TOOL_NOT_ALLOWED');
    await this.connect();
    return this.client!.callTool({ name, arguments: {} });
  }
}
