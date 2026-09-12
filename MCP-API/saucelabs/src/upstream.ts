import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { SauceConfig } from './config.js';

const ALLOWED_UPSTREAM_TOOLS = new Set([
  'get_account_info',
  'get_active_region',
  'get_recent_jobs',
  'get_job_details',
  'get_test_assets',
  'lookup_builds',
  'get_build',
  'lookup_jobs_in_build',
  'get_storage_files',
  'get_tunnels_for_user'
]);

export class SauceMcpClient {
  private readonly client = new Client({ name: 'daily-mcp-api-saucelabs', version: '1.0.0' });
  private connected = false;
  private discovered = new Set<string>();

  constructor(private readonly config: SauceConfig) {}

  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    const auth = `Basic ${Buffer.from(`${this.config.username}:${this.config.accessKey}`, 'utf8').toString('base64')}`;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: auth,
          'X-Sauce-Region': this.config.region
        }
      }
    });
    await this.client.connect(transport);
    const listed = await this.client.listTools();
    this.discovered = new Set(listed.tools.map(tool => tool.name));
    this.connected = true;
  }

  async call(tool: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(tool)) throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);
    await this.ensureConnected();
    if (!this.discovered.has(tool)) throw new Error(`Official Sauce MCP did not advertise required tool: ${tool}`);
    const result = await this.client.callTool({ name: tool, arguments: args });
    if (result.isError) throw new Error(`Official Sauce MCP tool failed: ${tool}`);
    return result;
  }

  async close(): Promise<void> {
    if (!this.connected) return;
    await this.client.close();
    this.connected = false;
    this.discovered.clear();
  }
}
