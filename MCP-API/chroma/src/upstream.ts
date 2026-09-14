import { setTimeout as sleep } from 'node:timers/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { ChromaConfig } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'chroma_list_collections',
  'chroma_create_collection',
  'chroma_peek_collection',
  'chroma_get_collection_info',
  'chroma_get_collection_count',
  'chroma_modify_collection',
  'chroma_fork_collection',
  'chroma_delete_collection',
  'chroma_add_documents',
  'chroma_query_documents',
  'chroma_get_documents',
  'chroma_update_documents',
  'chroma_delete_documents'
]);

export class ChromaUpstream {
  private client?: Client;

  constructor(private readonly config: ChromaConfig) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-chroma-wrapper', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: this.config.upstreamCommand,
      args: this.config.upstreamArgs,
      env: this.config.upstreamEnv
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  private async reset(): Promise<void> {
    const client = this.client;
    this.client = undefined;
    if (client) {
      try { await client.close(); } catch { /* best effort */ }
    }
  }

  async close(): Promise<void> {
    await this.reset();
  }

  async call(name: string, args: Record<string, unknown>, options: { write?: boolean } = {}): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const attempts = options.write ? 1 : 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      let timer: NodeJS.Timeout | undefined;
      try {
        const client = await this.connect();
        return await Promise.race([
          client.callTool({ name, arguments: args }),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Chroma MCP timeout after ${this.config.upstreamTimeoutMs}ms${options.write ? '; write outcome may be unknown' : ''}`)), this.config.upstreamTimeoutMs);
          })
        ]);
      } catch (error) {
        lastError = error;
        await this.reset();
        if (options.write || attempt === attempts) throw error;
        await sleep(250 * 2 ** (attempt - 1));
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Chroma MCP call failed');
  }
}
