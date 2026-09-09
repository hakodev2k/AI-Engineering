import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'integrations_list',
  'integrations_get',
  'connections_list',
  'connect_session_create',
  'functions_list',
  'logs_list_operations',
  'logs_get_operation'
]);

export class NangoManagementClient {
  private client?: Client;
  constructor(private readonly config: Config) {}

  async connect(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-nango-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.managementMcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.secretKey}` } }
    });
    await client.connect(transport);
    const listed = await client.listTools();
    const available = new Set(listed.tools.map((t) => t.name));
    for (const name of ALLOWED_UPSTREAM_TOOLS) {
      if (!available.has(name)) throw new Error(`REQUIRED_UPSTREAM_TOOL_MISSING:${name}`);
    }
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error('UPSTREAM_TOOL_NOT_ALLOWED');
    const client = await this.connect();
    const result = await Promise.race([
      client.callTool({ name, arguments: args }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('UPSTREAM_TIMEOUT')), this.config.timeoutMs))
    ]);
    return result;
  }
}
