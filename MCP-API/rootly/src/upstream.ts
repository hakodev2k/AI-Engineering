import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export const ALLOWED_MCP_TOOLS = new Set([
  'get_oncall_handoff_summary',
  'get_oncall_shift_metrics',
  'get_shift_incidents'
]);

export interface RootlyUpstream {
  call(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class RootlyMcpClient implements RootlyUpstream {
  private client?: Client;
  private connecting?: Promise<void>;

  constructor(private readonly config: Config) {}

  private async ensureConnected(): Promise<void> {
    if (this.client) return;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ name: 'ai-engineering-rootly-connector', version: '1.0.0' });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { Authorization: `Bearer ${this.config.apiToken}` } }
        });
        await client.connect(transport);
        const names = new Set((await client.listTools()).tools.map((tool) => tool.name));
        for (const expected of ALLOWED_MCP_TOOLS) {
          if (!names.has(expected)) throw new Error(`Official Rootly MCP no longer advertises expected tool: ${expected}`);
        }
        this.client = client;
      })().finally(() => { this.connecting = undefined; });
    }
    await this.connecting;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_MCP_TOOLS.has(name)) throw new Error(`Blocked unexpected Rootly MCP tool: ${name}`);
    await this.ensureConnected();
    const operation = this.client!.callTool({ name, arguments: args });
    const timeout = new Promise<never>((_, reject) => {
      const handle = setTimeout(() => reject(new Error('Rootly MCP call timed out')), this.config.timeoutMs);
      handle.unref?.();
    });
    const result = await Promise.race([operation, timeout]);
    if (result.isError) throw new Error(`Rootly MCP tool ${name} failed`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close().catch(() => undefined);
    this.client = undefined;
  }
}
