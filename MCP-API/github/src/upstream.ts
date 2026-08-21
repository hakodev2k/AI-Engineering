import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { GitHubConfig } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'get_me',
  'search_repositories',
  'get_file_contents',
  'search_code',
  'search_issues',
  'issue_read',
  'pull_request_read',
  'create_branch',
  'issue_write',
  'add_issue_comment',
  'create_pull_request',
  'merge_pull_request'
]);

const toolHeader = [...ALLOWED_UPSTREAM_TOOLS].join(',');

export class GitHubUpstream {
  private client?: Client;
  constructor(private readonly config: GitHubConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-github-wrapper', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(this.config.mcpUrl, {
      requestInit: {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'X-MCP-Tools': toolHeader
        }
      }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>, timeoutMs = 20_000): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool ${name} is not allowlisted`);
    const client = await this.getClient();
    const request = client.callTool({ name, arguments: args });
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        request,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`GitHub MCP timeout after ${timeoutMs}ms; write outcome may be unknown`)), timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
