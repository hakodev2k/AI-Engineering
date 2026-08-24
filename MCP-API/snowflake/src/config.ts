export type TokenType = 'OAUTH' | 'PROGRAMMATIC_ACCESS_TOKEN';

export interface SnowflakeConfig {
  accountUrl: string;
  token: string;
  tokenType: TokenType;
  warehouse?: string;
  database?: string;
  schema?: string;
  role?: string;
  allowedDatabases: Set<string>;
  allowedSchemas: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  mcpUrl?: string;
  mcpAccessToken?: string;
  mcpToolName: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toUpperCase()).filter(Boolean));
}

function cleanAccountUrl(value: string) {
  const u = new URL(value);
  if (u.protocol !== 'https:') throw new Error('SNOWFLAKE_ACCOUNT_URL must use https');
  if (!u.hostname.endsWith('.snowflakecomputing.com')) throw new Error('SNOWFLAKE_ACCOUNT_URL must be a Snowflake account host');
  u.pathname = '';
  u.search = '';
  u.hash = '';
  return u.toString().replace(/\/$/, '');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SnowflakeConfig {
  if (!env.SNOWFLAKE_ACCOUNT_URL) throw new Error('SNOWFLAKE_ACCOUNT_URL is required');
  if (!env.SNOWFLAKE_TOKEN) throw new Error('SNOWFLAKE_TOKEN is required');
  const tokenType = (env.SNOWFLAKE_TOKEN_TYPE ?? 'OAUTH') as TokenType;
  if (!['OAUTH', 'PROGRAMMATIC_ACCESS_TOKEN'].includes(tokenType)) throw new Error('SNOWFLAKE_TOKEN_TYPE must be OAUTH or PROGRAMMATIC_ACCESS_TOKEN');
  const timeoutMs = Number(env.SNOWFLAKE_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.SNOWFLAKE_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('SNOWFLAKE_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('SNOWFLAKE_MAX_RETRIES must be 0..5');
  return {
    accountUrl: cleanAccountUrl(env.SNOWFLAKE_ACCOUNT_URL),
    token: env.SNOWFLAKE_TOKEN,
    tokenType,
    warehouse: env.SNOWFLAKE_WAREHOUSE,
    database: env.SNOWFLAKE_DATABASE,
    schema: env.SNOWFLAKE_SCHEMA,
    role: env.SNOWFLAKE_ROLE,
    allowedDatabases: csvSet(env.SNOWFLAKE_ALLOWED_DATABASES),
    allowedSchemas: csvSet(env.SNOWFLAKE_ALLOWED_SCHEMAS),
    approvalSecret: env.SNOWFLAKE_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    mcpUrl: env.SNOWFLAKE_MCP_URL,
    mcpAccessToken: env.SNOWFLAKE_MCP_ACCESS_TOKEN,
    mcpToolName: env.SNOWFLAKE_MCP_SQL_TOOL ?? 'sql_exec_tool'
  };
}

export function assertDatabaseAllowed(config: SnowflakeConfig, database: string) {
  if (config.allowedDatabases.size && !config.allowedDatabases.has(database.toUpperCase())) {
    throw new Error(`Database not allowed: ${database}`);
  }
}

export function assertSchemaAllowed(config: SnowflakeConfig, database: string, schema: string) {
  assertDatabaseAllowed(config, database);
  if (!config.allowedSchemas.size) return;
  const full = `${database}.${schema}`.toUpperCase();
  if (!config.allowedSchemas.has(schema.toUpperCase()) && !config.allowedSchemas.has(full)) {
    throw new Error(`Schema not allowed: ${database}.${schema}`);
  }
}
