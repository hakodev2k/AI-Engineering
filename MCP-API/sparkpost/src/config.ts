import { z } from 'zod';

const envSchema = z.object({
  SPARKPOST_API_KEY: z.string().min(1),
  SPARKPOST_REGION: z.enum(['us', 'eu']).default('us'),
  SPARKPOST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  SPARKPOST_WRITE_APPROVAL_REQUIRED: z.enum(['true','false']).default('true'),
  SPARKPOST_DESTRUCTIVE_ENABLED: z.enum(['true','false']).default('false')
});

export type Config = { apiKey:string; baseUrl:string; timeoutMs:number; writeApprovalRequired:boolean; destructiveEnabled:boolean };
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = envSchema.parse(env);
  return {
    apiKey: v.SPARKPOST_API_KEY,
    baseUrl: v.SPARKPOST_REGION === 'eu' ? 'https://api.eu.sparkpost.com/api/v1' : 'https://api.sparkpost.com/api/v1',
    timeoutMs: v.SPARKPOST_TIMEOUT_MS,
    writeApprovalRequired: v.SPARKPOST_WRITE_APPROVAL_REQUIRED === 'true',
    destructiveEnabled: v.SPARKPOST_DESTRUCTIVE_ENABLED === 'true'
  };
}
