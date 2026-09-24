import { z } from 'zod';

const Env = z.object({
  SPLUNK_ON_CALL_API_ID: z.string().min(1),
  SPLUNK_ON_CALL_API_KEY: z.string().min(1),
  SPLUNK_ON_CALL_API_BASE_URL: z.string().url().default('https://api.victorops.com'),
  SPLUNK_ON_CALL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  SPLUNK_ON_CALL_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  SPLUNK_ON_CALL_ALLOW_WRITES: z.enum(['true','false']).default('false'),
  SPLUNK_ON_CALL_APPROVAL_SECRET: z.string().min(16).optional()
});

export type Config = {
  apiId:string; apiKey:string; baseUrl:string; timeoutMs:number; maxRetries:number;
  allowWrites:boolean; approvalSecret?:string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v=Env.parse(env);
  const u=new URL(v.SPLUNK_ON_CALL_API_BASE_URL);
  if(u.protocol!=='https:' || u.hostname!=='api.victorops.com') throw new Error('SPLUNK_ON_CALL_API_BASE_URL must be https://api.victorops.com');
  return {apiId:v.SPLUNK_ON_CALL_API_ID,apiKey:v.SPLUNK_ON_CALL_API_KEY,baseUrl:u.origin,timeoutMs:v.SPLUNK_ON_CALL_TIMEOUT_MS,maxRetries:v.SPLUNK_ON_CALL_MAX_RETRIES,allowWrites:v.SPLUNK_ON_CALL_ALLOW_WRITES==='true',approvalSecret:v.SPLUNK_ON_CALL_APPROVAL_SECRET};
}
