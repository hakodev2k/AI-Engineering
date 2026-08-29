const SECRET=/(token|secret|password|credential|authorization|api[_-]?key)/i;
export function sanitize(v){if(Array.isArray(v))return v.map(sanitize);if(!v||typeof v!=='object')return v;const out={};for(const [k,val] of Object.entries(v))out[k]=SECRET.test(k)?'[REDACTED]':sanitize(val);return out;}
