export type CanvaConfig = {
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};

const bool = (value: string | undefined, fallback: boolean) =>
  value == null ? fallback : /^(1|true|yes)$/i.test(value);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CanvaConfig {
  const accessToken = env.CANVA_ACCESS_TOKEN?.trim() || undefined;
  const refreshToken = env.CANVA_REFRESH_TOKEN?.trim() || undefined;
  const clientId = env.CANVA_CLIENT_ID?.trim() || undefined;
  const clientSecret = env.CANVA_CLIENT_SECRET?.trim() || undefined;
  if (!accessToken && !(refreshToken && clientId && clientSecret)) {
    throw new Error('Provide CANVA_ACCESS_TOKEN or CANVA_REFRESH_TOKEN + CANVA_CLIENT_ID + CANVA_CLIENT_SECRET');
  }
  const timeoutMs = Number(env.CANVA_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.CANVA_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('CANVA_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('CANVA_MAX_RETRIES must be 0..5');
  const apiBaseUrl = new URL(env.CANVA_API_BASE_URL ?? 'https://api.canva.com/rest/v1').toString().replace(/\/$/, '');
  const mcpUrl = new URL(env.CANVA_MCP_URL ?? 'https://mcp.canva.com/mcp').toString();
  return {
    accessToken, refreshToken, clientId, clientSecret, apiBaseUrl, mcpUrl, timeoutMs, maxRetries,
    requireWriteApproval: bool(env.CANVA_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.CANVA_APPROVED_ACTIONS ?? '').split(',').map(x => x.trim()).filter(Boolean)),
  };
}
