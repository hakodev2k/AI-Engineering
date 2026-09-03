import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'list_apps', 'get_app_info', 'create_app', 'ps_list', 'ps_restart', 'ps_scale',
  'list_addons', 'get_app_logs', 'pipelines_list', 'maintenance_on', 'maintenance_off'
]);

export class HerokuMcpClient {
  private client?: Client;
  private transport?: StdioClientTransport;
  private connecting?: Promise<void>;

  constructor(private readonly config: Config) {}

  private async connect(): Promise<void> {
    if (!this.config.useOfficialMcp) throw new Error('Official Heroku MCP is disabled');
    if (this.client) return;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ name: 'ai-engineering-heroku-connector', version: '1.0.0' });
        const transport = new StdioClientTransport({
          command: this.config.mcpCommand,
          args: this.config.mcpArgs,
          env: {
            ...process.env,
            HEROKU_API_KEY: this.config.apiKey,
            MCP_SERVER_REQUEST_TIMEOUT: String(this.config.timeoutMs)
          } as Record<string, string>
        });
        await client.connect(transport);
        const names = new Set((await client.listTools()).tools.map(tool => tool.name));
        for (const required of ['list_apps', 'get_app_info', 'ps_list']) {
          if (!names.has(required)) {
            await client.close().catch(() => undefined);
            throw new Error(`Official Heroku MCP missing expected tool: ${required}`);
          }
        }
        this.client = client;
        this.transport = transport;
      })().finally(() => { this.connecting = undefined; });
    }
    await this.connecting;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`Heroku MCP tool is not allowlisted: ${name}`);
    await this.connect();
    const result = await this.client!.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`Heroku MCP ${name} failed: ${JSON.stringify(result.content)}`);
    return result.content;
  }

  async close(): Promise<void> {
    await this.client?.close().catch(() => undefined);
    this.client = undefined;
    this.transport = undefined;
  }
}
