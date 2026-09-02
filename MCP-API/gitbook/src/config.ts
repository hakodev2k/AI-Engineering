export type Config = {
  token: string; apiBaseUrl: string; mcpUrl: string; publishedMcpUrl?: string;
  timeoutMs: number; maxRetries: number; requireWriteApproval: boolean; approvedActions: Set<string>;
};
const bool = (v: string | undefined, d: boolean) => v == null ? d : /^(1|true|yes)$/i.test(v);
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.GITBOOK_TOKEN?.trim();
  if (!token) throw new Error('GITBOOK_TOKEN is required');
  const timeoutMs = Number(env.GITBOOK_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.GITBOOK_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('GITBOOK_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('GITBOOK_MAX_RETRIES must be 0..5');
  const apiBaseUrl = new URL(env.GITBOOK_API_BASE_URL ?? 'https://api.gitbook.com/v1').toString().replace(/\/$/, '');
  const mcpUrl = new URL(env.GITBOOK_MCP_URL ?? 'https://mcp.gitbook.com/mcp').toString();
  const publishedMcpUrl = env.GITBOOK_PUBLISHED_MCP_URL ? new URL(env.GITBOOK_PUBLISHED_MCP_URL).toString() : undefined;
  return { token, apiBaseUrl, mcpUrl, publishedMcpUrl, timeoutMs, maxRetries,
    requireWriteApproval: bool(env.GITBOOK_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.GITBOOK_APPROVED_ACTIONS ?? '').split(',').map(x => x.trim()).filter(Boolean)) };
}
