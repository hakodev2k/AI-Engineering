export type Config = { baseUrl:string; apiKey:string; region?:string; allowWrites:boolean; allowDestructive:boolean; timeoutMs:number };
export function loadConfig(env=process.env): Config {
  const apiKey=env.UMAMI_API_KEY?.trim(); if(!apiKey) throw new Error('UMAMI_API_KEY is required');
  const base=(env.UMAMI_BASE_URL||'https://api.umami.is/v1').replace(/\/$/,'');
  const region=env.UMAMI_REGION?.trim(); if(region && !['us','eu'].includes(region)) throw new Error('UMAMI_REGION must be us or eu');
  const timeoutMs=Number(env.UMAMI_TIMEOUT_MS||10000); if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>60000) throw new Error('UMAMI_TIMEOUT_MS must be 1000..60000');
  return {baseUrl:base,apiKey,region,allowWrites:env.UMAMI_ALLOW_WRITES==='true',allowDestructive:env.UMAMI_ALLOW_DESTRUCTIVE==='true',timeoutMs};
}
