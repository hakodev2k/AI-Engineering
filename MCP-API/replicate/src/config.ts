import crypto from 'node:crypto';

export interface ReplicateConfig {
  apiToken: string;
  approvalSecret?: string;
  allowedOwners: Set<string>;
  allowedModels: Set<string>;
  allowedDeployments: Set<string>;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ReplicateConfig {
  const apiToken = env.REPLICATE_API_TOKEN;
  if (!apiToken) throw new Error('REPLICATE_API_TOKEN is required');
  const timeoutMs = Number(env.REPLICATE_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.REPLICATE_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('REPLICATE_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('REPLICATE_MAX_RETRIES must be 0..5');
  return {
    apiToken,
    approvalSecret: env.REPLICATE_APPROVAL_SECRET,
    allowedOwners: csvSet(env.REPLICATE_ALLOWED_OWNERS),
    allowedModels: csvSet(env.REPLICATE_ALLOWED_MODELS),
    allowedDeployments: csvSet(env.REPLICATE_ALLOWED_DEPLOYMENTS),
    timeoutMs,
    maxRetries,
    baseUrl: 'https://api.replicate.com/v1'
  };
}

export function assertModelAllowed(config: ReplicateConfig, owner: string, model: string) {
  const o = owner.toLowerCase();
  const key = `${o}/${model.toLowerCase()}`;
  if (config.allowedOwners.size && !config.allowedOwners.has(o)) throw new Error(`Model owner not allowed: ${owner}`);
  if (config.allowedModels.size && !config.allowedModels.has(key)) throw new Error(`Model not allowed: ${owner}/${model}`);
}

export function assertDeploymentAllowed(config: ReplicateConfig, owner: string, deployment: string) {
  const key = `${owner.toLowerCase()}/${deployment.toLowerCase()}`;
  if (config.allowedDeployments.size && !config.allowedDeployments.has(key)) throw new Error(`Deployment not allowed: ${owner}/${deployment}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
