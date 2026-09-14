import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { RunpodConfig } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'list-gpu-types',
  'list-data-centers',
  'list-pods',
  'get-pod',
  'list-endpoints',
  'get-endpoint',
  'endpoint-health',
  'get-job-status',
  'list-templates',
  'list-network-volumes',
  'create-pod',
  'stop-pod',
  'create-endpoint',
  'run-endpoint'
]);

export class RunpodUpstream {
  private client?: Client;
  constructor(private readonly config: RunpodConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-runpod-wrapper', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@runpod/mcp-server@3.4.0'],
      env: {
        ...process.env,
        RUNPOD_API_KEY: this.config.apiKey
      } as Record<string, string>
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Runpod MCP timeout after ${this.config.timeoutMs}ms; write outcome may be unknown`)), this.config.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
  }
}
