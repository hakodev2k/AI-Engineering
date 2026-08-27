import crypto from 'node:crypto';

export type ConnectorConfig = {
  token: string;
  org: string;
  url?: string;
  projectKey?: string;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const token = env.SONARQUBE_TOKEN?.trim();
  const org = env.SONARQUBE_ORG?.trim();
  if (!token) throw new Error('SONARQUBE_TOKEN is required');
  if (!org) throw new Error('SONARQUBE_ORG is required for SonarQube Cloud');
  const timeoutMs = Number(env.SONARQUBE_TIMEOUT_MS ?? '30000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('SONARQUBE_TIMEOUT_MS must be an integer between 1000 and 120000');
  }
  return {
    token,
    org,
    url: env.SONARQUBE_URL?.trim() || undefined,
    projectKey: env.SONARQUBE_PROJECT_KEY?.trim() || undefined,
    approvalSecret: env.SONARQUBE_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs
  };
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .filter(([k]) => k !== 'approvalToken')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, stable(v)]));
  }
  return value;
}

export function approvalDigest(secret: string, tool: string, args: Record<string, unknown>): string {
  const payload = `${tool}:${JSON.stringify(stable(args))}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function assertApproval(secret: string | undefined, tool: string, args: Record<string, unknown>): void {
  const supplied = typeof args.approvalToken === 'string' ? args.approvalToken : undefined;
  if (!secret) throw new Error(`${tool} requires SONARQUBE_APPROVAL_SECRET`);
  if (!supplied) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool, args);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval for ${tool}`);
  }
}
