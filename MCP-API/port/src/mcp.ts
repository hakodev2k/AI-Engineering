import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import { PortTokenProvider } from './auth.js';

const ALLOWED = new Set([
  'list_blueprints','list_entities','list_actions','list_workflows','list_scorecards','list_integrations',
  'get_action_permissions','get_workflow_run','upsert_entity','upsert_blueprint','trigger_run'
]);

export class PortMcpClient {
  private client?: Client;
  constructor(private readonly cfg: Config, private readonly tokens: PortTokenProvider) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    const token = await this.tokens.mcpToken();
    const transport = new StreamableHTTPClientTransport(new URL(this.cfg.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${token}`, 'x-read-only-mode': '0' } }
    });
    const client = new Client({ name: 'daily-port-connector', version: '1.0.0' });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`Upstream MCP tool not allow-listed: ${name}`);
    try {
      const c = await this.connect();
      return await c.callTool({ name, arguments: args });
    } catch (e) {
      await this.close();
      throw e;
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close().catch(() => undefined);
    this.client = undefined;
  }
}
