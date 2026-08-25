import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { CalendlyConfig } from './config.js';

export class CalendlyMcpClient {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;

  constructor(private readonly config: CalendlyConfig) {}

  async call(toolName: string, args: Record<string, unknown>) {
    if (!this.config.CALENDLY_MCP_ACCESS_TOKEN) throw new Error('MCP transport requires CALENDLY_MCP_ACCESS_TOKEN obtained through Calendly OAuth 2.1/DCR');
    if (!this.client) await this.connect();
    return this.client!.callTool({ name: toolName, arguments: args });
  }

  async close() {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
  }

  private async connect() {
    const token = this.config.CALENDLY_MCP_ACCESS_TOKEN!;
    this.transport = new StreamableHTTPClientTransport(new URL(this.config.CALENDLY_MCP_URL), {
      requestInit: { headers: { Authorization: `Bearer ${token}` } }
    });
    this.client = new Client({ name: 'calendly-connector-upstream', version: '1.0.0' });
    await this.client.connect(this.transport);
  }
}
