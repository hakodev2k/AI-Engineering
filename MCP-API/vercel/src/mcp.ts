import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { VercelConfig } from './config.js';

const candidates: Record<string, string[]> = {
  'project.list': ['list_projects'],
  'project.get': ['get_project'],
  'deployment.list': ['list_deployments'],
  'deployment.get': ['get_deployment'],
  'deployment.logs': ['get_runtime_logs', 'get_deployment_logs']
};

export class VercelMcp {
  private client?: Client;
  private names = new Set<string>();
  private connecting?: Promise<void>;
  constructor(private readonly config: VercelConfig) {}

  private async connect() {
    if (this.client || !this.config.mcpEnabled || !this.config.mcpAccessToken) return;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      const client = new Client({ name: 'vercel-mcp-api-connector', version: '1.0.0' });
      const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
        requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
      });
      await client.connect(transport);
      const listed = await client.listTools();
      this.names = new Set(listed.tools.map(t => t.name));
      this.client = client;
    })();
    try { await this.connecting; } finally { this.connecting = undefined; }
  }

  async tryCall(capability: keyof typeof candidates, args: Record<string, unknown>): Promise<unknown | undefined> {
    if (!this.config.mcpEnabled || !this.config.mcpAccessToken) return undefined;
    try {
      await this.connect();
      const name = candidates[capability].find(n => this.names.has(n));
      if (!name || !this.client) return undefined;
      return await this.client.callTool({ name, arguments: args });
    } catch {
      return undefined;
    }
  }

  async close() { await this.client?.close(); }
}
