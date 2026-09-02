import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED_TOOLS = new Set(['find-tasks', 'add-tasks']);

export class TodoistMcpClient {
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly config: Config) {}

  get configured(): boolean { return Boolean(this.config.mcpAccessToken); }

  private async getClient(): Promise<Client> {
    if (!this.config.mcpAccessToken) throw new Error('TODOIST_MCP_ACCESS_TOKEN is not configured');
    if (this.client) return this.client;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ name: 'ai-engineering-todoist-connector', version: '1.0.0' });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
        });
        await client.connect(transport);
        const advertised = new Set((await client.listTools()).tools.map(t => t.name));
        for (const name of ALLOWED_TOOLS) {
          if (!advertised.has(name)) throw new Error(`Official Todoist MCP did not advertise required tool: ${name}`);
        }
        this.client = client;
        return client;
      })().finally(() => { this.connecting = undefined; });
    }
    return this.connecting;
  }

  async call(name: 'find-tasks' | 'add-tasks', args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_TOOLS.has(name)) throw new Error(`Todoist MCP tool is not allowlisted: ${name}`);
    const client = await this.getClient();
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`Todoist MCP ${name} failed`);
    return result.structuredContent ?? result.content;
  }

  async close(): Promise<void> {
    await this.client?.close().catch(() => undefined);
    this.client = undefined;
  }
}
