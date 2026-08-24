export interface ArgoCdConfig {
  serverUrl: string;
  token: string;
  allowedProjects: Set<string>;
  allowedApplications: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  allowInsecureTls: boolean;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ArgoCdConfig {
  const serverUrl = (env.ARGOCD_SERVER_URL ?? '').replace(/\/$/, '');
  const token = env.ARGOCD_TOKEN ?? '';
  if (!serverUrl) throw new Error('ARGOCD_SERVER_URL is required');
  if (!/^https:\/\//i.test(serverUrl) && env.ARGOCD_ALLOW_INSECURE_TLS !== 'true') {
    throw new Error('ARGOCD_SERVER_URL must use https unless ARGOCD_ALLOW_INSECURE_TLS=true');
  }
  if (!token) throw new Error('ARGOCD_TOKEN is required');
  const timeoutMs = Number(env.ARGOCD_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.ARGOCD_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('ARGOCD_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('ARGOCD_MAX_RETRIES must be 0..5');
  return {
    serverUrl,
    token,
    allowedProjects: csvSet(env.ARGOCD_ALLOWED_PROJECTS),
    allowedApplications: csvSet(env.ARGOCD_ALLOWED_APPLICATIONS),
    approvalSecret: env.ARGOCD_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    allowInsecureTls: env.ARGOCD_ALLOW_INSECURE_TLS === 'true'
  };
}

export function assertAllowed(config: ArgoCdConfig, app?: string, project?: string) {
  if (project && config.allowedProjects.size && !config.allowedProjects.has(project)) throw new Error(`Project not allowed: ${project}`);
  if (app && config.allowedApplications.size && !config.allowedApplications.has(app)) throw new Error(`Application not allowed: ${app}`);
}
