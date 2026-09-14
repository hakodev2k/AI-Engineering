import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set(['get_file_report','get_url_report','get_domain_report','get_ip_report','get_analysis','get_submission','submit_file']);
const READ_TOOLS = new Set(['get_file_report','get_url_report','get_domain_report','get_ip_report','get_analysis','get_submission']);

export class VirusTotalUpstream {
  private client?: Client;
  constructor(private readonly config: Config) {}

  private async getClient() {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-virustotal-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: { headers: { Authorization: `Bearer ${this.config.token}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>) {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timed out after ${this.config.timeoutMs}ms${READ_TOOLS.has(name) ? '' : '; write outcome may be unknown'}`)), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }
}
