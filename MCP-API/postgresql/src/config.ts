import { readFileSync } from 'node:fs';

export type SslMode = 'disable' | 'require' | 'verify-full';

export interface PostgresConfig {
  connectionString: string;
  ssl: false | { rejectUnauthorized: boolean; ca?: string };
  allowedSchemas: Set<string>;
  allowedTables: Set<string>;
  approvalSecret?: string;
  enableDelete: boolean;
  statementTimeoutMs: number;
  connectionTimeoutMs: number;
  poolMax: number;
}

const csv = (value?: string) => new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
const int = (value: string | undefined, fallback: number, min: number, max: number, name: string) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`${name} must be an integer in ${min}..${max}`);
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PostgresConfig {
  if (!env.POSTGRES_DATABASE_URL) throw new Error('POSTGRES_DATABASE_URL is required');
  const mode = (env.POSTGRES_SSL_MODE ?? 'verify-full') as SslMode;
  if (!['disable', 'require', 'verify-full'].includes(mode)) throw new Error('POSTGRES_SSL_MODE must be disable, require, or verify-full');
  let ssl: PostgresConfig['ssl'] = false;
  if (mode !== 'disable') {
    const ca = env.POSTGRES_SSL_CA_FILE ? readFileSync(env.POSTGRES_SSL_CA_FILE, 'utf8') : undefined;
    ssl = { rejectUnauthorized: mode === 'verify-full', ...(ca ? { ca } : {}) };
  }
  return {
    connectionString: env.POSTGRES_DATABASE_URL,
    ssl,
    allowedSchemas: csv(env.POSTGRES_ALLOWED_SCHEMAS || 'public'),
    allowedTables: csv(env.POSTGRES_ALLOWED_TABLES),
    approvalSecret: env.POSTGRES_APPROVAL_SECRET,
    enableDelete: (env.POSTGRES_ENABLE_DELETE ?? 'false').toLowerCase() === 'true',
    statementTimeoutMs: int(env.POSTGRES_STATEMENT_TIMEOUT_MS, 10000, 100, 120000, 'POSTGRES_STATEMENT_TIMEOUT_MS'),
    connectionTimeoutMs: int(env.POSTGRES_CONNECTION_TIMEOUT_MS, 5000, 100, 60000, 'POSTGRES_CONNECTION_TIMEOUT_MS'),
    poolMax: int(env.POSTGRES_POOL_MAX, 5, 1, 50, 'POSTGRES_POOL_MAX')
  };
}

export function assertTargetAllowed(config: PostgresConfig, schema: string, table?: string) {
  const s = schema.toLowerCase();
  if (config.allowedSchemas.size && !config.allowedSchemas.has(s)) throw new Error(`Schema not allowed: ${schema}`);
  if (table && config.allowedTables.size) {
    const t = table.toLowerCase();
    if (!config.allowedTables.has(t) && !config.allowedTables.has(`${s}.${t}`)) throw new Error(`Table not allowed: ${schema}.${table}`);
  }
}
