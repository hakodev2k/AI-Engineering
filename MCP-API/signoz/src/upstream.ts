import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export const TOOL_MAP = {
  'signoz.org.overview': 'signoz_get_org_overview',
  'signoz.metric.list': 'signoz_list_metrics',
  'signoz.metric.query': 'signoz_query_metrics',
  'signoz.service.list': 'signoz_list_services',
  'signoz.alert.list': 'signoz_list_alert_rules',
  'signoz.alert.get': 'signoz_get_alert',
  'signoz.alert.create': 'signoz_create_alert',
  'signoz.alert.update': 'signoz_update_alert',
  'signoz.alert.delete': 'signoz_delete_alert',
  'signoz.dashboard.list': 'signoz_list_dashboards',
  'signoz.dashboard.get': 'signoz_get_dashboard',
  'signoz.log.search': 'signoz_search_logs',
  'signoz.trace.search': 'signoz_search_traces',
  'signoz.trace.get': 'signoz_get_trace_details'
} as const;

export class SigNozMcpClient {
  private client?: Client;
  private connecting?: Promise<void>;

  constructor(private readonly config: Config) {}

  private async ensureConnected(): Promise<void> {
    if (this.client) return;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ name: 'ai-engineering-signoz-connector', version: '1.0.0' });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: {
            headers: {
              'SIGNOZ-API-KEY': this.config.apiKey,
              'X-SigNoz-URL': this.config.signozUrl
            }
          }
        });
        await client.connect(transport);
        const advertised = new Set((await client.listTools()).tools.map(t => t.name));
        for (const upstream of Object.values(TOOL_MAP)) {
          if (!advertised.has(upstream)) throw new Error(`Official SigNoz MCP no longer advertises expected tool: ${upstream}`);
        }
        this.client = client;
      })().finally(() => { this.connecting = undefined; });
    }
    await this.connecting;
  }

  async call(upstreamName: string, args: Record<string, unknown>): Promise<unknown> {
    if (!Object.values(TOOL_MAP).includes(upstreamName as never)) throw new Error(`Blocked unexpected SigNoz MCP tool: ${upstreamName}`);
    await this.ensureConnected();
    const operation = this.client!.callTool({ name: upstreamName, arguments: args });
    const timeout = new Promise<never>((_, reject) => {
      const h = setTimeout(() => reject(new Error(`SigNoz MCP call timed out after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
      h.unref?.();
    });
    const result = await Promise.race([operation, timeout]);
    if (result.isError) throw new Error(`SigNoz MCP tool ${upstreamName} failed`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close().catch(() => undefined);
    this.client = undefined;
  }
}
