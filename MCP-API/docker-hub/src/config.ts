import crypto from 'node:crypto';

export interface DockerHubConfig {
  username?: string;
  pat?: string;
  allowedNamespaces: Set<string>;
  allowedRepositories: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  mcpEnabled: boolean;
  mcpCommand: string;
  mcpArgs: string[];
  apiBaseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): DockerHubConfig {
  const timeoutMs = Number(env.DOCKER_HUB_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.DOCKER_HUB_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('DOCKER_HUB_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('DOCKER_HUB_MAX_RETRIES must be 0..5');
  let mcpArgs: string[] = [];
  try {
    const parsed = JSON.parse(env.DOCKER_HUB_MCP_ARGS_JSON ?? '[]');
    if (!Array.isArray(parsed) || !parsed.every(v => typeof v === 'string')) throw new Error();
    mcpArgs = parsed;
  } catch {
    throw new Error('DOCKER_HUB_MCP_ARGS_JSON must be a JSON string array');
  }
  return {
    username: env.DOCKER_HUB_USERNAME,
    pat: env.DOCKER_HUB_PAT,
    allowedNamespaces: csvSet(env.DOCKER_HUB_ALLOWED_NAMESPACES),
    allowedRepositories: csvSet(env.DOCKER_HUB_ALLOWED_REPOSITORIES),
    approvalSecret: env.DOCKER_HUB_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    mcpEnabled: (env.DOCKER_HUB_MCP_ENABLED ?? 'true').toLowerCase() !== 'false',
    mcpCommand: env.DOCKER_HUB_MCP_COMMAND ?? 'node',
    mcpArgs,
    apiBaseUrl: 'https://hub.docker.com/v2'
  };
}

export function assertTargetAllowed(config: DockerHubConfig, namespace: string, repository?: string) {
  const ns = namespace.toLowerCase();
  if (config.allowedNamespaces.size && !config.allowedNamespaces.has(ns)) throw new Error(`Namespace not allowed: ${namespace}`);
  if (repository && config.allowedRepositories.size) {
    const repo = repository.toLowerCase();
    if (!config.allowedRepositories.has(repo) && !config.allowedRepositories.has(`${ns}/${repo}`)) {
      throw new Error(`Repository not allowed: ${namespace}/${repository}`);
    }
  }
}

export function requireCredentials(config: DockerHubConfig) {
  if (!config.username || !config.pat) throw new Error('DOCKER_HUB_USERNAME and DOCKER_HUB_PAT are required for authenticated operations');
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
