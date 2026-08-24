import crypto from 'node:crypto';

export interface OpenRouterConfig {
  apiKey?: string;
  managementKey?: string;
  approvalSecret?: string;
  allowedModels: Set<string>;
  appTitle?: string;
  httpReferer?: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OpenRouterConfig {
  const timeoutMs = Number(env.OPENROUTER_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.OPENROUTER_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('OPENROUTER_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('OPENROUTER_MAX_RETRIES must be 0..5');
  return {
    apiKey: env.OPENROUTER_API_KEY,
    managementKey: env.OPENROUTER_MANAGEMENT_KEY,
    approvalSecret: env.OPENROUTER_APPROVAL_SECRET,
    allowedModels: csvSet(env.OPENROUTER_ALLOWED_MODELS),
    appTitle: env.OPENROUTER_APP_TITLE,
    httpReferer: env.OPENROUTER_HTTP_REFERER,
    timeoutMs,
    maxRetries,
    baseUrl: 'https://openrouter.ai/api/v1'
  };
}

export function requireApiKey(config: OpenRouterConfig) {
  if (!config.apiKey) throw new Error('OPENROUTER_API_KEY is required for this tool');
  return config.apiKey;
}

export function requireManagementKey(config: OpenRouterConfig) {
  if (!config.managementKey) throw new Error('OPENROUTER_MANAGEMENT_KEY is required for this tool');
  return config.managementKey;
}

export function assertModelAllowed(config: OpenRouterConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed: ${model}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
