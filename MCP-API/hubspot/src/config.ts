export type HubSpotConfig = {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  allowWrites: boolean;
  requireApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

const bool = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : value.toLowerCase() === 'true';

const int = (value: string | undefined, fallback: number, min: number, max: number) => {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`CONFIG_ERROR: expected integer between ${min} and ${max}`);
  }
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HubSpotConfig {
  const config: HubSpotConfig = {
    accessToken: env.HUBSPOT_ACCESS_TOKEN?.trim() || undefined,
    clientId: env.HUBSPOT_CLIENT_ID?.trim() || undefined,
    clientSecret: env.HUBSPOT_CLIENT_SECRET?.trim() || undefined,
    refreshToken: env.HUBSPOT_REFRESH_TOKEN?.trim() || undefined,
    allowWrites: bool(env.HUBSPOT_ALLOW_WRITES, false),
    requireApproval: bool(env.HUBSPOT_REQUIRE_APPROVAL, true),
    timeoutMs: int(env.HUBSPOT_REQUEST_TIMEOUT_MS, 15000, 1000, 60000),
    maxRetries: int(env.HUBSPOT_MAX_RETRIES, 3, 0, 5)
  };

  const hasStatic = Boolean(config.accessToken);
  const hasOAuthRefresh = Boolean(config.clientId && config.clientSecret && config.refreshToken);
  if (!hasStatic && !hasOAuthRefresh) {
    throw new Error('CONFIG_ERROR: set HUBSPOT_ACCESS_TOKEN or HUBSPOT_CLIENT_ID/HUBSPOT_CLIENT_SECRET/HUBSPOT_REFRESH_TOKEN');
  }
  return config;
}

export function assertWriteAllowed(config: HubSpotConfig, tool: string, approval?: string) {
  if (!config.allowWrites) throw new Error(`PERMISSION_DENIED: ${tool} is disabled; set HUBSPOT_ALLOW_WRITES=true`);
  if (config.requireApproval && approval !== 'APPROVE') {
    throw new Error(`APPROVAL_REQUIRED: ${tool} requires approval="APPROVE"`);
  }
}
