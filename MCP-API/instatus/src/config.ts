export type Config = { apiKey:string; baseUrl:string; timeoutMs:number; maxRetries:number; approveWrites:boolean; enableDestructive:boolean };
const bool=(v:string|undefined)=>v?.toLowerCase()==='true';
export function loadConfig(env=process.env):Config {
  const apiKey=env.INSTATUS_API_KEY?.trim(); if(!apiKey) throw new Error('INSTATUS_API_KEY is required');
  const baseUrl=(env.INSTATUS_API_BASE||'https://api.instatus.com/v1').replace(/\/$/,'');
  if(!baseUrl.startsWith('https://')) throw new Error('INSTATUS_API_BASE must use HTTPS');
  return {apiKey,baseUrl,timeoutMs:Number(env.INSTATUS_TIMEOUT_MS||15000),maxRetries:Number(env.INSTATUS_MAX_RETRIES||2),approveWrites:bool(env.INSTATUS_APPROVE_WRITES),enableDestructive:bool(env.INSTATUS_ENABLE_DESTRUCTIVE)};
}
