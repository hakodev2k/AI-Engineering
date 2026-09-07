import { z } from 'zod';

const Env = z.object({
  CLICKHOUSE_URL: z.string().url(),
  CLICKHOUSE_USER: z.string().min(1).default('default'),
  CLICKHOUSE_PASSWORD: z.string().default(''),
  CLICKHOUSE_DATABASE: z.string().min(1).default('default'),
  CLICKHOUSE_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().max(120000).default(30000),
  CLICKHOUSE_MAX_EXECUTION_TIME_SECONDS: z.coerce.number().int().positive().max(300).default(30),
  CLICKHOUSE_MAX_RESULT_ROWS: z.coerce.number().int().positive().max(10000).default(1000),
  CLICKHOUSE_ALLOW_WRITES: z.enum(['true','false']).default('false'),
  CLICKHOUSE_ALLOW_DESTRUCTIVE: z.enum(['true','false']).default('false')
});

export type ConnectorConfig = {
  url: string; username: string; password: string; database: string;
  requestTimeoutMs: number; maxExecutionTimeSeconds: number; maxResultRows: number;
  allowWrites: boolean; allowDestructive: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const e = Env.parse(env);
  return {
    url: e.CLICKHOUSE_URL, username: e.CLICKHOUSE_USER, password: e.CLICKHOUSE_PASSWORD,
    database: e.CLICKHOUSE_DATABASE, requestTimeoutMs: e.CLICKHOUSE_REQUEST_TIMEOUT_MS,
    maxExecutionTimeSeconds: e.CLICKHOUSE_MAX_EXECUTION_TIME_SECONDS,
    maxResultRows: e.CLICKHOUSE_MAX_RESULT_ROWS,
    allowWrites: e.CLICKHOUSE_ALLOW_WRITES === 'true',
    allowDestructive: e.CLICKHOUSE_ALLOW_DESTRUCTIVE === 'true'
  };
}
