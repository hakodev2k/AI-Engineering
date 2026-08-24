export interface GroqConfig {
  apiKey: string;
  allowedModels: Set<string>;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

function parseBool(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) return defaultValue;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function parseCsv(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GroqConfig {
  const apiKey = env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error('GROQ_API_KEY is required');
  const timeoutMs = Number(env.GROQ_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.GROQ_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('GROQ_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('GROQ_MAX_RETRIES must be 0..5');
  return {
    apiKey,
    allowedModels: parseCsv(env.GROQ_ALLOWED_MODELS),
    requireWriteApproval: parseBool(env.GROQ_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: parseBool(env.GROQ_ENABLE_DESTRUCTIVE, false),
    approvalSecret: env.GROQ_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    baseUrl: 'https://api.groq.com/openai/v1'
  };
}

export function assertModelAllowed(config: GroqConfig, model: string) {
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model is not allow-listed: ${model}`);
}
