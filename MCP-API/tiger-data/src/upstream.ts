import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConnectorConfig } from './config.js';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class TigerUpstream {
  private client?: Client;
  private tools?: Map<string, Tool>;

  constructor(private readonly config: ConnectorConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const env: Record<string, string> = {
      ...Object.fromEntries(Object.entries(process.env).filter(([, v]) => typeof v === 'string') as [string, string][]),
      TIGER_ANALYTICS: 'false',
      TIGER_VERSION_CHECK: 'false',
      TIGER_OUTPUT: 'json',
      TIGER_READ_ONLY: this.config.allowWrite ? 'false' : 'true'
    };
    if (this.config.publicKey) env.TIGER_PUBLIC_KEY = this.config.publicKey;
    if (this.config.secretKey) env.TIGER_SECRET_KEY = this.config.secretKey;
    if (this.config.serviceId) env.TIGER_SERVICE_ID = this.config.serviceId;

    const transport = new StdioClientTransport({
      command: this.config.cliPath,
      args: ['mcp', 'start'],
      env
    });
    const client = new Client({ name: 'tiger-data-safety-connector', version: '1.0.0' });
    await client.connect(transport);
    this.client = client;
  }

  async discover(): Promise<Map<string, Tool>> {
    await this.connect();
    if (this.tools) return this.tools;
    const listed = await this.client!.listTools();
    this.tools = new Map(listed.tools.map(tool => [tool.name, tool]));
    return this.tools;
  }

  async call(name: string, args: Record<string, unknown>, retryable: boolean): Promise<unknown> {
    await this.connect();
    let attempt = 0;
    while (true) {
      try {
        const result = await Promise.race([
          this.client!.callTool({ name, arguments: args }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Tiger MCP call timed out')), this.config.timeoutMs))
        ]);
        return result;
      } catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        const transient = /429|rate.?limit|timeout|temporar|unavailable|502|503|504|connection reset/i.test(message);
        if (!retryable || !transient || attempt >= this.config.maxRetries) throw error;
        await sleep(Math.min(4000, 250 * 2 ** attempt));
        attempt++;
      }
    }
  }
}

export function sanitizeProviderData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeProviderData);
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (/(password|secret|token|credential|connection.?string|private.?key)/i.test(key)) {
      out[key] = '[REDACTED]';
    } else {
      out[key] = sanitizeProviderData(val);
    }
  }
  return out;
}
