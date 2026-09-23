export interface PapertrailConfig { token:string; baseUrl:string; timeoutMs:number; maxRetries:number; allowWrites:boolean }
export function loadConfig(env:NodeJS.ProcessEnv=process.env):PapertrailConfig {
  const token=env.PAPERTRAIL_API_TOKEN?.trim();
  if(!token) throw new Error('PAPERTRAIL_API_TOKEN is required');
  const baseUrl=(env.PAPERTRAIL_API_BASE_URL||'https://papertrailapp.com/api/v1').replace(/\/$/,'');
  if(baseUrl!=='https://papertrailapp.com/api/v1') throw new Error('PAPERTRAIL_API_BASE_URL must be the official HTTPS API origin');
  return {token,baseUrl,timeoutMs:Number(env.PAPERTRAIL_TIMEOUT_MS||10000),maxRetries:Number(env.PAPERTRAIL_MAX_RETRIES||2),allowWrites:env.PAPERTRAIL_ALLOW_WRITES==='true'};
}
export function authHeaders(c:PapertrailConfig){return {'X-Papertrail-Token':c.token,'Accept':'application/json'};}
