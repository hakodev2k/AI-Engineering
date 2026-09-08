const asBool=(v:string|undefined)=>v==='true';
const asInt=(v:string|undefined,d:number)=>{const n=Number(v??d);return Number.isFinite(n)&&n>=0?Math.floor(n):d};
export const config={
  token:process.env.HETZNER_CLOUD_TOKEN,
  apiBaseUrl:process.env.HETZNER_CLOUD_API_BASE_URL??'https://api.hetzner.cloud/v1',
  timeoutMs:asInt(process.env.HETZNER_CLOUD_TIMEOUT_MS,15000),
  maxRetries:Math.min(asInt(process.env.HETZNER_CLOUD_MAX_RETRIES,2),5),
  allowHighRisk:asBool(process.env.HETZNER_CLOUD_ALLOW_HIGH_RISK),
  allowDestructive:asBool(process.env.HETZNER_CLOUD_ALLOW_DESTRUCTIVE)
};
