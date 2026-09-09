import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export class ChecklyMcpClient {
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly cfg: Config) {}

  private async getClient(): Promise<Client> {
    if (!this.cfg.mcpEnabled) throw new Error('Checkly upstream MCP is disabled');
    if (this.client) return this.client;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({name: 'checkly-connector-upstream', version: '1.0.0'});
        const transport = new StreamableHTTPClientTransport(new URL(this.cfg.mcpUrl), {
          requestInit: {
            headers: {
              Authorization: `Bearer ${this.cfg.apiKey}`,
              'X-Checkly-Account': this.cfg.accountId
            }
          }
        });
        await client.connect(transport);
        this.client = client;
        return client;
      })();
    }
    return this.connecting;
  }

  async call(tool: 'list-check-stats' | 'list-check-results' | 'get-check-result', args: Record<string, unknown>): Promise<unknown> {
    const client = await this.getClient();
    const result = await client.callTool({name: tool, arguments: args});
    if (result.isError) throw new Error(`Checkly upstream MCP tool ${tool} failed`);
    return result;
  }
}
