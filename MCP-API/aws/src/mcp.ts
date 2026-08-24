import { AwsConfig } from './config.js';

type Rpc = { jsonrpc: '2.0'; id: number; method: string; params?: unknown };
type Tool = { name: string; inputSchema?: { properties?: Record<string, unknown> } };

export class AwsManagedMcpTransport {
  private id = 1;
  private tools?: Tool[];
  constructor(private readonly config: AwsConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  get enabled() { return Boolean(this.config.preferMcp && this.config.mcpAccessToken); }

  private async rpc<T>(method: string, params?: unknown): Promise<T> {
    if (!this.config.mcpAccessToken) throw new Error('AWS_MCP_ACCESS_TOKEN is not configured');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const body: Rpc = { jsonrpc: '2.0', id: this.id++, method, ...(params === undefined ? {} : { params }) };
      const res = await this.fetchImpl(this.config.mcpEndpoint, {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${this.config.mcpAccessToken}`, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`AWS MCP HTTP ${res.status}: ${(await res.text()).slice(0, 1000)}`);
      const text = await res.text();
      let parsed: any;
      if ((res.headers.get('content-type') ?? '').includes('text/event-stream')) {
        const data = text.split(/\r?\n/).filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).filter(Boolean).at(-1);
        if (!data) throw new Error('AWS MCP returned an empty event stream');
        parsed = JSON.parse(data);
      } else parsed = JSON.parse(text);
      if (parsed.error) throw new Error(`AWS MCP error ${parsed.error.code}: ${parsed.error.message}`);
      return parsed.result as T;
    } finally { clearTimeout(timer); }
  }

  async discoverTools() {
    if (!this.enabled) return [];
    if (!this.tools) {
      const result = await this.rpc<{ tools?: Tool[] }>('tools/list', {});
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
    const result = await this.rpc<{ content?: Array<{ type?: string; text?: string }>; isError?: boolean }>('tools/call', { name: tool.name, arguments: { [scriptKey]: script } });
    if (result.isError) throw new Error('AWS managed MCP run_script returned an error');
    const text = result.content?.filter(c => c.type === 'text').map(c => c.text ?? '').join('\n') ?? '';
    if (!text) return result;
    try { return JSON.parse(text); } catch { return { text }; }
  }
}

export async function preferMcp<T>(mcp: AwsManagedMcpTransport, script: string, fallback: () => Promise<T>): Promise<T | unknown> {
  if (mcp.enabled) {
    try { return await mcp.runScript(script); } catch { /* fail closed to the scoped SDK fallback */ }
  }
  return fallback();
}
