import crypto from 'node:crypto';
function intEnv(raw,fallback,min,max){ if(raw==null||raw==='') return fallback; const n=Number(raw); if(!Number.isInteger(n)||n<min||n>max) throw new Error(`Expected integer ${min}-${max}`); return n; }
function boolEnv(raw,fallback=true){ if(raw==null||raw==='') return fallback; if(raw==='true') return true; if(raw==='false') return false; throw new Error('Boolean environment values must be true or false'); }
export function loadConfig(env=process.env){
  if(!env.MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY is required');
  const region=(env.MAILGUN_REGION||'us').toLowerCase();
  if(!['us','eu'].includes(region)) throw new Error('MAILGUN_REGION must be us or eu');
  return Object.freeze({
    apiKey:env.MAILGUN_API_KEY,
    baseUrl:region==='eu'?'https://api.eu.mailgun.net':'https://api.mailgun.net',
    timeoutMs:intEnv(env.MAILGUN_TIMEOUT_MS,15000,1000,120000),
    maxRetries:intEnv(env.MAILGUN_MAX_RETRIES,3,0,5),
    approvalSecret:env.MAILGUN_APPROVAL_SECRET||'',
    highRiskEnabled:boolEnv(env.MAILGUN_ENABLE_HIGH_RISK,true)
  });
}
function stable(v){ if(v===null||typeof v!=='object') return JSON.stringify(v); if(Array.isArray(v)) return `[${v.map(stable).join(',')}]`; return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`; }
export function approvalDigest(secret,tool,payload){ return crypto.createHmac('sha256',secret).update(`${tool}\n${stable(payload)}`).digest('hex'); }
