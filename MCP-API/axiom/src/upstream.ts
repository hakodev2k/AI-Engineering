import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

type ToolDescription = { name: string; inputSchema?: any };
export class AxiomMcpClient {
  private client?: Client;
  private tools?: Map<string, ToolDescription>;
  private connecting?: Promise<void>;
  constructor(private readonly config: Config) {}

  get configured(): boolean { return Boolean(this.config.mcpPat && this.config.orgId); }

  private async connect(): Promise<void> {
    if (!this.configured) throw new Error('Axiom remote MCP header authentication is not configured');
    if (this.client) return;
    if (!this.connecting) this.connecting = (async () => {
      const client = new Client({ name: 'ai-engineering-axiom-connector', version: '1.0.0' });
      const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
        requestInit: { headers: { Authorization: `Bearer ${this.config.mcpPat}`, 'x-axiom-org-id': this.config.orgId! } }
      });
      await client.connect(transport);
      const listed = await client.listTools();
      this.tools = new Map(listed.tools.map(tool => [tool.name, tool as ToolDescription]));
      this.client = client;
    })().finally(() => { this.connecting = undefined; });
    await this.connecting;
  }

  async canUse(name: string): Promise<boolean> {
    if (!this.configured) return false;
    try { await this.connect(); return this.tools?.has(name) ?? false; } catch { return false; }
  }

  private adapt(name: string, canonical: Record<string, unknown>): Record<string, unknown> {
    const schema = this.tools?.get(name)?.inputSchema;
    const props = schema?.properties ?? {};
    if (Object.keys(props).length === 0) return {};
    const out: Record<string, unknown> = {};
    const aliases: Record<string, string[]> = {
      datasetName: ['datasetName', 'dataset', 'name', 'dataset_id', 'datasetId'],
      query: ['query', 'apl'],
      startTime: ['startTime', 'start_time'],
      endTime: ['endTime', 'end_time'],
      id: ['id', 'monitorId', 'monitor_id']
    };
    for (const [key, value] of Object.entries(canonical)) {
      if (value === undefined) continue;
      const target = (aliases[key] ?? [key]).find(candidate => candidate in props);
      if (target) out[target] = value;
    }
    if ('monitor' in props && canonical.monitor && typeof canonical.monitor === 'object') out.monitor = canonical.monitor;
    if (canonical.monitor && typeof canonical.monitor === 'object' && !('monitor' in props)) {
      for (const [key, value] of Object.entries(canonical.monitor as Record<string, unknown>)) if (key in props) out[key] = value;
    }
    return out;
  }

  async call(name: string, canonical: Record<string, unknown> = {}): Promise<unknown> {
    await this.connect();
    if (!this.tools?.has(name)) throw new Error(`Axiom MCP tool is not advertised: ${name}`);
    const result = await this.client!.callTool({ name, arguments: this.adapt(name, canonical) });
    if (result.isError) throw new Error(`Axiom MCP ${name} failed: ${JSON.stringify(result.content)}`);
    return result;
  }

  async close(): Promise<void> { await this.client?.close().catch(() => undefined); this.client = undefined; this.tools = undefined; }
}
