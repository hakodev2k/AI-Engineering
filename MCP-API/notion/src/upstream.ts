import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { NotionConfig } from './config.js';

const ALLOWED = new Set([
  'notion-fetch','notion-search','notion-get-comments','notion-get-users','notion-get-teams',
  'notion-create-pages','notion-update-page','notion-create-comment','notion-move-pages',
  'notion-duplicate-page','notion-create-database'
]);

export class NotionUpstream {
  private client?: Client;
  constructor(private readonly cfg: NotionConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'ai-engineering-notion-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.cfg.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.cfg.accessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
  }

  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    await this.connect();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
    try {
      return await this.client!.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
}

export { ALLOWED };
