import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export class AlgoliaMcp {
  constructor(private url?: string) {}
  async search(index: string, query: string, params: Record<string, unknown>): Promise<any | undefined> {
    if (!this.url) return undefined;
    const client = new Client({ name: 'algolia-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.url));
    try {
      await client.connect(transport);
      const tools = await client.listTools();
      const dynamic = `algolia_search_${index.replace(/[^A-Za-z0-9_]/g, '_')}`;
      const name = [dynamic, 'algolia_search_index', 'search'].find(n => tools.tools.some(t => t.name === n));
      if (!name) return undefined;
      const args = name === dynamic ? { query, ...params } : name === 'algolia_search_index' ? { indexName: index, query, ...params } : { query, index };
      return await client.callTool({ name, arguments: args });
    } finally { await client.close().catch(() => undefined); }
  }
}
