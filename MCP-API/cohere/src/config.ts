export interface CohereConfig {
  apiKey: string;
  baseUrl: string;
  clientName: string;
  allowedModels: Set<string>;
  approvalSecret?: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

function parseBool(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean environment variables must be true or false');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CohereConfig {
  if (!env.COHERE_API_KEY) throw new Error('COHERE_API_KEY is required');
  const baseUrl = env.COHERE_BASE_URL ?? 'https://api.cohere.com';
  const url = new URL(baseUrl);
  if (url.protocol !== 'https:') throw new Error('COHERE_BASE_URL must use https');
  const timeoutMs = Number(env.COHERE_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.COHERE_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('COHERE_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('COHERE_MAX_RETRIES must be 0..5');
  return {
    apiKey: env.COHERE_API_KEY,
    baseUrl: baseUrl.replace(/\/$/, ''),
    clientName: env.COHERE_CLIENT_NAME ?? 'ai-engineering-mcp',
    allowedModels: csvSet(env.COHERE_ALLOWED_MODELS),
    approvalSecret: env.COHERE_APPROVAL_SECRET,
    requireWriteApproval: parseBool(env.COHERE_REQUIRE_WRITE_APPROVAL, true),
    timeoutMs,
    maxRetries
  };
}

export function assertModelAllowed(config: CohereConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) {
    throw new Error(`Model not allowed: ${model}`);
  }
}
