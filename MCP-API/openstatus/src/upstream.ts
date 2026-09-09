import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import { isRetryableReadError, type Risk } from './policy.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'list_status_pages',
  'list_page_components',
  'list_status_reports',
  'list_maintenances',
  'list_monitors',
  'get_monitor',
  'get_monitor_status',
  'get_monitor_summary',
  'list_response_logs',
  'get_response_log',
  'list_notifications',
  'list_private_locations',
  'list_audit_logs',
  'get_audit_log',
  'create_maintenance',
]);

export class OpenStatusUpstream {
  private client: Client | undefined;
  private connecting: Promise<Client> | undefined;

  constructor(private readonly config: Config) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
        requestInit: {
          headers: {
            'x-openstatus-key': this.config.apiKey,
          },
        },
      });
      const client = new Client({ name: 'ai-engineering-openstatus-connector', version: '1.0.0' });
      await client.connect(transport);
      this.client = client;
      return client;
    })();

    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  }

  private async reset(): Promise<void> {
    const client = this.client;
    this.client = undefined;
    if (client) {
      try { await client.close(); } catch { /* best effort */ }
    }
  }

  async call(tool: string, args: Record<string, unknown>, risk: Risk): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(tool)) throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);
    const attempts = risk === 'READ' ? this.config.readRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        const client = await this.getClient();
        const operation = client.callTool({ name: tool, arguments: args });
        const result = await Promise.race([
          operation,
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('OpenStatus MCP request timed out')), this.config.timeoutMs)),
        ]);
        return result;
      } catch (error) {
        lastError = error;
        await this.reset();
        if (risk !== 'READ' || attempt + 1 >= attempts || !isRetryableReadError(error)) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)));
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  async close(): Promise<void> {
    await this.reset();
  }
}
