import { z } from 'zod';

const envSchema = z.object({
  CRONITOR_API_KEY: z.string().min(1),
  CRONITOR_TELEMETRY_KEY: z.string().min(1).optional(),
  CRONITOR_API_BASE: z.string().url().default('https://cronitor.io/api'),
  CRONITOR_TELEMETRY_BASE: z.string().url().default('https://cronitor.link'),
  CRONITOR_API_VERSION: z.string().default('2025-11-28'),
  CRONITOR_REQUIRE_WRITE_APPROVAL: z.enum(['true', 'false']).default('true'),
  CRONITOR_ENABLE_DESTRUCTIVE: z.enum(['true', 'false']).default('false'),
  CRONITOR_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000)
});

export type Config = {
  apiKey: string;
  telemetryKey?: string;
  apiBase: string;
  telemetryBase: string;
  apiVersion: string;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  return {
    apiKey: parsed.CRONITOR_API_KEY,
    telemetryKey: parsed.CRONITOR_TELEMETRY_KEY,
    apiBase: parsed.CRONITOR_API_BASE.replace(/\/$/, ''),
    telemetryBase: parsed.CRONITOR_TELEMETRY_BASE.replace(/\/$/, ''),
    apiVersion: parsed.CRONITOR_API_VERSION,
    requireWriteApproval: parsed.CRONITOR_REQUIRE_WRITE_APPROVAL === 'true',
    enableDestructive: parsed.CRONITOR_ENABLE_DESTRUCTIVE === 'true',
    timeoutMs: parsed.CRONITOR_TIMEOUT_MS
  };
}
