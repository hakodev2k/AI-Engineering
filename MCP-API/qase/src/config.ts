export type QaseConfig = {
  apiToken: string;
  approvalSecret: string;
  upstreamCommand: string;
  upstreamArgs: string[];
  timeoutMs: number;
  allowedProjects: Set<string>;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): QaseConfig {
  const apiToken = env.QASE_API_TOKEN?.trim();
  if (!apiToken) throw new Error('QASE_API_TOKEN is required');
  const approvalSecret = env.QASE_APPROVAL_SECRET?.trim();
  if (!approvalSecret || approvalSecret.length < 32) throw new Error('QASE_APPROVAL_SECRET must be at least 32 characters');

  const timeoutMs = Number(env.QASE_UPSTREAM_TIMEOUT_MS ?? '20000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('QASE_UPSTREAM_TIMEOUT_MS must be 1000..120000');

  const upstreamCommand = env.QASE_MCP_COMMAND?.trim() || 'npx';
  const upstreamArgs = env.QASE_MCP_ARGS?.trim()
    ? JSON.parse(env.QASE_MCP_ARGS) as string[]
    : ['--yes', '@qase/mcp-server'];
  if (!Array.isArray(upstreamArgs) || upstreamArgs.some(v => typeof v !== 'string')) throw new Error('QASE_MCP_ARGS must be a JSON string array');

  const allowedProjects = new Set((env.QASE_ALLOWED_PROJECTS ?? '').split(',').map(x => x.trim().toUpperCase()).filter(Boolean));
  return { apiToken, approvalSecret, upstreamCommand, upstreamArgs, timeoutMs, allowedProjects };
}

export function assertProjectAllowed(config: QaseConfig, code: string): void {
  if (!/^[A-Z0-9_-]{1,32}$/i.test(code)) throw new Error('Invalid Qase project code');
  if (config.allowedProjects.size && !config.allowedProjects.has(code.toUpperCase())) throw new Error(`Project ${code} is not allowlisted`);
}
