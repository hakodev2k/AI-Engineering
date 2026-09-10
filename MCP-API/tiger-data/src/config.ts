import crypto from 'node:crypto';

export type ConnectorConfig = {
  cliPath: string;
  publicKey?: string;
  secretKey?: string;
  serviceId?: string;
  allowWrite: boolean;
  allowHighRisk: boolean;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

const asBool = (v: string | undefined, d: boolean) => v == null ? d : v.toLowerCase() === 'true';
const boundedInt = (v: string | undefined, d: number, min: number, max: number) => {
  if (v == null || v === '') return d;
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid integer value ${v}; expected ${min}-${max}`);
  return n;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const allowWrite = asBool(env.TIGER_CONNECTOR_ALLOW_WRITE, false);
  const allowHighRisk = asBool(env.TIGER_CONNECTOR_ALLOW_HIGH_RISK, false);
  const requireWriteApproval = asBool(env.TIGER_CONNECTOR_REQUIRE_WRITE_APPROVAL, true);
  const approvalSecret = env.TIGER_CONNECTOR_APPROVAL_SECRET;
  if ((allowHighRisk || (allowWrite && requireWriteApproval)) && (!approvalSecret || approvalSecret.length < 16)) {
    throw new Error('TIGER_CONNECTOR_APPROVAL_SECRET must be at least 16 characters when approval-gated tools are enabled');
  }
  if ((env.TIGER_PUBLIC_KEY && !env.TIGER_SECRET_KEY) || (!env.TIGER_PUBLIC_KEY && env.TIGER_SECRET_KEY)) {
    throw new Error('TIGER_PUBLIC_KEY and TIGER_SECRET_KEY must be supplied together');
  }
  return {
    cliPath: env.TIGER_CLI_PATH || 'tiger',
    publicKey: env.TIGER_PUBLIC_KEY,
    secretKey: env.TIGER_SECRET_KEY,
    serviceId: env.TIGER_SERVICE_ID,
    allowWrite,
    allowHighRisk,
    requireWriteApproval,
    approvalSecret,
    timeoutMs: boundedInt(env.TIGER_CONNECTOR_TIMEOUT_MS, 30000, 1000, 120000),
    maxRetries: boundedInt(env.TIGER_CONNECTOR_MAX_RETRIES, 2, 0, 5)
  };
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function expectedApproval(secret: string, toolName: string, args: Record<string, unknown>): string {
  const clean = { ...args };
  delete clean.approvalToken;
  return crypto.createHmac('sha256', secret).update(`${toolName}\n${canonicalJson(clean)}`).digest('hex');
}

export function verifyApproval(secret: string, toolName: string, args: Record<string, unknown>, supplied: unknown): boolean {
  if (typeof supplied !== 'string' || !/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const expected = expectedApproval(secret, toolName, args);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(supplied, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
