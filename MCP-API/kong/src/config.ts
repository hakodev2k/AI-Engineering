export type Region='us'|'eu'|'au';
export interface Config{token:string;region:Region;timeoutMs:number;approveWrites:boolean;approveHighRisk:boolean}
export function configFromEnv(env=process.env):Config{const token=env.KONG_KONNECT_TOKEN?.trim();if(!token)throw new Error('KONG_KONNECT_TOKEN is required');const region=(env.KONG_KONNECT_REGION??'us') as Region;if(!['us','eu','au'].includes(region))throw new Error('KONG_KONNECT_REGION must be us, eu, or au');const timeoutMs=Number(env.KONG_KONNECT_TIMEOUT_MS??12000);if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>60000)throw new Error('invalid timeout');return{token,region,timeoutMs,approveWrites:env.KONG_KONNECT_APPROVE_WRITES==='true',approveHighRisk:env.KONG_KONNECT_APPROVE_HIGH_RISK==='true'}}
export function apiBase(r:Region){return `https://${r}.api.konghq.com`}
export function mcpBase(r:Region){return `https://${r}.mcp.konghq.com/`}
