import { z } from 'zod';

const positiveInt = (value: string | undefined, fallback: number, min: number, max: number) => {
  const parsed = value == null || value === '' ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`Expected integer between ${min} and ${max}`);
  }
  return parsed;
};

const bool = (value: string | undefined, fallback: boolean) => {
  if (value == null || value === '') return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean environment variables must be true or false');
};

export type SquarespaceConfig = {
  token: string;
  credentialMode: 'api_key' | 'oauth_access_token';
  baseUrl: URL;
  userAgent: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableHighRisk: boolean;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SquarespaceConfig {
  const apiKey = env.SQUARESPACE_API_KEY?.trim();
  const accessToken = env.SQUARESPACE_ACCESS_TOKEN?.trim();
  if (!!apiKey === !!accessToken) {
    throw new Error('Set exactly one of SQUARESPACE_API_KEY or SQUARESPACE_ACCESS_TOKEN');
  }

  const baseUrl = new URL(env.SQUARESPACE_API_BASE_URL ?? 'https://api.squarespace.com');
  if (baseUrl.protocol !== 'https:' || baseUrl.hostname !== 'api.squarespace.com' || baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) {
    throw new Error('SQUARESPACE_API_BASE_URL must be the official https://api.squarespace.com origin');
  }
  baseUrl.pathname = '/';

  const userAgent = z.string().trim().min(3).max(160).parse(env.SQUARESPACE_USER_AGENT ?? 'ReusableSquarespaceMCP/1.0');
  const timeoutMs = positiveInt(env.SQUARESPACE_TIMEOUT_MS, 15000, 1000, 120000);
  const maxRetries = positiveInt(env.SQUARESPACE_MAX_RETRIES, 2, 0, 5);
  const requireWriteApproval = bool(env.SQUARESPACE_REQUIRE_WRITE_APPROVAL, true);
  const enableHighRisk = bool(env.SQUARESPACE_ENABLE_HIGH_RISK, false);
  const approvalSecret = env.SQUARESPACE_APPROVAL_SECRET?.trim() || undefined;
  if ((requireWriteApproval || enableHighRisk) && approvalSecret && approvalSecret.length < 16) {
    throw new Error('SQUARESPACE_APPROVAL_SECRET must be at least 16 characters');
  }

  return {
    token: (apiKey ?? accessToken)!,
    credentialMode: apiKey ? 'api_key' : 'oauth_access_token',
    baseUrl,
    userAgent,
    timeoutMs,
    maxRetries,
    requireWriteApproval,
    enableHighRisk,
    approvalSecret
  };
}
