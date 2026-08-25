import crypto from 'node:crypto';

export interface Config {
  uri: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRows: number;
  allowWrites: boolean;
  allowDestructive: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const uri = env.MYSQL_XDEVAPI_URI?.trim();
  if (!uri) throw new Error('MYSQL_XDEVAPI_URI is required');
  if (!/^mysqlx:\/\//i.test(uri)) throw new Error('MYSQL_XDEVAPI_URI must use mysqlx://');
  const timeoutMs = boundedInt(env.MYSQL_TIMEOUT_MS, 15000, 1000, 120000);
  const maxRows = boundedInt(env.MYSQL_MAX_ROWS, 200, 1, 1000);
  return {
    uri,
    approvalSecret: env.MYSQL_APPROVAL_SECRET,
    timeoutMs,
    maxRows,
    allowWrites: env.MYSQL_ALLOW_WRITES === 'true',
    allowDestructive: env.MYSQL_ALLOW_DESTRUCTIVE === 'true'
  };
}

function boundedInt(raw: string | undefined, fallback: number, min: number, max: number) {
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid numeric configuration: ${raw}`);
  return value;
}

export function approvalDigest(secret: string, tool: string, nonce: string) {
  return crypto.createHmac('sha256', secret).update(`${tool}:${nonce}`).digest('hex');
}
