export type Config = {
  token: string;
  organization: string;
  baseUrl: string;
  mcpImage: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  allowWebhookWrites: boolean;
  mcpEnabled: boolean;
};

export function normalizeCloudUrl(value: string | undefined): string {
  const raw = (value || 'https://sonarcloud.io').replace(/\/+$/, '');
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('SONARQUBE_URL must use HTTPS');
  if (!['sonarcloud.io', 'sonarqube.us'].includes(url.hostname)) {
    throw new Error('SONARQUBE_URL must be https://sonarcloud.io or https://sonarqube.us');
  }
  return `${url.protocol}//${url.host}`;
}

export function normalizeMcpImage(value: string | undefined): string {
  const image = value?.trim() || 'mcp/sonarqube';
  if (!/^mcp\/sonarqube(?::[A-Za-z0-9_.-]+)?$/.test(image)) {
    throw new Error('SONARQUBE_MCP_IMAGE must reference the official mcp/sonarqube image');
  }
  return image;
}

export function loadConfig(env = process.env): Config {
  const token = env.SONARQUBE_TOKEN?.trim();
  const organization = env.SONARQUBE_ORG?.trim();
  if (!token) throw new Error('SONARQUBE_TOKEN is required');
  if (!organization) throw new Error('SONARQUBE_ORG is required');
  const timeoutMs = Number(env.SONARQUBE_REQUEST_TIMEOUT_MS || '15000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('SONARQUBE_REQUEST_TIMEOUT_MS must be an integer between 1000 and 120000');
  }
  return {
    token,
    organization,
    baseUrl: normalizeCloudUrl(env.SONARQUBE_URL),
    mcpImage: normalizeMcpImage(env.SONARQUBE_MCP_IMAGE),
    timeoutMs,
    requireWriteApproval: env.SONARQUBE_REQUIRE_WRITE_APPROVAL !== 'false',
    allowWebhookWrites: env.SONARQUBE_ALLOW_WEBHOOK_WRITES === 'true',
    mcpEnabled: env.SONARQUBE_MCP_ENABLED !== 'false'
  };
}
