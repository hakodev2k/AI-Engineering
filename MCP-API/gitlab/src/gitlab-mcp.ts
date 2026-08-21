import { Client } from '@modelcontextprotocol/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import type { ConnectorConfig } from './config.js';

export class GitLabMcpClient {
  private client?: Client;
  constructor(private readonly cfg: ConnectorConfig) {}

  get enabled(): boolean {
    return this.cfg.useUpstreamMcp && Boolean(this.cfg.mcpAccessToken);
  }

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.cfg.mcpAccessToken) throw new Error('GITLAB_MCP_ACCESS_TOKEN is required for upstream GitLab MCP. Use an OAuth token authorized for the mcp scope.');
    const client = new Client({ name: 'ai-engineering-gitlab-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.cfg.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.cfg.mcpAccessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.connect();
    const allowed = new Set([
      'get_issue', 'create_issue', 'get_merge_request', 'list_merge_requests',
      'create_merge_request', 'create_merge_request_note', 'get_merge_request_notes',
      'list_pipelines'
    ]);
    if (!allowed.has(tool)) throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);
    return client.callTool({ name: tool, arguments: args });
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }
}
