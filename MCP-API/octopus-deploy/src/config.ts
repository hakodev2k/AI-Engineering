import { z } from 'zod';

const envSchema = z.object({
  OCTOPUS_URL: z.string().url().transform((v) => v.replace(/\/$/, '')),
  OCTOPUS_API_KEY: z.string().min(1),
  OCTOPUS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  OCTOPUS_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  OCTOPUS_WRITE_APPROVED: z.enum(['true', 'false']).default('false'),
  OCTOPUS_HIGH_RISK_APPROVED: z.enum(['true', 'false']).default('false')
});

export type OctopusConfig = {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  maxRetries: number;
  writeApproved: boolean;
  highRiskApproved: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OctopusConfig {
  const parsed = envSchema.parse(env);
  return {
    baseUrl: parsed.OCTOPUS_URL,
    apiKey: parsed.OCTOPUS_API_KEY,
    timeoutMs: parsed.OCTOPUS_TIMEOUT_MS,
    maxRetries: parsed.OCTOPUS_MAX_RETRIES,
    writeApproved: parsed.OCTOPUS_WRITE_APPROVED === 'true',
    highRiskApproved: parsed.OCTOPUS_HIGH_RISK_APPROVED === 'true'
  };
}
