import crypto from 'node:crypto';

function boolValue(raw, fallback=false){ if(raw==null||raw==='') return fallback; if(raw==='true') return true; if(raw==='false') return false; throw new Error('Boolean environment values must be true or false'); }
function intValue(raw, fallback, min, max){ if(raw==null||raw==='') return fallback; const n=Number(raw); if(!Number.isInteger(n)||n<min||n>max) throw new Error(`Integer environment value must be between ${min} and ${max}`); return n; }
export function loadConfig(env=process.env){
  if(!env.PULUMI_ACCESS_TOKEN) throw new Error('PULUMI_ACCESS_TOKEN is required');
  const url=new URL(env.PULUMI_API_URL||'https://api.pulumi.com');
  if(url.protocol!=='https:') throw new Error('PULUMI_API_URL must use HTTPS');
  if(url.username||url.password||url.search||url.hash) throw new Error('PULUMI_API_URL must not contain credentials, query, or fragment');
  return Object.freeze({baseUrl:url.origin,accessToken:env.PULUMI_ACCESS_TOKEN,timeoutMs:intValue(env.PULUMI_TIMEOUT_MS,15000,1000,120000),maxRetries:intValue(env.PULUMI_MAX_RETRIES,3,0,5),approvalSecret:env.PULUMI_APPROVAL_SECRET||'',destructiveEnabled:boolValue(env.PULUMI_ENABLE_DESTRUCTIVE,false)});
}
function stable(v){ if(v===null||typeof v!=='object') return JSON.stringify(v); if(Array.isArray(v)) return `[${v.map(stable).join(',')}]`; return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`; }
export function approvalDigest(secret,tool,payload){ return crypto.createHmac('sha256',secret).update(`${tool}\n${stable(payload)}`).digest('hex'); }
