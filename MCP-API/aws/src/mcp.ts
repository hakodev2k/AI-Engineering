import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { AwsConfig } from './config.js';

type Tool = { name: string; inputSchema?: { properties?: Record<string, unknown> } };
type CallResult = { content?: Array<{ type?: string; text?: string }>; isError?: boolean };

export interface McpAdapter {
  listTools(): Promise<{ tools?: Tool[] }>;
  callTool(input: { name: string; arguments?: Record<string, unknown> }): Promise<CallResult>;
  close?(): Promise<void>;
}

type AdapterFactory = (config: AwsConfig) => Promise<McpAdapter>;

async function defaultAdapterFactory(config: AwsConfig): Promise<McpAdapter> {
  if (!config.mcpAccessToken) throw new Error('AWS_MCP_ACCESS_TOKEN is not configured');
  const client = new Client({ name: 'aws-mcp-connector-upstream', version: '1.0.0' });
  const boundedFetch: typeof fetch = (input, init) => {
    const timeout = AbortSignal.timeout(config.timeoutMs);
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    return fetch(input, { ...init, signal });
  };
  const transport = new StreamableHTTPClientTransport(new URL(config.mcpEndpoint), {
    authProvider: { token: async () => config.mcpAccessToken! },
    fetch: boundedFetch
  });
  await client.connect(transport);
  return client as unknown as McpAdapter;
}

export class AwsManagedMcpTransport {
  private adapter?: McpAdapter;
  private tools?: Tool[];
  constructor(private readonly config: AwsConfig, private readonly adapterFactory: AdapterFactory = defaultAdapterFactory) {}

  get enabled() { return Boolean(this.config.preferMcp && this.config.mcpAccessToken); }

  private async getAdapter() {
    if (!this.enabled) throw new Error('AWS managed MCP transport is disabled');
    if (!this.adapter) this.adapter = await this.adapterFactory(this.config);
    return this.adapter;
  }

  async discoverTools() {
    if (!this.enabled) return [];
    if (!this.tools) {
      const adapter = await this.getAdapter();
      const result = await adapter.listTools();
      this.tools = result.tools ?? [];
    }
    return this.tools;
  }

  async runScript(script: string): Promise<unknown> {
    const tools = await this.discoverTools();
    const tool = tools.find(t => t.name === 'aws___run_script' || t.name.endsWith('run_script'));
    if (!tool) throw new Error('AWS managed MCP run_script tool is unavailable');
    const props = tool.inputSchema?.properties ?? {};
    const scriptKey = ['script', 'code', 'python_code'].find(k => k in props);
    if (!scriptKey) throw new Error('AWS managed MCP run_script schema is unsupported by this connector');
    const result = await (await this.getAdapter()).callTool({ name: tool.name, arguments: { [scriptKey]: script } });
    if (result.isError) throw new Error('AWS managed MCP run_script returned an error');
    const text = result.content?.filter(c => c.type === 'text').map(c => c.text ?? '').join('\n') ?? '';
    if (!text) return result;
    try { return JSON.parse(text); } catch { return { text }; }
  }

  async close() {
    if (this.adapter?.close) await this.adapter.close();
    this.adapter = undefined;
    this.tools = undefined;
  }
}

export async function preferMcp<T>(mcp: AwsManagedMcpTransport, script: string, fallback: () => Promise<T>): Promise<T | unknown> {
  if (mcp.enabled) {
    try { return await mcp.runScript(script); } catch { /* fail safely to the equivalent scoped SDK operation */ }
  }
  return fallback();
}
