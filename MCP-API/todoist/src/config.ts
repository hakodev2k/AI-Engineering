export type Config = {
  apiToken: string;
  apiBaseUrl: string;
  mcpUrl: string;
  mcpAccessToken?: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};

const parseBool = (v: string | undefined, fallback: boolean) =>
  v == null ? fallback : /^(1|true|yes)$/i.test(v.trim());

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.TODOIST_API_TOKEN?.trim();
  if (!apiToken) throw new Error('TODOIST_API_TOKEN is required');

  const timeoutMs = Number(env.TODOIST_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.TODOIST_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('TODOIST_TIMEOUT_MS must be an integer between 1000 and 120000');
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) {
    throw new Error('TODOIST_MAX_RETRIES must be an integer between 0 and 5');
  }

  const apiBaseUrl = new URL(env.TODOIST_API_BASE_URL ?? 'https://api.todoist.com/api/v1')
    .toString().replace(/\/$/, '');
  const mcpUrl = new URL(env.TODOIST_MCP_URL ?? 'https://ai.todoist.net/mcp').toString();
  const mcpAccessToken = env.TODOIST_MCP_ACCESS_TOKEN?.trim() || undefined;
  const approvedActions = new Set(
    (env.TODOIST_APPROVED_ACTIONS ?? '').split(',').map(x => x.trim()).filter(Boolean)
  );

  return {
    apiToken,
    apiBaseUrl,
    mcpUrl,
    mcpAccessToken,
    timeoutMs,
    maxRetries,
    requireWriteApproval: parseBool(env.TODOIST_REQUIRE_WRITE_APPROVAL, true),
    approvedActions
  };
}
