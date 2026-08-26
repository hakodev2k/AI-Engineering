import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import { POLICY } from './policy.js';

export class HoneycombUpstream {
  private client?: Client;
  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'honeycomb-safe-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
    });
    await this.withTimeout(client.connect(transport));
    const listed = await this.withTimeout(client.listTools());
    const available = new Set(listed.tools.map((t) => t.name));
    const missing = [...new Set(Object.values(POLICY).map((p) => p.upstream))].filter((name) => !available.has(name));
    if (missing.length) {
      await client.close();
      throw new Error(`Honeycomb MCP missing expected allowlisted tools: ${missing.join(', ')}`);
    }
    this.client = client;
  }

  async call(upstreamTool: string, args: Record<string, unknown>, retryable = true): Promise<unknown> {
    await this.connect();
    let last: unknown;
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    for (let i = 0; i < attempts; i++) {
      try {
        return await this.withTimeout(this.client!.callTool({ name: upstreamTool, arguments: args }));
      } catch (err) {
        last = err;
        if (!retryable || !isRetryable(err) || i + 1 >= attempts) throw err;
        await sleep(Math.min(250 * 2 ** i, 2000));
      }
    }
    throw last;
  }

  async close(): Promise<void> { await this.client?.close(); this.client = undefined; }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error('Honeycomb MCP request timed out')), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }
}

function isRetryable(err: unknown): boolean {
  const s = String(err).toLowerCase();
  return s.includes('429') || s.includes('rate limit') || s.includes('timeout') || s.includes('timed out') || s.includes('502') || s.includes('503') || s.includes('504') || s.includes('econnreset');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
