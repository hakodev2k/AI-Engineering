import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import { TOOL_POLICY } from './policy.js';

export class NeonMcpClient {
  private client?: Client;
  constructor(private readonly config: Config) {}

  async connect() {
    if (this.client) return this.client;
    const headers: Record<string, string> = {};
    if (this.config.apiKey) headers.Authorization = `Bearer ${this.config.apiKey}`;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), { requestInit: { headers } });
    const client = new Client({ name: 'ai-engineering-neon-connector', version: '1.0.0' }, { capabilities: {} });
    await this.withTimeout(client.connect(transport));
    const listed = await this.withTimeout(client.listTools());
    const names = new Set(listed.tools.map(t => t.name));
    for (const p of Object.values(TOOL_POLICY)) {
      if (!names.has(p.upstream) && !(this.config.readonly && p.risk !== 'READ')) {
        throw new Error(`Expected official Neon MCP tool is unavailable: ${p.upstream}`);
      }
    }
    this.client = client;
    return client;
  }

  async call(upstream: string, args: Record<string, unknown>) {
    if (!Object.values(TOOL_POLICY).some(p => p.upstream === upstream)) throw new Error('Upstream tool is not allowlisted');
    const client = await this.connect();
    return this.withTimeout(client.callTool({ name: upstream, arguments: args }));
  }

  async close() {
    if (this.client) await this.client.close();
    this.client = undefined;
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error(`Neon MCP timeout after ${this.config.timeoutMs}ms`)), this.config.timeoutMs); })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
