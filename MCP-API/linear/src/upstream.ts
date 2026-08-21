import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { LinearConfig } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'list_issues',
  'get_issue',
  'list_projects',
  'get_project',
  'list_comments',
  'list_users',
  'list_issue_labels',
  'save_issue',
  'save_project',
  'save_document'
]);

export class LinearUpstream {
  private client?: Client;
  constructor(private readonly config: LinearConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-linear-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: {
        headers: { Authorization: `Bearer ${this.config.accessToken}` }
      }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>, timeoutMs = 20_000): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Linear MCP timeout after ${timeoutMs}ms; write outcome may be unknown`)), timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
