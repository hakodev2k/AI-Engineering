import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Config } from './config.js';

export type Service = 'droplets' | 'networking';

type Connected = { client: Client; tools: Set<string> };

export class DigitalOceanMcpBridge {
  private readonly clients = new Map<Service, Promise<Connected>>();

  constructor(private readonly config: Config) {}

  private connect(service: Service): Promise<Connected> {
    const existing = this.clients.get(service);
    if (existing) return existing;
    const connection = (async () => {
      if (!this.config.mcpEnabled) throw new Error('DigitalOcean MCP disabled');
      const transport = new StdioClientTransport({
        command: this.config.mcpCommand,
        args: ['-y', '@digitalocean/mcp', '--services', service],
        env: { DIGITALOCEAN_API_TOKEN: this.config.token }
      });
      const client = new Client({ name: `digitalocean-${service}-bridge`, version: '1.0.0' });
      await client.connect(transport);
      const listed = await client.listTools();
      return { client, tools: new Set(listed.tools.map(tool => tool.name)) };
    })();
    this.clients.set(service, connection);
    connection.catch(() => this.clients.delete(service));
    return connection;
  }

  async call<T>(service: Service, tool: string, args: Record<string, unknown>, fallback: () => Promise<T>): Promise<T> {
    try {
      const { client, tools } = await this.connect(service);
      if (!tools.has(tool)) return await fallback();
      const result = await client.callTool({ name: tool, arguments: args });
      if (result.isError) return await fallback();
      return result as T;
    } catch {
      return await fallback();
    }
  }
}
