import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export class AppSignalUpstream {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  private tools?: UpstreamTool[];

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.token}` } }
    });
    const client = new Client({ name: 'ai-engineering-appsignal-connector', version: '1.0.0' });
    await this.withTimeout(client.connect(transport));
    this.client = client;
    this.transport = transport;
  }

  async listTools(refresh = false): Promise<UpstreamTool[]> {
    await this.connect();
    if (!this.tools || refresh) {
      const result = await this.withTimeout(this.client!.listTools());
      this.tools = result.tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema as Record<string, unknown>
      }));
    }
    return this.tools;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const known = await this.listTools();
    if (!known.some(t => t.name === name)) throw new Error(`Upstream AppSignal MCP tool is not available: ${name}`);
    return this.withTimeout(this.client!.callTool({ name, arguments: args }));
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.client = undefined;
    this.transport = undefined;
    this.tools = undefined;
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error('AppSignal MCP request timed out')), { once: true }))
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
}
