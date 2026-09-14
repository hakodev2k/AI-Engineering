import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { HookdeckConfig } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'hookdeck_projects',
  'hookdeck_connections',
  'hookdeck_sources',
  'hookdeck_destinations',
  'hookdeck_transformations',
  'hookdeck_requests',
  'hookdeck_events',
  'hookdeck_attempts',
  'hookdeck_issues',
  'hookdeck_metrics'
]);

export class HookdeckUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;

  constructor(private readonly config: HookdeckConfig) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-hookdeck-wrapper', version: '1.0.0' });
    const env: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) if (value !== undefined) env[key] = value;
    env.HOOKDECK_API_KEY = this.config.apiKey;
    const transport = new StdioClientTransport({ command: this.config.command, args: ['gateway', 'mcp'], env });
    await client.connect(transport);
    this.client = client;
    this.transport = transport;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.connect();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Hookdeck MCP timeout after ${this.config.timeoutMs}ms; write outcome may be unknown`)), this.config.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
    this.transport = undefined;
  }
}
