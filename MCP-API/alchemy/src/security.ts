export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export const DEFAULT_ALLOWED=new Set(['ping','list_apps','get_app','select_app','list_chains','eth_getBalance','eth_getTransactionByHash','alchemy_getTokenMetadata','alchemy_getAssetTransfers']);
export function allowedTools(){const raw=process.env.CONNECTOR_ALLOWED_TOOLS;return raw?new Set(raw.split(',').map(x=>x.trim()).filter(Boolean)):DEFAULT_ALLOWED;}
export function assertAllowed(name:string){if(!allowedTools().has(name))throw new Error(`Upstream tool not allowlisted: ${name}`);}
export function sanitize(value:unknown):unknown{if(typeof value==='string')return value.length>100000?value.slice(0,100000):value;if(Array.isArray(value))return value.slice(0,1000).map(sanitize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).slice(0,500).map(([k,v])=>[k,sanitize(v)]));return value;}
