import { Config } from './config.js';

interface RpcResponse<T> { jsonrpc: '2.0'; id: number; result?: T; error?: { code: number; message: string; data?: unknown } }

export class WeaviateMcpClient {
  private id = 0;
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async call<T>(method: string, params?: unknown): Promise<T> {
    if (!this.config.mcpEnabled) throw new Error('Weaviate MCP is disabled');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const res = await this.fetchImpl(`${this.config.url}/v1/mcp`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {})
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++this.id, method, params })
      });
      if (!res.ok) throw new Error(`Weaviate MCP ${res.status}: ${(await res.text()).slice(0, 2000)}`);
      const contentType = res.headers.get('content-type') ?? '';
      let payload: RpcResponse<T>;
      if (contentType.includes('text/event-stream')) {
        const text = await res.text();
        const dataLine = text.split(/\r?\n/).find(line => line.startsWith('data:'));
        if (!dataLine) throw new Error('Weaviate MCP returned no SSE data event');
        payload = JSON.parse(dataLine.slice(5).trim()) as RpcResponse<T>;
      } else {
        payload = await res.json() as RpcResponse<T>;
      }
      if (payload.error) throw new Error(`Weaviate MCP error ${payload.error.code}: ${payload.error.message}`);
      if (payload.result === undefined) throw new Error('Weaviate MCP response missing result');
      return payload.result;
    } finally {
      clearTimeout(timer);
    }
  }

  listTools() { return this.call<{ tools: Array<{ name: string }> }>('tools/list', {}); }
  invoke(name: string, args: Record<string, unknown>) { return this.call('tools/call', { name, arguments: args }); }
}
