import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { DockerHubConfig } from './config.js';
import { DockerHubRestClient } from './rest.js';

export class DockerHubUpstream {
  private mcp?: Client;
  private mcpConnecting?: Promise<Client | undefined>;
  readonly rest: DockerHubRestClient;

  constructor(private readonly config: DockerHubConfig) {
    this.rest = new DockerHubRestClient(config);
  }

  private async getMcp(): Promise<Client | undefined> {
    if (!this.config.mcpEnabled || !this.config.mcpArgs.length) return undefined;
    if (this.mcp) return this.mcp;
    if (this.mcpConnecting) return this.mcpConnecting;
    this.mcpConnecting = (async () => {
      try {
        const env: Record<string, string> = {};
        for (const [k, v] of Object.entries(process.env)) if (v !== undefined) env[k] = v;
        if (this.config.pat) env.HUB_PAT_TOKEN = this.config.pat;
        const args = [...this.config.mcpArgs];
        if (this.config.username && !args.some(v => v.startsWith('--username='))) args.push(`--username=${this.config.username}`);
        const transport = new StdioClientTransport({ command: this.config.mcpCommand, args, env });
        const client = new Client({ name: 'docker-hub-connector-upstream', version: '1.0.0' });
        await client.connect(transport);
        this.mcp = client;
        return client;
      } catch {
        return undefined;
      } finally {
        this.mcpConnecting = undefined;
      }
    })();
    return this.mcpConnecting;
  }

  async callMcp(tool: string, args: Record<string, unknown>): Promise<unknown | undefined> {
    const client = await this.getMcp();
    if (!client) return undefined;
    try {
      const result = await client.callTool({ name: tool, arguments: args });
      if (result.isError) return undefined;
      return result;
    } catch {
      return undefined;
    }
  }

  async close() {
    if (this.mcp) await this.mcp.close();
  }
}
