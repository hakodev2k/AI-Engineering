import { Client, StreamableHTTPClientTransport, type AuthProvider } from '@modelcontextprotocol/client';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'WhoAmI', 'ListFolder', 'GetFileMetadata', 'Search', 'CreateFolder', 'CreateFile',
  'CreateSharedLink', 'ListSharedLinks', 'Copy', 'Move', 'Delete',
  'ListFileRevisions', 'RestoreFileRevision'
]);

export class DropboxUpstreamMcp {
  private client?: Client;
  private discovered?: Set<string>;
  constructor(private readonly config: Config) {}

  get enabled(): boolean { return Boolean(this.config.mcpAccessToken); }

  private withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`${label} timed out after ${this.config.timeoutMs} ms`)), this.config.timeoutMs);
      promise.then(v => { clearTimeout(timer); resolve(v); }, e => { clearTimeout(timer); reject(e); });
    });
  }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.config.mcpAccessToken) throw new Error('DROPBOX_MCP_ACCESS_TOKEN is not configured');
    const authProvider: AuthProvider = { token: async () => this.config.mcpAccessToken };
    const client = new Client({ name: 'ai-engineering-dropbox-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), { authProvider });
    await this.withTimeout(client.connect(transport), 'Dropbox MCP connect');
    const advertised = await this.withTimeout(client.listTools(), 'Dropbox MCP tools/list');
    this.discovered = new Set(advertised.tools.map(tool => tool.name).filter(name => ALLOWED.has(name)));
    this.client = client;
    return client;
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(tool)) throw new Error(`Upstream Dropbox MCP tool is not allowlisted: ${tool}`);
    const client = await this.getClient();
    if (!this.discovered?.has(tool)) throw new Error(`Dropbox MCP did not advertise required tool: ${tool}`);
    const result = await this.withTimeout(client.callTool({ name: tool, arguments: args }), `Dropbox MCP ${tool}`);
    if ((result as any)?.isError) throw new Error(`Dropbox MCP tool ${tool} returned an error`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.discovered = undefined;
  }
}
