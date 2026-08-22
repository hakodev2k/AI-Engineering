import { z } from 'zod';

const schema = z.object({
  GITHUB_ACCESS_TOKEN: z.string().min(1),
  GITHUB_MCP_URL: z.string().url().default('https://api.githubcopilot.com/mcp/'),
  GITHUB_APPROVAL_SECRET: z.string().min(16),
  GITHUB_ALLOWED_OWNERS: z.string().optional(),
  GITHUB_ALLOWED_REPOSITORIES: z.string().optional()
});

export type GitHubConfig = {
  accessToken: string;
  mcpUrl: URL;
  approvalSecret: string;
  allowedOwners: Set<string>;
  allowedRepositories: Set<string>;
};

function csv(value?: string): Set<string> {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GitHubConfig {
  const parsed = schema.parse(env);
  const url = new URL(parsed.GITHUB_MCP_URL);
  if (url.protocol !== 'https:' || url.hostname !== 'api.githubcopilot.com' || url.pathname !== '/mcp/') {
    throw new Error('GITHUB_MCP_URL must be the official GitHub remote MCP endpoint https://api.githubcopilot.com/mcp/');
  }
  return {
    accessToken: parsed.GITHUB_ACCESS_TOKEN,
    mcpUrl: url,
    approvalSecret: parsed.GITHUB_APPROVAL_SECRET,
    allowedOwners: csv(parsed.GITHUB_ALLOWED_OWNERS),
    allowedRepositories: csv(parsed.GITHUB_ALLOWED_REPOSITORIES)
  };
}

export function assertRepositoryAllowed(config: GitHubConfig, owner: string, repo: string): void {
  const normalizedOwner = owner.trim().toLowerCase();
  const full = `${normalizedOwner}/${repo.trim().toLowerCase()}`;
  if (config.allowedOwners.size > 0 && !config.allowedOwners.has(normalizedOwner)) throw new Error(`Owner ${owner} is not allowed`);
  if (config.allowedRepositories.size > 0 && !config.allowedRepositories.has(full)) throw new Error(`Repository ${owner}/${repo} is not allowed`);
}
