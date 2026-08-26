import crypto from 'node:crypto';

export type DopplerConfig = {
  token: string;
  apiBase: string;
  project?: string;
  config?: string;
  readOnly: boolean;
  useUpstreamMcp: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

const bool = (v: string | undefined, d: boolean) => v === undefined ? d : ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
const int = (v: string | undefined, d: number, min: number, max: number) => {
  const n = Number(v ?? d);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid integer configuration: ${v}`);
  return n;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): DopplerConfig {
  const token = env.DOPPLER_TOKEN?.trim();
  if (!token) throw new Error('DOPPLER_TOKEN is required');
  if (!/^dp\.(ct|pt|st|sa|said|audit|scim)\./.test(token)) throw new Error('DOPPLER_TOKEN does not match a recognized Doppler token prefix');
  return {
    token,
    apiBase: 'https://api.doppler.com/v3',
    project: env.DOPPLER_PROJECT?.trim() || undefined,
    config: env.DOPPLER_CONFIG?.trim() || undefined,
    readOnly: bool(env.DOPPLER_READ_ONLY, true),
    useUpstreamMcp: bool(env.DOPPLER_USE_UPSTREAM_MCP, true),
    approvalSecret: env.DOPPLER_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs: int(env.DOPPLER_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: int(env.DOPPLER_MAX_RETRIES, 3, 0, 5)
  };
}

export function approvalDigest(secret: string, tool: string, purpose = 'execute'): string {
  return crypto.createHmac('sha256', secret).update(`${tool}:${purpose}`).digest('hex');
}

export function resolveScope(cfg: DopplerConfig, project?: string, config?: string) {
  const p = project ?? cfg.project;
  const c = config ?? cfg.config;
  if (cfg.project && project && project !== cfg.project) throw new Error('Project is outside configured connector scope');
  if (cfg.config && config && config !== cfg.config) throw new Error('Config is outside configured connector scope');
  return { project: p, config: c };
}
