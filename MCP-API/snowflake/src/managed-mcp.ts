import type { SnowflakeConfig } from './config.js';

interface McpTool {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    properties?: Record<string, { type?: string }>;
    required?: string[];
  };
}

export class SnowflakeManagedMcp {
  private toolsCache?: { at: number; tools: McpTool[] };

  constructor(private readonly config: SnowflakeConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  isConfigured() {
    return Boolean(this.config.mcpUrl && this.config.mcpAccessToken);
  }

  private async rpc(method: string, params?: unknown) {
    if (!this.config.mcpUrl || !this.config.mcpAccessToken) throw new Error('Snowflake managed MCP is not configured');
    const url = new URL(this.config.mcpUrl);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.snowflakecomputing.com')) throw new Error('SNOWFLAKE_MCP_URL must be an HTTPS Snowflake host');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const res = await this.fetchImpl(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.config.mcpAccessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
      });
      if (!res.ok) throw new Error(`Snowflake MCP HTTP ${res.status}`);
      const json = await res.json() as any;
      if (json.error) throw new Error(`Snowflake MCP error: ${json.error.message ?? JSON.stringify(json.error)}`);
      return json.result;
    } finally {
      clearTimeout(timer);
    }
  }

  async listTools(force = false): Promise<McpTool[]> {
    if (!force && this.toolsCache && Date.now() - this.toolsCache.at < 300000) return this.toolsCache.tools;
    const result = await this.rpc('tools/list', {});
    const tools = Array.isArray(result?.tools) ? result.tools : [];
    this.toolsCache = { at: Date.now(), tools };
    return tools;
  }

  async executeRead(sql: string): Promise<unknown | undefined> {
    if (!this.isConfigured()) return undefined;
    const tools = await this.listTools();
    const tool = tools.find(t => t.name === this.config.mcpToolName);
    if (!tool) return undefined;
    const props = tool.inputSchema?.properties ?? {};
    const key = ['query', 'sql', 'statement'].find(k => props[k]?.type === 'string');
    if (!key) return undefined;
    return this.rpc('tools/call', { name: tool.name, arguments: { [key]: sql } });
  }
}
