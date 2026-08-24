export interface QuickBooksConfig {
  realmId: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  environment: 'production' | 'sandbox';
  minorVersion: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  webhookVerifierToken?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): QuickBooksConfig {
  const realmId = env.QUICKBOOKS_REALM_ID?.trim();
  if (!realmId || !/^\d+$/.test(realmId)) throw new Error('QUICKBOOKS_REALM_ID must be a numeric company realm ID');
  const environment = (env.QUICKBOOKS_ENVIRONMENT ?? 'production') as 'production' | 'sandbox';
  if (!['production', 'sandbox'].includes(environment)) throw new Error('QUICKBOOKS_ENVIRONMENT must be production or sandbox');
  const timeoutMs = Number(env.QUICKBOOKS_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.QUICKBOOKS_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('QUICKBOOKS_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('QUICKBOOKS_MAX_RETRIES must be 0..5');
  if (!env.QUICKBOOKS_ACCESS_TOKEN && !env.QUICKBOOKS_REFRESH_TOKEN) throw new Error('Set QUICKBOOKS_ACCESS_TOKEN or QUICKBOOKS_REFRESH_TOKEN');
  if (env.QUICKBOOKS_REFRESH_TOKEN && (!env.QUICKBOOKS_CLIENT_ID || !env.QUICKBOOKS_CLIENT_SECRET)) throw new Error('Refresh-token mode requires QUICKBOOKS_CLIENT_ID and QUICKBOOKS_CLIENT_SECRET');
  return {
    realmId,
    accessToken: env.QUICKBOOKS_ACCESS_TOKEN,
    refreshToken: env.QUICKBOOKS_REFRESH_TOKEN,
    clientId: env.QUICKBOOKS_CLIENT_ID,
    clientSecret: env.QUICKBOOKS_CLIENT_SECRET,
    environment,
    minorVersion: env.QUICKBOOKS_MINOR_VERSION ?? '75',
    approvalSecret: env.QUICKBOOKS_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    webhookVerifierToken: env.QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN
  };
}

export function apiBaseUrl(config: QuickBooksConfig) {
  return config.environment === 'sandbox'
    ? 'https://sandbox-quickbooks.api.intuit.com/v3/company'
    : 'https://quickbooks.api.intuit.com/v3/company';
}
