import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { QaseConfig } from './config.js';

const ALLOWED = new Set([
  'qase_project_context','qase_get','qql_search','qql_help','qase_case_upsert',
  'qase_defect_upsert','qase_run_upsert','qase_result_record','qase_ci_report','qase_regression_run'
]);

export class QaseUpstream {
  private client?: Client;
  constructor(private readonly config: QaseConfig) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-qase-wrapper', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: this.config.upstreamCommand,
      args: this.config.upstreamArgs,
      env: { ...process.env, QASE_API_TOKEN: this.config.apiToken } as Record<string, string>
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.connect();
    const timeoutMs = this.config.timeoutMs;
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        client.callTool({ name, arguments: args }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`Qase MCP timeout after ${timeoutMs}ms`)), timeoutMs); })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async close(): Promise<void> { if (this.client) await this.client.close(); }
}
