import crypto from 'node:crypto';

export type Config = {
  apiKey: string;
  projectId?: string;
  apiBaseUrl: string;
  mcpUrl: URL;
  timeoutMs: number;
  approvalSecret?: string;
  allowedHosts: Set<string>;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.BROWSERBASE_API_KEY?.trim();
  if (!apiKey) throw new Error('CONFIG_ERROR: BROWSERBASE_API_KEY is required');
  const timeoutMs = Number(env.BROWSERBASE_TIMEOUT_MS ?? 20_000);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('CONFIG_ERROR: BROWSERBASE_TIMEOUT_MS must be between 1000 and 120000');
  }
  const apiBaseUrl = env.BROWSERBASE_API_BASE_URL ?? 'https://api.browserbase.com';
  const apiUrl = new URL(apiBaseUrl);
  if (apiUrl.protocol !== 'https:' || apiUrl.username || apiUrl.password) {
    throw new Error('CONFIG_ERROR: Browserbase API base URL must be credential-free HTTPS');
  }
  const mcp = new URL(env.BROWSERBASE_MCP_URL ?? 'https://mcp.browserbase.com/mcp');
  if (mcp.protocol !== 'https:' || mcp.username || mcp.password) {
    throw new Error('CONFIG_ERROR: Browserbase MCP URL must be credential-free HTTPS');
  }
  mcp.searchParams.set('browserbaseApiKey', apiKey);
  return {
    apiKey,
    projectId: env.BROWSERBASE_PROJECT_ID?.trim() || undefined,
    apiBaseUrl: apiUrl.toString().replace(/\/$/, ''),
    mcpUrl: mcp,
    timeoutMs,
    approvalSecret: env.BROWSERBASE_APPROVAL_SECRET?.trim() || undefined,
    allowedHosts: new Set((env.BROWSERBASE_ALLOWED_HOSTS ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean))
  };
}

export function assertApproval(config: Config, tool: string, approvalId?: string): void {
  if (!config.approvalSecret) throw new Error(`APPROVAL_REQUIRED: ${tool} requires BROWSERBASE_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`APPROVAL_REQUIRED: ${tool} requires approval_id`);
  const expected = crypto.createHash('sha256').update(`${tool}:${config.approvalSecret}`).digest('hex');
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('APPROVAL_DENIED: invalid approval_id');
}

export function validatePublicHttpsUrl(config: Config, raw: string): string {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('VALIDATION_ERROR: URL must be credential-free HTTPS');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '::1' || host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host.endsWith('.local')) {
    throw new Error('VALIDATION_ERROR: local/private hosts are not allowed');
  }
  if (config.allowedHosts.size && !config.allowedHosts.has(host)) throw new Error('PERMISSION_DENIED: host is not allowlisted');
  return url.toString();
}
