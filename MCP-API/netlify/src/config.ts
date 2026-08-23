import crypto from 'node:crypto';

export interface NetlifyConfig {
  token: string;
  allowedSiteIds: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): NetlifyConfig {
  if (!env.NETLIFY_ACCESS_TOKEN) throw new Error('NETLIFY_ACCESS_TOKEN is required');
  const timeoutMs = Number(env.NETLIFY_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.NETLIFY_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('NETLIFY_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('NETLIFY_MAX_RETRIES must be 0..5');
  return {
    token: env.NETLIFY_ACCESS_TOKEN,
    allowedSiteIds: csvSet(env.NETLIFY_ALLOWED_SITE_IDS),
    approvalSecret: env.NETLIFY_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    baseUrl: (env.NETLIFY_API_BASE_URL ?? 'https://api.netlify.com/api/v1').replace(/\/$/, '')
  };
}

export function assertSiteAllowed(config: NetlifyConfig, siteId: string) {
  if (config.allowedSiteIds.size && !config.allowedSiteIds.has(siteId)) throw new Error(`Site not allowed: ${siteId}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
