import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const LOCAL_MCP_PACKAGE = '@launchdarkly/mcp-server@0.6.2';
const ALLOWED = new Set([
  'list-feature-flags',
  'get-feature-flag',
  'create-feature-flag',
  'update-feature-flag',
  'delete-feature-flag'
]);

export class LaunchDarklyMcpClient {
  constructor(private readonly config: Config) {}

  async call(tool: string, request: Record<string, unknown>, scope: 'read' | 'write'): Promise<unknown> {
    if (!ALLOWED.has(tool)) throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);
    if (this.config.mcpMode === 'rest') throw new Error('Upstream MCP disabled by configuration');

    const client = new Client({ name: 'ai-engineering-launchdarkly-connector', version: '1.0.0' });
    const transport = this.config.mcpMode === 'hosted' ? this.hostedTransport() : this.localTransport(tool, scope);
    try {
      await client.connect(transport);
      const result = await client.callTool({ name: tool, arguments: { request } });
      if (result.isError) throw new Error(`LaunchDarkly upstream MCP error: ${JSON.stringify(result.content)}`);
      return { source: 'official-launchdarkly-mcp', untrusted: true, content: result.content };
    } finally {
      await client.close().catch(() => undefined);
    }
  }

  private hostedTransport(): StreamableHTTPClientTransport {
    if (!this.config.mcpAccessToken) throw new Error('Hosted MCP requires a securely provisioned LAUNCHDARKLY_MCP_ACCESS_TOKEN from an OAuth-capable credential broker');
    const url = new URL(this.config.mcpServerUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'mcp.launchdarkly.com') throw new Error('Hosted MCP URL must be the official mcp.launchdarkly.com HTTPS endpoint');
    return new StreamableHTTPClientTransport(url, { requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } } });
  }

  private localTransport(tool: string, scope: 'read' | 'write'): StdioClientTransport {
    if (!this.config.accessToken) throw new Error('Local LaunchDarkly MCP requires LAUNCHDARKLY_ACCESS_TOKEN');
    return new StdioClientTransport({
      command: 'npx',
      args: ['-y', '--package', LOCAL_MCP_PACKAGE, '--', 'mcp', 'start', '--api-key', this.config.accessToken, '--scope', scope, '--tool', tool],
      env: { ...process.env } as Record<string, string>
    });
  }
}
