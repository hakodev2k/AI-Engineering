import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { JiraConfig } from './config.js';

const ALLOWED_MCP_TOOLS = new Set([
  'getAccessibleAtlassianResources',
  'getVisibleJiraProjects',
  'searchJiraIssuesUsingJql',
  'getJiraIssue',
  'getTransitionsForJiraIssue',
  'addCommentToJiraIssue',
  'editJiraIssue',
  'transitionJiraIssue'
]);

export class JiraUpstream {
  private client?: Client;
  constructor(private readonly config: JiraConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: 'ai-engineering-jira-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async callMcp(name: string, args: Record<string, unknown>, timeoutMs = 30_000): Promise<unknown> {
    if (!ALLOWED_MCP_TOOLS.has(name)) throw new Error(`Upstream MCP tool is not allowlisted: ${name}`);
    const client = await this.getClient();
    const call = client.callTool({ name, arguments: args });
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        call,
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`Atlassian MCP timeout after ${timeoutMs}ms`)), timeoutMs); })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async createIssueRest(input: {
    cloudId: string; projectKey: string; issueTypeId: string; summary: string;
    descriptionText?: string; labels?: string[]; assigneeAccountId?: string; parentKey?: string;
    customFields?: Record<string, unknown>;
  }): Promise<unknown> {
    const fields: Record<string, unknown> = {
      project: { key: input.projectKey },
      issuetype: { id: input.issueTypeId },
      summary: input.summary,
      ...(input.labels ? { labels: input.labels } : {}),
      ...(input.assigneeAccountId ? { assignee: { accountId: input.assigneeAccountId } } : {}),
      ...(input.parentKey ? { parent: { key: input.parentKey } } : {}),
      ...(input.customFields ?? {})
    };
    if (input.descriptionText) {
      fields.description = {
        type: 'doc', version: 1,
        content: [{ type: 'paragraph', content: [{ type: 'text', text: input.descriptionText }] }]
      };
    }

    const response = await fetch(`https://api.atlassian.com/ex/jira/${encodeURIComponent(input.cloudId)}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(20_000)
    });
    const text = await response.text();
    const body = text ? JSON.parse(text) : {};
    if (!response.ok) {
      const retryAfter = response.headers.get('retry-after');
      throw new Error(`Jira REST ${response.status}: ${JSON.stringify(body)}${retryAfter ? `; retry-after=${retryAfter}` : ''}`);
    }
    return body;
  }
}
