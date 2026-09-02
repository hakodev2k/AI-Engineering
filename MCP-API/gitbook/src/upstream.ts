import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
export class GitBookMcpClient {
  constructor(private readonly config: Config) {}
  private clients = new Map<string, Client>();
  private async get(url: string, auth: boolean): Promise<Client> {
    const key = `${url}|${auth}`; const found = this.clients.get(key); if (found) return found;
    const c = new Client({ name: 'ai-engineering-gitbook-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(url), auth ? { requestInit: { headers: { Authorization: `Bearer ${this.config.token}` } } } : undefined);
    await c.connect(transport); this.clients.set(key, c); return c;
  }
  async listManagementTools(): Promise<string[]> { const c = await this.get(this.config.mcpUrl, true); return (await c.listTools()).tools.map(t => t.name).sort(); }
  async listPublishedTools(): Promise<string[]> { if (!this.config.publishedMcpUrl) throw new Error('GITBOOK_PUBLISHED_MCP_URL is not configured'); const c = await this.get(this.config.publishedMcpUrl, false); return (await c.listTools()).tools.map(t => t.name).sort(); }
  async close(): Promise<void> { await Promise.all([...this.clients.values()].map(c => c.close().catch(()=>undefined))); this.clients.clear(); }
}
