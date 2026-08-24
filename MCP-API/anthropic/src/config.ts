import crypto from 'node:crypto';

export interface AnthropicConfig {
  apiKey: string;
  version: string;
  baseUrl: string;
  allowedModels: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  maxOutputTokens: number;
  maxBatchRequests: number;
}

const csvSet = (value?: string) => new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AnthropicConfig {
  if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is required');
  const timeoutMs = Number(env.ANTHROPIC_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.ANTHROPIC_MAX_RETRIES ?? 3);
  const maxOutputTokens = Number(env.ANTHROPIC_MAX_OUTPUT_TOKENS ?? 8192);
  const maxBatchRequests = Number(env.ANTHROPIC_MAX_BATCH_REQUESTS ?? 1000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('ANTHROPIC_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('ANTHROPIC_MAX_RETRIES must be 0..5');
  if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 65536) throw new Error('ANTHROPIC_MAX_OUTPUT_TOKENS must be 1..65536');
  if (!Number.isInteger(maxBatchRequests) || maxBatchRequests < 1 || maxBatchRequests > 10000) throw new Error('ANTHROPIC_MAX_BATCH_REQUESTS must be 1..10000');
  const baseUrl = env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com';
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('ANTHROPIC_BASE_URL must be an HTTPS URL without embedded credentials');
  return {
    apiKey: env.ANTHROPIC_API_KEY,
    version: env.ANTHROPIC_VERSION ?? '2023-06-01',
    baseUrl: parsed.origin,
    allowedModels: csvSet(env.ANTHROPIC_ALLOWED_MODELS),
    approvalSecret: env.ANTHROPIC_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    maxOutputTokens,
    maxBatchRequests
  };
}

export function assertModelAllowed(config: AnthropicConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed: ${model}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
