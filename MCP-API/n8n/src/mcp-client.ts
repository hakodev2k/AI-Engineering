import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { N8nConfig } from './config.js';

export class N8nMcpClient {
  private client?: Client;
  private connected = false;
  constructor(private readonly config: N8nConfig) {}

  private async ensureConnected() {
    if (!this.config.enableMcp || !this.config.mcpUrl) return false;
    if (this.connected && this.client) return true;
    const headers: Record<string, string> = {};
    if (this.config.mcpToken) headers.Authorization = `Bearer ${this.config.mcpToken}`;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), { requestInit: { headers } });
    this.client = new Client({ name: 'n8n-connector-upstream', version: '1.0.0' });
    await this.client.connect(transport);
    this.connected = true;
    return true;
  }

  async callIfAvailable(name: string, args: Record<string, unknown>): Promise<unknown | undefined> {
    try {
      if (!await this.ensureConnected() || !this.client) return undefined;
      const tools = await this.client.listTools();
      if (!tools.tools.some(t => t.name === name)) return undefined;
      return await this.client.callTool({ name, arguments: args });
    } catch {
      this.connected = false;
      try { await this.client?.close(); } catch {}
      this.client = undefined;
      return undefined;
    }
  }

  async close() {
    try { await this.client?.close(); } finally { this.client = undefined; this.connected = false; }
  }
}
