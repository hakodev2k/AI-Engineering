import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { XeroConfig } from './config.js';

export interface XeroUpstream {
  call(name: string, args?: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class OfficialXeroMcpUpstream implements XeroUpstream {
  private readonly client = new Client({ name: 'xero-connector-upstream', version: '1.0.0' });
  private connected = false;

  constructor(private readonly config: XeroConfig) {}

  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    const env: Record<string, string> = {};
    if (this.config.bearerToken) env.XERO_CLIENT_BEARER_TOKEN = this.config.bearerToken;
    if (this.config.clientId) env.XERO_CLIENT_ID = this.config.clientId;
    if (this.config.clientSecret) env.XERO_CLIENT_SECRET = this.config.clientSecret;
    if (this.config.scopes) env.XERO_SCOPES = this.config.scopes;

    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@xeroapi/xero-mcp-server@latest'],
      env
    });
    await this.client.connect(transport);
    this.connected = true;
  }

  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    await this.ensureConnected();
    const result = await this.client.callTool({ name, arguments: args });
    if (result.isError) {
      throw new Error(`UPSTREAM_MCP_ERROR: ${JSON.stringify(result.content)}`);
    }
    return result;
  }

  async close(): Promise<void> {
    if (!this.connected) return;
    await this.client.close();
    this.connected = false;
  }
}
