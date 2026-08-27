import crypto from 'node:crypto';

export type AuthMode = 'api_token' | 'oauth2';
export interface Config { authMode: AuthMode; apiToken?: string; accessToken?: string; apiBaseUrl: string; timeoutMs: number; maxRetries: number; approvalSecret?: string; }

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const authMode = (env.PIPEDRIVE_AUTH_MODE ?? 'api_token') as AuthMode;
  if (!['api_token','oauth2'].includes(authMode)) throw new Error('PIPEDRIVE_AUTH_MODE must be api_token or oauth2');
  const apiToken = env.PIPEDRIVE_API_TOKEN?.trim();
  const accessToken = env.PIPEDRIVE_ACCESS_TOKEN?.trim();
  if (authMode === 'api_token' && !apiToken) throw new Error('PIPEDRIVE_API_TOKEN is required');
  if (authMode === 'oauth2' && !accessToken) throw new Error('PIPEDRIVE_ACCESS_TOKEN is required');
  const apiBaseUrl = env.PIPEDRIVE_API_BASE_URL ?? 'https://api.pipedrive.com';
  const url = new URL(apiBaseUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('PIPEDRIVE_API_BASE_URL must be an HTTPS origin');
  return {
    authMode, apiToken, accessToken, apiBaseUrl: url.origin,
    timeoutMs: boundedInt(env.PIPEDRIVE_TIMEOUT_MS, 15000, 1000, 60000),
    maxRetries: boundedInt(env.PIPEDRIVE_MAX_RETRIES, 2, 0, 4),
    approvalSecret: env.PIPEDRIVE_APPROVAL_SECRET
  };
}
function boundedInt(v:string|undefined,d:number,min:number,max:number){ const n=v?Number(v):d; if(!Number.isInteger(n)||n<min||n>max) throw new Error(`Invalid numeric configuration: ${v}`); return n; }
export function stableJson(value: unknown): string { if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`; if (value && typeof value==='object') return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${stableJson(v)}`).join(',')}}`; return JSON.stringify(value); }
export function approvalDigest(secret:string, tool:string, input:unknown){ return crypto.createHmac('sha256',secret).update(`${tool}\n${stableJson(input)}`).digest('hex'); }
