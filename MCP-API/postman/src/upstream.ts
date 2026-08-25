import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export class PostmanMcpClient {
  private client?: Client;
  private connectPromise?: Promise<void>;

  constructor(private readonly config: Config) {}

  private async ensureConnected(): Promise<void> {
    if (this.client) return;
    if (!this.connectPromise) {
      this.connectPromise = (async () => {
        const client = new Client({ name: 'ai-engineering-postman-connector', version: '1.0.0' });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
        });
        await client.connect(transport);
        this.client = client;
      })().finally(() => { this.connectPromise = undefined; });
    }
    await this.connectPromise;
  }

  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    await this.ensureConnected();
    const result = await this.client!.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`Postman MCP tool ${name} failed: ${JSON.stringify(result.content)}`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }
}
