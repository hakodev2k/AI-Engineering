import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'health_check','list_databases','list_tables','describe_table','query_sql','query_influxql',
  'investigate_database','write_line_protocol','create_database','update_database','delete_database'
]);

export class InfluxUpstream {
  private client?: Client;
  constructor(private readonly config: Config) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-influxdb-wrapper', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@influxdata/influxdb3-mcp-server'],
      env: {
        ...process.env,
        INFLUX_DB_INSTANCE_URL: this.config.instanceUrl,
        INFLUX_DB_TOKEN: this.config.token,
        INFLUX_DB_PRODUCT_TYPE: this.config.productType,
        INFLUX_MCP_TOOL_PROFILE: 'full'
      } as Record<string, string>
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`InfluxDB MCP timeout after ${this.config.timeoutMs}ms`)), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }

  async close(): Promise<void> { if (this.client) await this.client.close(); }
}
