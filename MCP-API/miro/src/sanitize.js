const SECRET_KEY = /(access.?token|refresh.?token|client.?secret|password|credential|authorization|private.?key)/i;

export function sanitize(value, depth = 0) {
  if (depth > 20) return "[MAX_DEPTH]";
  if (Array.isArray(value)) return value.slice(0, 5000).map((item) => sanitize(item, depth + 1));
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = SECRET_KEY.test(key) ? "[REDACTED]" : sanitize(item, depth + 1);
  }
  return result;
}
