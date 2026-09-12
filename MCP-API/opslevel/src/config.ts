export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface OpsLevelConfig {
  token: string;
  graphqlUrl: string;
  timeoutMs: number;
  maxRetries: number;
  writeApproved: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OpsLevelConfig {
  const token = env.OPSLEVEL_API_TOKEN?.trim();
  if (!token) throw new Error('OPSLEVEL_API_TOKEN is required');
  const graphqlUrl = env.OPSLEVEL_GRAPHQL_URL?.trim() || 'https://api.opslevel.com/graphql';
  const url = new URL(graphqlUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('OPSLEVEL_GRAPHQL_URL must be credential-free HTTPS');
  const timeoutMs = boundedInt(env.OPSLEVEL_TIMEOUT_MS, 15000, 1000, 120000, 'OPSLEVEL_TIMEOUT_MS');
  const maxRetries = boundedInt(env.OPSLEVEL_MAX_RETRIES, 2, 0, 5, 'OPSLEVEL_MAX_RETRIES');
  return { token, graphqlUrl: url.toString(), timeoutMs, maxRetries, writeApproved: env.OPSLEVEL_WRITE_APPROVED === 'true' };
}

function boundedInt(raw: string | undefined, fallback: number, min: number, max: number, name: string): number {
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer ${min}-${max}`);
  return value;
}
