export type GorgiasConfig = {
  subdomain: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
  auth: { type: 'basic'; email: string; apiKey: string } | { type: 'bearer'; accessToken: string };
};

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  return /^(1|true|yes)$/i.test(value);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GorgiasConfig {
  const subdomain = env.GORGIAS_SUBDOMAIN?.trim();
  if (!subdomain || !/^[a-z0-9][a-z0-9-]{0,62}$/i.test(subdomain)) {
    throw new Error('GORGIAS_SUBDOMAIN is required and must be a valid Gorgias subdomain');
  }

  const accessToken = env.GORGIAS_OAUTH_ACCESS_TOKEN?.trim();
  const email = env.GORGIAS_API_EMAIL?.trim();
  const apiKey = env.GORGIAS_API_KEY?.trim();
  if (!accessToken && !(email && apiKey)) {
    throw new Error('Configure GORGIAS_OAUTH_ACCESS_TOKEN or both GORGIAS_API_EMAIL and GORGIAS_API_KEY');
  }

  const timeoutMs = Number(env.GORGIAS_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.GORGIAS_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('GORGIAS_TIMEOUT_MS must be an integer from 1000 to 120000');
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) {
    throw new Error('GORGIAS_MAX_RETRIES must be an integer from 0 to 5');
  }

  const auth: GorgiasConfig['auth'] = accessToken
    ? { type: 'bearer', accessToken }
    : { type: 'basic', email: email!, apiKey: apiKey! };

  return {
    subdomain,
    apiBaseUrl: `https://${subdomain}.gorgias.com/api`,
    timeoutMs,
    maxRetries,
    requireWriteApproval: parseBool(env.GORGIAS_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.GORGIAS_APPROVED_ACTIONS ?? '').split(',').map(v => v.trim()).filter(Boolean)),
    auth
  };
}
