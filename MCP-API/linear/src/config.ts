import { z } from 'zod';

const schema = z.object({
  LINEAR_ACCESS_TOKEN: z.string().min(1),
  LINEAR_MCP_URL: z.string().url().default('https://mcp.linear.app/mcp'),
  LINEAR_APPROVAL_SECRET: z.string().min(16),
  LINEAR_ALLOWED_TEAM_IDS: z.string().optional(),
  LINEAR_ALLOWED_PROJECT_IDS: z.string().optional()
});

export type LinearConfig = {
  accessToken: string;
  mcpUrl: URL;
  approvalSecret: string;
  allowedTeamIds: Set<string>;
  allowedProjectIds: Set<string>;
};

function csv(value?: string): Set<string> {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): LinearConfig {
  const parsed = schema.parse(env);
  const url = new URL(parsed.LINEAR_MCP_URL);
  if (url.protocol !== 'https:' || url.hostname !== 'mcp.linear.app' || !['/mcp','/mcp/readonly'].includes(url.pathname)) {
    throw new Error('LINEAR_MCP_URL must be an official Linear MCP endpoint');
  }
  return {
    accessToken: parsed.LINEAR_ACCESS_TOKEN,
    mcpUrl: url,
    approvalSecret: parsed.LINEAR_APPROVAL_SECRET,
    allowedTeamIds: csv(parsed.LINEAR_ALLOWED_TEAM_IDS),
    allowedProjectIds: csv(parsed.LINEAR_ALLOWED_PROJECT_IDS)
  };
}

export function assertTeamAllowed(config: LinearConfig, teamId?: string): void {
  if (!teamId || config.allowedTeamIds.size === 0) return;
  if (!config.allowedTeamIds.has(teamId)) throw new Error(`Team ${teamId} is not allowed`);
}

export function assertProjectAllowed(config: LinearConfig, projectId?: string): void {
  if (!projectId || config.allowedProjectIds.size === 0) return;
  if (!config.allowedProjectIds.has(projectId)) throw new Error(`Project ${projectId} is not allowed`);
}
