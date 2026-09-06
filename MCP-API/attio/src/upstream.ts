import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { AttioConfig } from './config.js';
import type { Risk } from './policy.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'whoami',
  'list-objects',
  'search-records',
  'list-records',
  'get-records-by-ids',
  'list-attribute-definitions',
  'create-record',
  'upsert-record',
  'update-record',
  'list-lists',
  'list-records-in-list',
  'add-record-to-list',
  'search-notes-by-metadata',
  'get-note-body',
  'create-note',
  'list-tasks',
  'create-task',
  'update-task',
  'search-meetings',
  'search-emails-by-metadata',
  'get-email-content',
  'run-basic-report'
]);

function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

export class AttioUpstream {
  private client?: Client;
  constructor(private readonly config: AttioConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-attio-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>, risk: Risk): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted.`);
    const attempts = risk === 'READ' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      let timer: NodeJS.Timeout | undefined;
      try {
        const client = await this.getClient();
        return await Promise.race([
          client.callTool({ name, arguments: args }),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Attio MCP timeout after ${this.config.timeoutMs}ms.`)), this.config.timeoutMs);
          })
        ]);
      } catch (error) {
        lastError = error;
        const text = error instanceof Error ? error.message : String(error);
        const retryable = risk === 'READ' && (/429|rate.?limit|temporar|timeout|502|503|504/i.test(text));
        if (!retryable || attempt === attempts - 1) throw error;
        await sleep(250 * (2 ** attempt));
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
    throw lastError;
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}
