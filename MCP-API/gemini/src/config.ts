import path from 'node:path';

export interface GeminiConfig {
  apiKey: string;
  approvalSecret?: string;
  requireApprovalForBillable: boolean;
  allowedModels: Set<string>;
  allowedUploadRoots: string[];
  timeoutMs: number;
  maxRetries: number;
  maxResponseBytes: number;
  baseUrl: string;
  uploadBaseUrl: string;
}

function csv(value?: string): string[] {
  return (value ?? '').split(',').map(v => v.trim()).filter(Boolean);
}

function asBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean environment variables must be true or false');
}

function intInRange(name: string, value: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(value ?? fallback);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GeminiConfig {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('GEMINI_API_KEY is required');
  return {
    apiKey,
    approvalSecret: env.GEMINI_APPROVAL_SECRET?.trim() || undefined,
    requireApprovalForBillable: asBool(env.GEMINI_REQUIRE_APPROVAL_FOR_BILLABLE, true),
    allowedModels: new Set(csv(env.GEMINI_ALLOWED_MODELS)),
    allowedUploadRoots: csv(env.GEMINI_ALLOWED_UPLOAD_ROOTS).map(v => path.resolve(v)),
    timeoutMs: intInRange('GEMINI_TIMEOUT_MS', env.GEMINI_TIMEOUT_MS, 30000, 1000, 120000),
    maxRetries: intInRange('GEMINI_MAX_RETRIES', env.GEMINI_MAX_RETRIES, 3, 0, 5),
    maxResponseBytes: intInRange('GEMINI_MAX_RESPONSE_BYTES', env.GEMINI_MAX_RESPONSE_BYTES, 1048576, 1024, 10485760),
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    uploadBaseUrl: 'https://generativelanguage.googleapis.com/upload/v1beta'
  };
}

export function assertModelAllowed(config: GeminiConfig, model: string): void {
  if (!/^[A-Za-z0-9._-]+$/.test(model)) throw new Error('Invalid model identifier');
  if (config.allowedModels.size && !config.allowedModels.has(model)) throw new Error(`Model not allowed: ${model}`);
}

export function assertUploadPathAllowed(config: GeminiConfig, filePath: string): string {
  const resolved = path.resolve(filePath);
  if (!config.allowedUploadRoots.length) throw new Error('File upload is disabled until GEMINI_ALLOWED_UPLOAD_ROOTS is configured');
  const allowed = config.allowedUploadRoots.some(root => resolved === root || resolved.startsWith(`${root}${path.sep}`));
  if (!allowed) throw new Error('Upload path is outside configured roots');
  return resolved;
}
