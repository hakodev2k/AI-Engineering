const SENSITIVE = /(token|secret|password|credential|private[_-]?key|access[_-]?key|refresh[_-]?token|client[_-]?secret)/i;
export function sanitize(v) {
  if (Array.isArray(v)) return v.map(sanitize);
  if (!v || typeof v !== 'object') return v;
  const out = {}; for (const [k,val] of Object.entries(v)) out[k] = SENSITIVE.test(k) ? '[REDACTED]' : sanitize(val); return out;
}
