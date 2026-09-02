export type Config = {
  mcpToken: string;
  apiToken: string;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};

const bool = (v: string | undefined, fallback: boolean) => v == null ? fallback : /^(1|true|yes)$/i.test(v);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mcpToken = env.TYPEFORM_MCP_ACCESS_TOKEN?.trim();
  const apiToken = env.TYPEFORM_API_TOKEN?.trim();
  if (!mcpToken) throw new Error('TYPEFORM_MCP_ACCESS_TOKEN is required; Typeform MCP requires OAuth 2.0 and does not accept PATs');
  if (!apiToken) throw new Error('TYPEFORM_API_TOKEN is required for REST fallback capabilities');
  const timeoutMs = Number(env.TYPEFORM_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.TYPEFORM_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('TYPEFORM_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('TYPEFORM_MAX_RETRIES must be 0..5');
  return {
    mcpToken,
    apiToken,
    apiBaseUrl: new URL(env.TYPEFORM_API_BASE_URL ?? 'https://api.typeform.com').toString().replace(/\/$/, ''),
    mcpUrl: new URL(env.TYPEFORM_MCP_URL ?? 'https://api.typeform.com/mcp').toString(),
    timeoutMs,
    maxRetries,
    requireWriteApproval: bool(env.TYPEFORM_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.TYPEFORM_APPROVED_ACTIONS ?? '').split(',').map(v => v.trim()).filter(Boolean))
  };
}
