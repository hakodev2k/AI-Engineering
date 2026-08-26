import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'snyk_sca_scan',
  'snyk_code_scan',
  'snyk_iac_scan',
  'snyk_container_scan',
  'snyk_sbom_scan',
  'snyk_aibom'
]);

export class SnykMcpClient {
  private client?: Client;
  private transport?: StdioClientTransport;

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const env: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) if (typeof value === 'string') env[key] = value;
    env.SNYK_TOKEN = this.config.SNYK_TOKEN;
    if (this.config.SNYK_ORG_ID) env.SNYK_CFG_ORG = this.config.SNYK_ORG_ID;
    this.transport = new StdioClientTransport({
      command: this.config.SNYK_CLI_PATH,
      args: ['mcp', '-t', 'stdio'],
      env
    });
    this.client = new Client({ name: 'ai-engineering-snyk-connector', version: '1.0.0' });
    await this.client.connect(this.transport);
    const discovered = await this.client.listTools();
    const names = new Set(discovered.tools.map(t => t.name));
    for (const name of ALLOWED) {
      if (!names.has(name)) throw new Error(`Official Snyk MCP server is missing expected tool: ${name}`);
    }
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED.has(tool)) throw new Error(`Upstream Snyk MCP tool is not allowlisted: ${tool}`);
    await this.connect();
    const result = await this.client!.callTool({ name: tool, arguments: args });
    if (result.isError) throw new Error(`Snyk MCP tool ${tool} failed`);
    return result;
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
    this.transport = undefined;
  }
}
