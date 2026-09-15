import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export class KitClient {
  private client?: Client;
  constructor(private readonly url=process.env.KIT_MCP_URL ?? 'https://app.kit.com/mcp', private readonly token=process.env.KIT_MCP_ACCESS_TOKEN) {}
  async connect() {
    if (this.client) return this.client;
    if (!this.token) throw new Error('AUTH_CONFIGURATION_ERROR: KIT_MCP_ACCESS_TOKEN is required');
    const client = new Client({name:'ai-engineering-kit-connector',version:'1.0.0'});
    const transport = new StreamableHTTPClientTransport(new URL(this.url), {requestInit:{headers:{Authorization:`Bearer ${this.token}`}}});
    await client.connect(transport);
    this.client = client;
    return client;
  }
  async call(name:string,args:Record<string,unknown>, signal?:AbortSignal) {
    const client=await this.connect();
    const timeout=Number(process.env.KIT_REQUEST_TIMEOUT_MS ?? 20000);
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeout);
    const abort=()=>controller.abort(); signal?.addEventListener('abort',abort,{once:true});
    try { return await client.callTool({name,arguments:args}, undefined, {signal:controller.signal}); }
    finally { clearTimeout(timer); signal?.removeEventListener('abort',abort); }
  }
  async close(){ await this.client?.close(); this.client=undefined; }
}
