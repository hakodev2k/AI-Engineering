import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export interface Upstream {
  call(name: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<unknown>;
  close(): Promise<void>;
}

export class PostmarkUpstream implements Upstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  constructor(private readonly config: Config) {}

  private async ensureConnected(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-postmark-connector', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@activecampaign/postmark-mcp'],
      env: {
        ...process.env,
        POSTMARK_SERVER_TOKEN: this.config.serverToken,
        DEFAULT_SENDER_EMAIL: this.config.defaultSenderEmail,
        DEFAULT_MESSAGE_STREAM: this.config.defaultMessageStream,
        WEBHOOK_URL_ALLOWLIST: this.config.webhookUrlAllowlist.join(',')
      }
    });
    await client.connect(transport);
    this.client = client;
    this.transport = transport;
    return client;
  }

  async call(name: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<unknown> {
    const client = await this.ensureConnected();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error(`Postmark upstream timeout after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
    const onAbort = () => controller.abort(signal?.reason);
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      return await client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    }
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}
