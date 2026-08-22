export type JiraConfig = {
  accessToken: string;
  mcpUrl: string;
  allowedCloudIds: Set<string>;
  allowedProjectKeys: Set<string>;
  approvalSecret: string;
};

function csv(name: string): Set<string> {
  return new Set((process.env[name] ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env = process.env): JiraConfig {
  const accessToken = env.ATLASSIAN_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('ATLASSIAN_ACCESS_TOKEN is required');

  const mcpUrl = env.ATLASSIAN_MCP_URL?.trim() || 'https://mcp.atlassian.com/v1/mcp/authv2';
  const url = new URL(mcpUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'mcp.atlassian.com' || !url.pathname.startsWith('/v1/mcp')) {
    throw new Error('ATLASSIAN_MCP_URL must use the official https://mcp.atlassian.com/v1/mcp endpoint');
  }

  const approvalSecret = env.JIRA_APPROVAL_SECRET?.trim() ?? '';
  return {
    accessToken,
    mcpUrl,
    allowedCloudIds: new Set((env.JIRA_ALLOWED_CLOUD_IDS ?? '').split(',').map(v => v.trim()).filter(Boolean)),
    allowedProjectKeys: new Set((env.JIRA_ALLOWED_PROJECT_KEYS ?? '').split(',').map(v => v.trim().toUpperCase()).filter(Boolean)),
    approvalSecret
  };
}

export function assertCloudAllowed(config: JiraConfig, cloudId: string): void {
  if (config.allowedCloudIds.size && !config.allowedCloudIds.has(cloudId)) throw new Error('Cloud ID is not allowed');
}

export function assertProjectAllowed(config: JiraConfig, projectKey?: string): void {
  if (!projectKey || !config.allowedProjectKeys.size) return;
  if (!config.allowedProjectKeys.has(projectKey.toUpperCase())) throw new Error('Project key is not allowed');
}

export function projectFromIssueKey(issueKey?: string): string | undefined {
  const match = issueKey?.match(/^([A-Z][A-Z0-9_]+)-\d+$/i);
  return match?.[1]?.toUpperCase();
}
