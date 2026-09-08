import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { GristConfig } from './auth.js';
import { authHeaders } from './auth.js';

const ALLOWED_UPSTREAM_TOOLS = new Set([
  'grist_list_orgs','grist_list_workspaces','grist_list_docs','grist_get_doc_info',
  'grist_query_document','grist_list_records','grist_get_tables','grist_get_table_columns',
  'grist_add_records','grist_update_records','grist_remove_records','grist_create_doc',
  'grist_create_table','grist_add_table_column','grist_list_attachments','grist_get_attachment_url'
]);

export class UpstreamError extends Error {
  constructor(message: string, public readonly retryable = false) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export interface GristUpstream {
  connect(): Promise<void>;
  close(): Promise<void>;
  call(name: string, args: Record<string, unknown>, retryable?: boolean): Promise<unknown>;
}

export class OfficialGristMcpClient implements GristUpstream {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  constructor(private readonly config: GristConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'ai-engineering-grist-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: authHeaders(this.config) },
      reconnectionOptions: {
        maxReconnectionDelay: 5000,
        initialReconnectionDelay: 250,
        reconnectionDelayGrowFactor: 2,
        maxRetries: this.config.maxRetries,
      },
    });
    await client.connect(transport);
    const listed = await client.listTools();
    const discovered = new Set(listed.tools.map(t => t.name));
    for (const allowed of ALLOWED_UPSTREAM_TOOLS) {
      if (!discovered.has(allowed)) throw new UpstreamError(`Required official Grist MCP tool is unavailable: ${allowed}`);
    }
    this.client = client;
    this.transport = transport;
  }

  async close(): Promise<void> {
    try { await this.client?.close(); } finally {
      this.client = undefined;
      this.transport = undefined;
    }
  }

  async call(name: string, args: Record<string, unknown>, retryable = true): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new UpstreamError(`Upstream tool is not allowlisted: ${name}`);
    await this.connect();
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const timeout = new Promise<never>((_, reject) => {
          const timer = setTimeout(() => reject(new UpstreamError(`Grist MCP call timed out after ${this.config.timeoutMs}ms`, true)), this.config.timeoutMs);
          timer.unref?.();
        });
        return await Promise.race([
          this.client!.callTool({ name, arguments: args }),
          timeout,
        ]);
      } catch (error) {
        last = error;
        const msg = error instanceof Error ? error.message : String(error);
        const permanent = /401|403|unauthor|forbidden|missing scope|invalid|validation/i.test(msg);
        if (permanent || attempt + 1 >= attempts) break;
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)));
      }
    }
    const message = last instanceof Error ? last.message : String(last);
    throw new UpstreamError(`Grist MCP request failed: ${message}`, !/401|403|unauthor|forbidden|invalid/i.test(message));
  }
}

export const upstreamToolAllowlist = ALLOWED_UPSTREAM_TOOLS;
