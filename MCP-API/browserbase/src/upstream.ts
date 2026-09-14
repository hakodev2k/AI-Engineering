import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED = new Set(['start','end','navigate','act','observe','extract']);

export class BrowserbaseMcp {
  private client?: Client;
  constructor(private readonly config: Config) {}
  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-browserbase-wrapper', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(this.config.mcpUrl));
    this.client = client;
    return client;
  }
  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`PERMISSION_DENIED: upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`TIMEOUT: Browserbase MCP exceeded ${this.config.timeoutMs}ms`)), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }
}
