export type Config = {
  token: string;
  apiUrl: string;
  orgId?: string;
  mcpUrl: string;
  mcpPat?: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  approvedActions: Set<string>;
};

const toBool = (value: string | undefined, fallback: boolean): boolean =>
  value == null ? fallback : /^(1|true|yes)$/i.test(value);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.AXIOM_TOKEN?.trim();
  if (!token) throw new Error('AXIOM_TOKEN is required');
  const timeoutMs = Number(env.AXIOM_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.AXIOM_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('AXIOM_TIMEOUT_MS must be an integer from 1000 to 120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('AXIOM_MAX_RETRIES must be an integer from 0 to 5');
  const apiUrl = new URL(env.AXIOM_API_URL ?? 'https://api.axiom.co').toString().replace(/\/$/, '');
  const mcpUrl = new URL(env.AXIOM_MCP_URL ?? 'https://mcp.axiom.co/mcp').toString();
  const orgId = env.AXIOM_ORG_ID?.trim() || undefined;
  const mcpPat = env.AXIOM_MCP_PAT?.trim() || undefined;
  if (mcpPat && !orgId) throw new Error('AXIOM_ORG_ID is required when AXIOM_MCP_PAT is configured');
  return {
    token,
    apiUrl,
    orgId,
    mcpUrl,
    mcpPat,
    timeoutMs,
    maxRetries,
    requireWriteApproval: toBool(env.AXIOM_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: toBool(env.AXIOM_ENABLE_DESTRUCTIVE, false),
    approvedActions: new Set((env.AXIOM_APPROVED_ACTIONS ?? '').split(',').map(v => v.trim()).filter(Boolean))
  };
}
