import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { PerplexityConfig } from './config.js';

const MCP_MAP: Record<string, string> = {
  search: 'perplexity_search',
  ask: 'perplexity_ask',
  research: 'perplexity_research',
  reason: 'perplexity_reason'
};

export class PerplexityUpstream {
  private client?: Client;
  constructor(private readonly config: PerplexityConfig) {}

  private async getMcpClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-perplexity-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async callMcp(capability: keyof typeof MCP_MAP, args: Record<string, unknown>): Promise<unknown> {
    const name = MCP_MAP[capability];
    if (!name) throw new Error(`Unsupported MCP capability: ${String(capability)}`);
    const client = await this.getMcpClient();
    return this.withTimeout(client.callTool({ name, arguments: args }), `${name} MCP call`);
  }

  async post(path: '/search' | '/v1/agent' | '/v1/embeddings' | '/v1/contextualizedembeddings', body: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch(new URL(path, this.config.apiBaseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!response.ok) {
        const retryAfter = response.headers.get('retry-after');
        let message = `Perplexity API ${response.status}`;
        if (response.status === 429 && retryAfter) message += `; retry-after=${retryAfter}`;
        if (response.status === 401 || response.status === 403) message += '; check API key, project access, and account limits';
        throw new Error(message);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Perplexity API timeout after ${this.config.timeoutMs}ms`);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
  }

  private async withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`${label} timeout after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
