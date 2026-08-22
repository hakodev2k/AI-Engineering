import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWED_UPSTREAM_TOOLS = new Set([
  'get_board_info',
  'get_board_items_page',
  'search',
  'create_item',
  'change_item_column_values',
  'get_updates',
  'create_update',
  'list_workspaces',
  'get_user_context'
]);

export class MondayMcpClient {
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly config: Config) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const client = new Client({ name: 'ai-engineering-monday-upstream', version: '1.0.0' }, { capabilities: {} });
      const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
        requestInit: {
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`
          }
        }
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

  async call(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(toolName)) {
      throw new Error(`UPSTREAM_TOOL_NOT_ALLOWED: ${toolName}`);
    }

    const client = await this.connect();
    const operation = client.callTool({ name: toolName, arguments: args });
    const timeout = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => reject(new Error(`MCP_TIMEOUT: ${toolName}`)), this.config.timeoutMs);
      timer.unref?.();
    });
    return Promise.race([operation, timeout]);
  }

  async verifyAllowlist(): Promise<void> {
    const client = await this.connect();
    const listed = await client.listTools();
    const names = new Set(listed.tools.map(tool => tool.name));
    for (const required of ALLOWED_UPSTREAM_TOOLS) {
      if (!names.has(required)) throw new Error(`MCP_REQUIRED_TOOL_MISSING: ${required}`);
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}
