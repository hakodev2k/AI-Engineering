import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { BitbucketConfig } from './config.js';

type JsonSchema = { properties?: Record<string, unknown>; required?: string[] };
type ToolInfo = { name: string; inputSchema?: JsonSchema };

const aliases: Record<string, string[]> = {
  workspace: ['workspace', 'workspaceSlug', 'workspace_slug'],
  repo: ['repo', 'repoSlug', 'repo_slug', 'repository', 'repositorySlug'],
  id: ['id', 'pullRequestId', 'pull_request_id', 'prId'],
  revision: ['revision', 'commit', 'commitHash', 'ref', 'branch'],
  path: ['path', 'filePath', 'file_path'],
  title: ['title'],
  sourceBranch: ['sourceBranch', 'source_branch', 'source'],
  destinationBranch: ['destinationBranch', 'destination_branch', 'destination'],
  description: ['description'],
  content: ['content', 'comment', 'text'],
  message: ['message', 'commitMessage'],
  strategy: ['strategy', 'mergeStrategy', 'merge_strategy'],
  closeSourceBranch: ['closeSourceBranch', 'close_source_branch'],
  state: ['state'],
  pagelen: ['pagelen', 'pageLength', 'limit'],
  q: ['q', 'query'],
  action: ['action']
};

export class RovoBitbucketClient {
  private client?: Client;
  private tools = new Map<string, ToolInfo>();
  private failed = false;

  constructor(private readonly config: BitbucketConfig) {}

  get configured() {
    return this.config.preferMcp && Boolean(this.config.rovoEmail && this.config.rovoApiToken);
  }

  private async ensureConnected() {
    if (!this.configured || this.failed) return false;
    if (this.client) return true;
    try {
      const auth = Buffer.from(`${this.config.rovoEmail}:${this.config.rovoApiToken}`).toString('base64');
      const transport = new StreamableHTTPClientTransport(new URL(this.config.rovoMcpUrl), {
        requestInit: { headers: { Authorization: `Basic ${auth}` } }
      });
      const client = new Client({ name: 'bitbucket-hybrid-upstream', version: '1.0.0' });
      await client.connect(transport);
      const listed = await client.listTools();
      for (const tool of listed.tools) this.tools.set(tool.name, tool as ToolInfo);
      this.client = client;
      return true;
    } catch {
      this.failed = true;
      return false;
    }
  }

  private mapArguments(schema: JsonSchema | undefined, action: string, canonical: Record<string, unknown>) {
    const properties = schema?.properties ?? {};
    const mapped: Record<string, unknown> = {};
    const source = { action, ...canonical };
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      const candidates = aliases[key] ?? [key];
      const target = candidates.find(name => name in properties);
      if (target) mapped[target] = value;
    }
    for (const required of schema?.required ?? []) if (!(required in mapped)) return null;
    return mapped;
  }

  async call(toolName: string, action: string, args: Record<string, unknown>): Promise<unknown | null> {
    if (!(await this.ensureConnected()) || !this.client) return null;
    const tool = this.tools.get(toolName);
    if (!tool) return null;
    const mapped = this.mapArguments(tool.inputSchema, action, args);
    if (!mapped) return null;
    try {
      return await this.client.callTool({ name: toolName, arguments: mapped });
    } catch {
      return null;
    }
  }

  async close() { await this.client?.close(); }
}
