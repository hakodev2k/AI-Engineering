import crypto from 'node:crypto';
function asInt(value, fallback, min, max) { if (value == null || value === '') return fallback; const n=Number(value); if (!Number.isInteger(n)||n<min||n>max) throw new Error(`integer must be ${min}..${max}`); return n; }
function asBool(value, fallback=false) { if (value == null || value==='') return fallback; if (value==='true') return true; if (value==='false') return false; throw new Error('boolean must be true or false'); }
export function loadConfig(env=process.env) {
  if (!env.CONVEX_MANAGEMENT_TOKEN) throw new Error('CONVEX_MANAGEMENT_TOKEN is required');
  const url=new URL(env.CONVEX_MANAGEMENT_API_URL || 'https://api.convex.dev/v1');
  if (url.protocol !== 'https:') throw new Error('CONVEX_MANAGEMENT_API_URL must use HTTPS');
  if (url.username||url.password||url.search||url.hash) throw new Error('CONVEX_MANAGEMENT_API_URL must not include credentials/query/fragment');
  return Object.freeze({baseUrl:url.toString().replace(/\/$/,''), token:env.CONVEX_MANAGEMENT_TOKEN, timeoutMs:asInt(env.CONVEX_TIMEOUT_MS,15000,1000,120000), maxRetries:asInt(env.CONVEX_MAX_RETRIES,3,0,5), approvalSecret:env.CONVEX_APPROVAL_SECRET||'', destructiveEnabled:asBool(env.CONVEX_ENABLE_DESTRUCTIVE,false)});
}
function stable(v){ if(v===null||typeof v!=='object') return JSON.stringify(v); if(Array.isArray(v)) return `[${v.map(stable).join(',')}]`; return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`; }
export function approvalDigest(secret, tool, payload){ return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex'); }
