import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'list_projects','get_project','create_project','update_project','delete_project','get_project_report',
  'list_faults','get_fault','update_fault','get_fault_counts','list_fault_notices','list_fault_affected_users',
  'query_insights','list_streams','list_check_ins','get_check_in'
]);

export class HoneybadgerUpstream {
  private client?: Client;
  constructor(private readonly cfg: Config) {}

  private async getClient() {
    if (this.client) return this.client;
    const inherited = Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string,string] => typeof entry[1] === 'string'));
    const env: Record<string,string> = {
      ...inherited,
      HONEYBADGER_PERSONAL_AUTH_TOKEN: this.cfg.token,
      HONEYBADGER_API_URL: this.cfg.apiUrl,
      HONEYBADGER_READ_ONLY: 'false',
      LOG_LEVEL: 'error'
    };
    const command = this.cfg.upstreamCommand;
    const args = command === 'docker'
      ? ['run','-i','--rm','-e','HONEYBADGER_PERSONAL_AUTH_TOKEN','-e','HONEYBADGER_API_URL','-e','HONEYBADGER_READ_ONLY','-e','LOG_LEVEL',this.cfg.upstreamImage]
      : ['stdio','--read-only=false'];
    const transport = new StdioClientTransport({ command, args, env });
    const client = new Client({ name: 'ai-engineering-honeybadger-connector', version: '1.0.0' });
    await client.connect(transport);
    const discovered = await client.listTools();
    const names = new Set(discovered.tools.map(t => t.name));
    for (const required of ALLOWED) if (!names.has(required)) throw new Error(`Official Honeybadger MCP is missing expected tool: ${required}`);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>) {
    if (!ALLOWED.has(name)) throw new Error(`Upstream MCP tool is not allowlisted: ${name}`);
    const client = await this.getClient();
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`Official Honeybadger MCP tool failed: ${name}`);
    return result;
  }
}
