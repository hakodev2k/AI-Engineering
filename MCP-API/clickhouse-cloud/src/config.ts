import { z } from "zod";

const schema = z.object({
  CLICKHOUSE_CLOUD_API_KEY: z.string().min(1),
  CLICKHOUSE_CLOUD_API_SECRET: z.string().min(1),
  CLICKHOUSE_CLOUD_ORG_ID: z.string().uuid(),
  CLICKHOUSE_HOST: z.string().min(1),
  CLICKHOUSE_PORT: z.coerce.number().int().min(1).max(65535).default(8443),
  CLICKHOUSE_USER: z.string().min(1).default("default"),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_SECURE: z.enum(["true", "false"]).default("true"),
  CLICKHOUSE_VERIFY: z.enum(["true", "false"]).default("true"),
  CLICKHOUSE_DATABASE: z.string().min(1).default("default"),
  CLICKHOUSE_ROLE: z.string().optional(),
  CLICKHOUSE_TOOL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  CLICKHOUSE_CLOUD_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const e = schema.parse(env);
  return {
    apiKey: e.CLICKHOUSE_CLOUD_API_KEY,
    apiSecret: e.CLICKHOUSE_CLOUD_API_SECRET,
    orgId: e.CLICKHOUSE_CLOUD_ORG_ID,
    host: e.CLICKHOUSE_HOST,
    port: e.CLICKHOUSE_PORT,
    user: e.CLICKHOUSE_USER,
    password: e.CLICKHOUSE_PASSWORD,
    secure: e.CLICKHOUSE_SECURE === "true",
    verify: e.CLICKHOUSE_VERIFY === "true",
    database: e.CLICKHOUSE_DATABASE,
    role: e.CLICKHOUSE_ROLE,
    mcpTimeoutMs: e.CLICKHOUSE_TOOL_TIMEOUT_MS,
    cloudTimeoutMs: e.CLICKHOUSE_CLOUD_TIMEOUT_MS
  };
}
