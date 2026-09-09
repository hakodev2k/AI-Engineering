import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import type { Risk } from './policy.js';

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface UpstreamCaller {
  listTools(): Promise<UpstreamTool[]>;
  call(name: string, args: Record<string, unknown>, risk: Risk, signal?: AbortSignal): Promise<unknown>;
  close(): Promise<void>;
}

const transientPattern = /(?:429|rate.?limit|too many requests|502|503|504|timeout|timed out|temporar|connection reset|econnreset|econnrefused)/i;
const authPattern = /(?:401|403|unauthori[sz]ed|forbidden|api.?key|authentication|permission)/i;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason ?? new Error('Operation aborted'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason ?? new Error('Operation aborted'));
    }, { once: true });
  });
}

export class FlagsmithUpstream implements UpstreamCaller {
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly cfg: Config) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      const client = new Client({ name: 'ai-engineering-flagsmith-connector', version: '1.0.0' });
      const transport = new StreamableHTTPClientTransport(this.cfg.mcpUrl, {
        requestInit: { headers: { Authorization: `Api-Key ${this.cfg.apiToken}` } },
      });
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

  private reset(): void {
    this.client = undefined;
  }

  async listTools(): Promise<UpstreamTool[]> {
    const client = await this.getClient();
    const result = await client.listTools(undefined, { timeout: this.cfg.timeoutMs });
    return result.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema as Record<string, unknown>,
    }));
  }

  async call(name: string, args: Record<string, unknown>, risk: Risk, signal?: AbortSignal): Promise<unknown> {
    const attempts = risk === 'READ' ? this.cfg.maxReadRetries : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const client = await this.getClient();
        return await client.callTool({ name, arguments: args }, undefined, { signal, timeout: this.cfg.timeoutMs });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        if (authPattern.test(message) || risk !== 'READ' || !transientPattern.test(message) || attempt === attempts) throw error;
        this.reset();
        await delay(Math.min(250 * 2 ** (attempt - 1), 2000), signal);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Flagsmith upstream call failed');
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}
