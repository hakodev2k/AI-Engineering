import { z } from 'zod';

const Env = z.object({
  SEMATEXT_API_KEY: z.string().min(1),
  SEMATEXT_REGION: z.enum(['us', 'eu']).default('us'),
  SEMATEXT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  SEMATEXT_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  SEMATEXT_REQUIRE_WRITE_APPROVAL: z.string().optional().transform(v => v !== 'false')
});

export type SematextConfig = {
  apiKey: string;
  region: 'us' | 'eu';
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  appsBaseUrl: string;
  syntheticsBaseUrl: string;
  logsSearchBaseUrl: string;
  eventsBaseUrl: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SematextConfig {
  const v = Env.parse(env);
  const eu = v.SEMATEXT_REGION === 'eu';
  return {
    apiKey: v.SEMATEXT_API_KEY,
    region: v.SEMATEXT_REGION,
    timeoutMs: v.SEMATEXT_TIMEOUT_MS,
    maxRetries: v.SEMATEXT_MAX_RETRIES,
    requireWriteApproval: v.SEMATEXT_REQUIRE_WRITE_APPROVAL,
    appsBaseUrl: eu ? 'https://apps.eu.sematext.com' : 'https://apps.sematext.com',
    syntheticsBaseUrl: eu ? 'https://apps.eu.sematext.com/synthetics-api' : 'https://apps.sematext.com/synthetics-api',
    logsSearchBaseUrl: eu ? 'https://logsene-search.eu.sematext.com' : 'https://logsene-search.sematext.com',
    eventsBaseUrl: eu ? 'https://event-receiver.eu.sematext.com' : 'https://event-receiver.sematext.com'
  };
}
