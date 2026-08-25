const FORBIDDEN_SQL = /\b(insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|comment|copy|vacuum|analyze|reindex|cluster|refresh|call|do|set|reset|listen|notify|discard|lock)\b/i;
const ALLOWED_PREFIX = /^\s*(select|with|show|explain)\b/i;

export function assertReadOnlySql(sql: string) {
  const text = sql.trim();
  if (!text || text.length > 50000) throw new Error('SQL must be 1..50000 characters');
  if (!ALLOWED_PREFIX.test(text)) throw new Error('Only SELECT, WITH, SHOW, or EXPLAIN statements are allowed');
  if (FORBIDDEN_SQL.test(text)) throw new Error('Potentially mutating SQL is not allowed');
  const semicolons = [...text].filter(c => c === ';').length;
  if (semicolons > 1 || (semicolons === 1 && !text.endsWith(';'))) throw new Error('Only one SQL statement is allowed');
}

export function assertId(value: string, label: string) {
  if (!/^[A-Za-z0-9_-]{2,160}$/.test(value)) throw new Error(`Invalid ${label}`);
}

export function cleanName(value: string, label: string) {
  const v = value.trim();
  if (!v || v.length > 120 || /[\u0000-\u001f]/.test(v)) throw new Error(`Invalid ${label}`);
  return v;
}
