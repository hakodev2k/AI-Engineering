import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export interface Upstream {
  call(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class ResendMcpUpstream implements Upstream {
  private client: Client;
  private connected = false;
  constructor(private readonly config: Config) {
    this.client = new Client({ name: 'ai-engineering-resend-gateway', version: '1.0.0' });
  }

  private async connect() {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.upstreamUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
    });
    await this.client.connect(transport);
    const listed = await this.client.listTools();
    const allowed = new Set([
      'list-emails','get-email','send-email','cancel-email','list-received-emails','get-received-email',
      'list-contacts','get-contact','create-contact','update-contact','remove-contact','list-domains','get-domain'
    ]);
    for (const tool of listed.tools) if (!allowed.has(tool.name)) continue;
    this.connected = true;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      let attempt = 0;
      while (true) {
        try {
          return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const retryable = /429|rate.?limit|temporar|timeout|5\d\d/i.test(message);
          if (!retryable || attempt >= this.config.maxRetries || controller.signal.aborted) throw error;
          await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
          attempt++;
        }
      }
    } finally {
      clearTimeout(timer);
    }
  }

  async close() { await this.client.close(); }
}
