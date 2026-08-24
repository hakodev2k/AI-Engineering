export interface TogetherConfig {
  apiKey: string;
  approvalSecret?: string;
  allowedModels: Set<string>;
  timeoutMs: number;
  maxRetries: number;
  enableCostingWrites: boolean;
  enableFineTuning: boolean;
  baseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

function bool(value: string | undefined, fallback = false) {
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Expected boolean true/false, got ${value}`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): TogetherConfig {
  if (!env.TOGETHER_API_KEY) throw new Error('TOGETHER_API_KEY is required');
  const timeoutMs = Number(env.TOGETHER_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.TOGETHER_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('TOGETHER_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('TOGETHER_MAX_RETRIES must be 0..5');
  return {
    apiKey: env.TOGETHER_API_KEY,
    approvalSecret: env.TOGETHER_APPROVAL_SECRET,
    allowedModels: csvSet(env.TOGETHER_ALLOWED_MODELS),
    timeoutMs,
    maxRetries,
    enableCostingWrites: bool(env.TOGETHER_ENABLE_COSTING_WRITES, false),
    enableFineTuning: bool(env.TOGETHER_ENABLE_FINE_TUNING, false),
    baseUrl: 'https://api.together.ai/v1'
  };
}

export function assertModelAllowed(config: TogetherConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed: ${model}`);
}
