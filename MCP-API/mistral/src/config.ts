import crypto from 'node:crypto';

export interface MistralConfig {
  apiKey: string;
  baseUrl: string;
  allowedModels: Set<string>;
  requireApprovalForWrite: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  maxOutputTokens: number;
  maxInputChars: number;
}

const csvSet = (value?: string) => new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): MistralConfig {
  if (!env.MISTRAL_API_KEY) throw new Error('MISTRAL_API_KEY is required');
  const baseUrl = env.MISTRAL_API_BASE_URL ?? 'https://api.mistral.ai';
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('MISTRAL_API_BASE_URL must be a credential-free HTTPS URL');
  const timeoutMs = Number(env.MISTRAL_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.MISTRAL_MAX_RETRIES ?? 3);
  const maxOutputTokens = Number(env.MISTRAL_MAX_OUTPUT_TOKENS ?? 4096);
  const maxInputChars = Number(env.MISTRAL_MAX_INPUT_CHARS ?? 200000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('MISTRAL_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('MISTRAL_MAX_RETRIES must be 0..5');
  if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 32768) throw new Error('MISTRAL_MAX_OUTPUT_TOKENS must be 1..32768');
  if (!Number.isInteger(maxInputChars) || maxInputChars < 1000 || maxInputChars > 2_000_000) throw new Error('MISTRAL_MAX_INPUT_CHARS must be 1000..2000000');
  return {
    apiKey: env.MISTRAL_API_KEY,
    baseUrl: parsed.origin,
    allowedModels: csvSet(env.MISTRAL_ALLOWED_MODELS),
    requireApprovalForWrite: env.MISTRAL_REQUIRE_APPROVAL_FOR_WRITE === 'true',
    approvalSecret: env.MISTRAL_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    maxOutputTokens,
    maxInputChars
  };
}

export function assertModelAllowed(config: MistralConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed: ${model}`);
}

export function assertInputBudget(config: MistralConfig, value: unknown) {
  const chars = typeof value === 'string' ? value.length : JSON.stringify(value).length;
  if (chars > config.maxInputChars) throw new Error(`Input exceeds configured ${config.maxInputChars}-character safety limit`);
}

export function assertSafeRemoteUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS remote URLs are allowed');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '127.0.0.1' || host === '::1' || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error('Private or local network URLs are not allowed');
  return value;
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
