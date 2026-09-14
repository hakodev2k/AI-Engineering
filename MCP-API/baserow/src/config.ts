export type Config = {
  baseUrl: URL;
  token: string;
  allowedTableIds: Set<number>;
  requireWriteApproval: boolean;
  enableDelete: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

function int(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const rawUrl = env.BASEROW_BASE_URL ?? 'https://api.baserow.io';
  const baseUrl = new URL(rawUrl);
  if (baseUrl.protocol !== 'https:' && !(baseUrl.hostname === 'localhost' || baseUrl.hostname === '127.0.0.1')) {
    throw new Error('BASEROW_BASE_URL must use HTTPS except for loopback development');
  }
  const token = env.BASEROW_DATABASE_TOKEN?.trim();
  if (!token) throw new Error('BASEROW_DATABASE_TOKEN is required');
  const allowed = new Set<number>();
  for (const part of (env.BASEROW_ALLOWED_TABLE_IDS ?? '').split(',').map(v => v.trim()).filter(Boolean)) {
    const id = Number(part);
    if (!Number.isInteger(id) || id <= 0) throw new Error('BASEROW_ALLOWED_TABLE_IDS must contain positive integer table IDs');
    allowed.add(id);
  }
  const oldEnv = process.env;
  process.env = env;
  try {
    return {
      baseUrl,
      token,
      allowedTableIds: allowed,
      requireWriteApproval: bool('BASEROW_REQUIRE_WRITE_APPROVAL', true),
      enableDelete: bool('BASEROW_ENABLE_DELETE', false),
      approvalSecret: env.BASEROW_APPROVAL_SECRET?.trim() || undefined,
      timeoutMs: int('BASEROW_TIMEOUT_MS', 15000, 1000, 60000),
      maxRetries: int('BASEROW_MAX_RETRIES', 2, 0, 5)
    };
  } finally {
    process.env = oldEnv;
  }
}

export function assertTableAllowed(config: Config, tableId: number): void {
  if (config.allowedTableIds.size > 0 && !config.allowedTableIds.has(tableId)) {
    throw new Error(`Table ${tableId} is not allowed by connector policy`);
  }
}
