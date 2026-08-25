export type SquareEnvironment = 'sandbox' | 'production';

export interface SquareConfig {
  accessToken: string;
  environment: SquareEnvironment;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvalSecret?: string;
}

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function boolEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SquareConfig {
  const accessToken = env.SQUARE_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('SQUARE_ACCESS_TOKEN is required');
  const environment = (env.SQUARE_ENVIRONMENT ?? 'sandbox') as SquareEnvironment;
  if (!['sandbox', 'production'].includes(environment)) {
    throw new Error('SQUARE_ENVIRONMENT must be sandbox or production');
  }
  return {
    accessToken,
    environment,
    apiVersion: env.SQUARE_API_VERSION ?? '2026-08-19',
    timeoutMs: intEnv('SQUARE_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: intEnv('SQUARE_MAX_RETRIES', 3, 0, 5),
    requireWriteApproval: boolEnv('SQUARE_REQUIRE_WRITE_APPROVAL', true),
    approvalSecret: env.SQUARE_APPROVAL_SECRET?.trim() || undefined
  };
}

export function baseUrl(environment: SquareEnvironment): string {
  return environment === 'production'
    ? 'https://connect.squareup.com/v2'
    : 'https://connect.squareupsandbox.com/v2';
}
