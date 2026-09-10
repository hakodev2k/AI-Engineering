import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';
import { basicAuth } from './config.js';
import type { Scope } from './policy.js';

export type UpstreamTool = { name: string; description?: string; inputSchema: Record<string,unknown> };
export interface Upstream {
  list(scope: Scope): Promise<UpstreamTool[]>;
  call(scope: Scope, name: string, args: Record<string,unknown>): Promise<unknown>;
  close(): Promise<void>;
}

class EndpointClient {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  constructor(private url: string, private config: Config) {}
  async connect(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'confluent-cloud-safe-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.url), {
      requestInit: { headers: { Authorization: basicAuth(this.config) } }
    });
    await Promise.race([
      client.connect(transport),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Confluent MCP connection timeout')), this.config.timeoutMs))
    ]);
    this.client = client; this.transport = transport; return client;
  }
  async list(): Promise<UpstreamTool[]> {
    const c = await this.connect();
    const r = await c.listTools();
    return r.tools.map(t => ({ name: t.name, description: t.description, inputSchema: t.inputSchema as Record<string,unknown> }));
  }
  async call(name: string, args: Record<string,unknown>): Promise<unknown> {
    const c = await this.connect();
    return Promise.race([
      c.callTool({ name, arguments: args }),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Confluent MCP call timeout: ${name}`)), this.config.timeoutMs))
    ]);
  }
  async close(): Promise<void> { await this.client?.close(); }
}

export class ConfluentUpstream implements Upstream {
  private global: EndpointClient;
  private regional?: EndpointClient;
  constructor(private config: Config) {
    this.global = new EndpointClient(config.globalUrl, config);
    if (config.regionalUrl) this.regional = new EndpointClient(config.regionalUrl, config);
  }
  private endpoint(scope: Scope): EndpointClient {
    if (scope === 'global') return this.global;
    if (!this.regional) throw new Error('Regional MCP is not configured');
    return this.regional;
  }
  list(scope: Scope) { return this.endpoint(scope).list(); }
  async call(scope: Scope, name: string, args: Record<string,unknown>): Promise<unknown> {
    const attempts = scope === 'global' || scope === 'regional' ? this.config.maxReadRetries + 1 : 1;
    let last: unknown;
    for (let i=0;i<attempts;i++) {
      try { return await this.endpoint(scope).call(name,args); }
      catch (e) {
        last=e;
        const msg=String(e).toLowerCase();
        if (!(msg.includes('429')||msg.includes('rate')||msg.includes('timeout')||msg.includes('502')||msg.includes('503')||msg.includes('504'))) break;
        if (i+1<attempts) await new Promise(r=>setTimeout(r, Math.min(4000,250*2**i)));
      }
    }
    throw last;
  }
  async close() { await this.global.close(); await this.regional?.close(); }
}
