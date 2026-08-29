const SECRET=/(api[-_]?key|token|secret|password|authorization|credential)/i;
export function sanitize(value){ if(Array.isArray(value)) return value.map(sanitize); if(!value||typeof value!=='object') return value; const out={}; for(const [k,v] of Object.entries(value)) out[k]=SECRET.test(k)?'[REDACTED]':sanitize(v); return out; }
