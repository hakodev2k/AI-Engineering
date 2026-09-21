export interface HoneycombConfig { apiKey:string; baseUrl:string; timeoutMs:number; maxRetries:number; requireWriteApproval:boolean }

export function loadConfig(env:NodeJS.ProcessEnv=process.env):HoneycombConfig {
  const apiKey=env.HONEYCOMB_API_KEY?.trim();
  if(!apiKey) throw new Error('HONEYCOMB_API_KEY is required');
  const baseUrl=(env.HONEYCOMB_API_BASE_URL ?? 'https://api.honeycomb.io').replace(/\/$/,'');
  if(!['https://api.honeycomb.io','https://api.eu1.honeycomb.io'].includes(baseUrl)) throw new Error('HONEYCOMB_API_BASE_URL must be an official Honeycomb API origin');
  const timeoutMs=Number(env.HONEYCOMB_TIMEOUT_MS ?? 10000); const maxRetries=Number(env.HONEYCOMB_MAX_RETRIES ?? 2);
  if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>60000) throw new Error('Invalid HONEYCOMB_TIMEOUT_MS');
  if(!Number.isInteger(maxRetries)||maxRetries<0||maxRetries>4) throw new Error('Invalid HONEYCOMB_MAX_RETRIES');
  return {apiKey,baseUrl,timeoutMs,maxRetries,requireWriteApproval:(env.HONEYCOMB_REQUIRE_WRITE_APPROVAL ?? 'true')!=='false'};
}
