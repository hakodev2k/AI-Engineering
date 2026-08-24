import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ElasticConfig } from './config.js';

type JsonSchema = { properties?: Record<string, unknown>; required?: string[] };
type ToolInfo = { name: string; inputSchema?: JsonSchema };

const KNOWN_TOOLS = new Set([
  'platform.core.search',
  'platform.core.list_indices',
  'platform.core.get_index_mapping',
  'platform.core.get_document_by_id',
  'platform.core.execute_esql'
]);

const ALIASES: Record<string, string[]> = {
  index: ['index', 'indices', 'index_pattern', 'indexPattern'],
  query: ['query', 'question', 'search_query', 'searchQuery'],
  id: ['id', 'document_id', 'documentId'],
  esql: ['query', 'esql', 'esql_query', 'esqlQuery'],
  limit: ['limit', 'size']
};

export class ElasticAgentBuilderClient {
  private client?: Client;
  private tools = new Map<string, ToolInfo>();
  private failed = false;

  constructor(private readonly config: ElasticConfig) {}

  get configured() {
    return Boolean(this.config.preferMcp && this.config.kibanaUrl && this.config.kibanaApiKey);
  }

  private endpoint() {
    const space = this.config.mcpSpace ? `/s/${encodeURIComponent(this.config.mcpSpace)}` : '';
    return `${this.config.kibanaUrl}${space}/api/agent_builder/mcp`;
  }

  private async ensureConnected() {
    if (!this.configured || this.failed) return false;
    if (this.client) return true;
    try {
      const transport = new StreamableHTTPClientTransport(new URL(this.endpoint()), {
        requestInit: { headers: { Authorization: `ApiKey ${this.config.kibanaApiKey}` } }
      });
      const client = new Client({ name: 'elasticsearch-hybrid-upstream', version: '1.0.0' });
      await client.connect(transport);
      const listed = await client.listTools();
      for (const tool of listed.tools) if (KNOWN_TOOLS.has(tool.name)) this.tools.set(tool.name, tool as ToolInfo);
      this.client = client;
      return true;
    } catch {
      this.failed = true;
      return false;
    }
  }

  private mapArguments(schema: JsonSchema | undefined, canonical: Record<string, unknown>) {
    const properties = schema?.properties ?? {};
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(canonical)) {
      if (value === undefined) continue;
      const target = (ALIASES[key] ?? [key]).find(candidate => candidate in properties);
      if (target) mapped[target] = value;
    }
    for (const required of schema?.required ?? []) if (!(required in mapped)) return null;
    return mapped;
  }

  async call(toolName: string, args: Record<string, unknown>): Promise<unknown | null> {
    if (!KNOWN_TOOLS.has(toolName)) return null;
    if (!(await this.ensureConnected()) || !this.client) return null;
    const tool = this.tools.get(toolName);
    if (!tool) return null;
    const mapped = this.mapArguments(tool.inputSchema, args);
    if (!mapped) return null;
    try {
      return await this.client.callTool({ name: toolName, arguments: mapped });
    } catch {
      return null;
    }
  }

  async close() { await this.client?.close(); }
}
