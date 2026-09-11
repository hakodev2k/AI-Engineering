import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'get-projects','get-environments','deploy-environment','abort-environment','approve-environment','cancel-environment',
  'get-plan-logs','get-error-analysis','get-deployment-context','search-deployments','get-cloud-configurations',
  'get-cloud-resources','generate-iac','check-iac-job-status'
]);

export interface Env0Upstream { call(name: string, args: Record<string, unknown>): Promise<unknown>; close(): Promise<void>; }

export class Env0McpClient implements Env0Upstream {
  private client?: Client;
  private connecting?: Promise<void>;
  constructor(private readonly config: Config) {}

  private async ensureConnected(): Promise<void> {
    if (this.client) return;
    if (!this.connecting) this.connecting = (async () => {
      const client = new Client({ name: 'ai-engineering-env0-connector', version: '1.0.0' });
      const args = ['run','-i','--rm','-e',`ENV0_API_KEY=${this.config.apiKey}`,'-e',`ENV0_API_SECRET=${this.config.apiSecret}`];
      if (this.config.organizationId) args.push('-e', `ENV0_ORGANIZATION_ID=${this.config.organizationId}`);
      args.push(this.config.image);
      const transport = new StdioClientTransport({ command: 'docker', args });
      await client.connect(transport);
      const advertised = new Set((await client.listTools()).tools.map(t => t.name));
      for (const name of ALLOWED_UPSTREAM_TOOLS) if (!advertised.has(name)) throw new Error(`Official env0 MCP no longer advertises expected tool: ${name}`);
      this.client = client;
    })().finally(() => { this.connecting = undefined; });
    await this.connecting;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Blocked unexpected env0 MCP tool: ${name}`);
    await this.ensureConnected();
    const operation = this.client!.callTool({ name, arguments: args });
    const timeout = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => reject(new Error('env0 MCP call timed out')), this.config.timeoutMs);
      timer.unref?.();
    });
    const result = await Promise.race([operation, timeout]);
    if (result.isError) throw new Error(`env0 MCP tool ${name} failed`);
    return result;
  }

  async close(): Promise<void> { await this.client?.close().catch(() => undefined); this.client = undefined; }
}
