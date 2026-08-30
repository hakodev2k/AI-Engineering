const SENSITIVE_KEY = /(api[-_]?key|token|secret|password|authorization|credential|private[-_]?key)/i;
export function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) out[key] = SENSITIVE_KEY.test(key) ? '[REDACTED]' : sanitize(child);
  return out;
}
