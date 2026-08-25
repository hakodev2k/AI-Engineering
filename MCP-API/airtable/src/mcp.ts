import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { AirtableConfig } from './config.js';

type ToolShape = { name: string; inputSchema?: { type?: string; properties?: Record<string, unknown>; required?: string[] } };

const ARG_ALIASES: Record<string, string[]> = {
  baseId: ['baseId', 'base_id', 'base'],
  tableId: ['tableId', 'table_id', 'table', 'tableName'],
  recordId: ['recordId', 'record_id', 'id'],
  fields: ['fields'],
  records: ['records'],
  filterByFormula: ['filterByFormula', 'filter_by_formula', 'filter'],
  view: ['view'],
  pageSize: ['pageSize', 'page_size', 'limit'],
  offset: ['offset'],
  typecast: ['typecast']
};

export class AirtableMcpClient {
  private client?: Client;
  private tools?: ToolShape[];
  constructor(private readonly config: AirtableConfig) {}

  private async ensure() {
    if (!this.config.useMcp || !this.config.mcpToken) return false;
    if (this.client) return true;
    const headers = { Authorization: `Bearer ${this.config.mcpToken}` };
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), { requestInit: { headers } });
    const client = new Client({ name: 'airtable-hybrid-connector', version: '1.0.0' });
    try {
      await client.connect(transport);
      const listed = await client.listTools();
      this.client = client;
      this.tools = listed.tools as ToolShape[];
      return true;
    } catch {
      try { await client.close(); } catch { }
      return false;
    }
  }

  async tryCall(aliasNames: string[], canonicalArgs: Record<string, unknown>): Promise<unknown | undefined> {
    if (!await this.ensure() || !this.client || !this.tools) return undefined;
    const tool = this.tools.find(t => aliasNames.includes(t.name));
    if (!tool) return undefined;
    const props = tool.inputSchema?.properties ?? {};
    const required = new Set(tool.inputSchema?.required ?? []);
    const args: Record<string, unknown> = {};
    for (const [canonical, value] of Object.entries(canonicalArgs)) {
      if (value === undefined) continue;
      const aliases = ARG_ALIASES[canonical] ?? [canonical];
      const target = aliases.find(a => Object.prototype.hasOwnProperty.call(props, a));
      if (target) args[target] = value;
    }
    for (const req of required) if (!(req in args)) return undefined;
    try {
      return await this.client.callTool({ name: tool.name, arguments: args });
    } catch {
      return undefined;
    }
  }

  async close() { if (this.client) await this.client.close(); }
}
