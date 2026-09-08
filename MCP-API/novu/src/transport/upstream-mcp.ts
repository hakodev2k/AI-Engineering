import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from '../auth/config.js';

const ALLOWED = new Set([
  'get_api_key_status','get_environments','create_subscriber','get_subscriber','update_subscriber','delete_subscriber','find_subscribers',
  'get_subscriber_preferences','update_subscriber_preferences','get_workflow','get_workflows','trigger_workflow','cancel_triggered_event',
  'get_notification','get_notifications','get_integrations','get_active_integrations'
]);

export class NovuMcpClient {
  private client?: Client;
  private connecting?: Promise<void>;
  constructor(private cfg: Config) {}

  private async ensureConnected(): Promise<void> {
    if (this.client) return;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      const client = new Client({ name: 'ai-engineering-novu-connector', version: '1.0.0' });
      const transport = new StreamableHTTPClientTransport(new URL(this.cfg.mcpUrl), {
        requestInit: { headers: { Authorization: `Bearer ${this.cfg.secretKey}` } }
      });
      await client.connect(transport);
      const listing = await client.listTools();
      for (const tool of listing.tools) if (!ALLOWED.has(tool.name)) process.stderr.write(`Novu upstream tool ignored: ${tool.name}\n`);
      this.client = client;
    })();
    try { await this.connecting; } finally { this.connecting = undefined; }
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error('UPSTREAM_TOOL_NOT_ALLOWED');
    await this.ensureConnected();
    return this.client!.callTool({ name, arguments: args });
  }
}
