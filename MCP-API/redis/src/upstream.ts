import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { RedisConnectorConfig } from './config.js';

export class RedisMcpUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  constructor(private readonly config: RedisConnectorConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'redis-connector-upstream', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: this.config.upstreamCommand,
      args: this.config.upstreamArgs,
      env: { ...process.env, REDIS_URL: this.config.redisUrl } as Record<string, string>
    });
    await Promise.race([
      client.connect(transport),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Redis MCP upstream connection timeout')), this.config.upstreamTimeoutMs))
    ]);
    this.client = client;
    this.transport = transport;
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const tools = await this.client!.listTools();
    if (!tools.tools.some(t => t.name === tool)) throw new Error(`Official Redis MCP tool not available: ${tool}`);
    return await Promise.race([
      this.client!.callTool({ name: tool, arguments: args }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Redis MCP tool timeout: ${tool}`)), this.config.upstreamTimeoutMs))
    ]);
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}
