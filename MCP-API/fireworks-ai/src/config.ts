import crypto from 'node:crypto';

export interface FireworksConfig {
  apiKey: string;
  accountId?: string;
  allowedModels: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  maxInputChars: number;
  maxDocuments: number;
  inferenceBaseUrl: string;
  platformBaseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

function intEnv(env: NodeJS.ProcessEnv, key: string, fallback: number, min: number, max: number) {
  const value = Number(env[key] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${key} must be an integer in ${min}..${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): FireworksConfig {
  const apiKey = env.FIREWORKS_API_KEY?.trim();
  if (!apiKey) throw new Error('FIREWORKS_API_KEY is required');
  return {
    apiKey,
    accountId: env.FIREWORKS_ACCOUNT_ID?.trim() || undefined,
    allowedModels: csvSet(env.FIREWORKS_ALLOWED_MODELS),
    approvalSecret: env.FIREWORKS_APPROVAL_SECRET,
    timeoutMs: intEnv(env, 'FIREWORKS_TIMEOUT_MS', 30000, 1000, 120000),
    maxRetries: intEnv(env, 'FIREWORKS_MAX_RETRIES', 3, 0, 5),
    maxInputChars: intEnv(env, 'FIREWORKS_MAX_INPUT_CHARS', 200000, 1000, 1000000),
    maxDocuments: intEnv(env, 'FIREWORKS_MAX_DOCUMENTS', 100, 1, 1000),
    inferenceBaseUrl: 'https://api.fireworks.ai/inference/v1',
    platformBaseUrl: 'https://api.fireworks.ai/v1'
  };
}

export function assertModelAllowed(config: FireworksConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed by FIREWORKS_ALLOWED_MODELS: ${model}`);
}

export function requireAccountId(config: FireworksConfig) {
  if (!config.accountId) throw new Error('FIREWORKS_ACCOUNT_ID is required for account-scoped model/deployment tools');
  return config.accountId;
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
