const SENSITIVE_KEY=/(token|secret|password|credential|authorization|privatekey|accesskey)/i;
export function sanitize(value){ if(Array.isArray(value)) return value.map(sanitize); if(!value||typeof value!=='object') return value; const out={}; for(const [k,v] of Object.entries(value)){ if(SENSITIVE_KEY.test(k)){ out[k]='[REDACTED]'; continue; } out[k]=sanitize(v); } return out; }
