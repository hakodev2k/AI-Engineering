const OFFICIAL_API_BASE = 'https://api.openai.com/v1';

function required(env, name, minLength = 1) {
  const value = env[name]?.trim();
  if (!value || value.length < minLength) throw new Error(`${name} is required`);
  return value;
}

function optional(env, name, maxLength = 256) {
  const value = env[name]?.trim();
  if (!value) return undefined;
  if (value.length > maxLength) throw new Error(`${name} exceeds ${maxLength} characters`);
  return value;
}

function integer(env, name, fallback, min, max) {
  const raw = env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function boolean(env, name, fallback) {
  const raw = env[name]?.trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env = process.env) {
  const apiKey = required(env, 'OPENAI_API_KEY', 20);
  const allowedModels = new Set(
    (env.OPENAI_ALLOWED_MODELS ?? '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
  );

  return Object.freeze({
    apiBase: OFFICIAL_API_BASE,
    apiKey,
    project: optional(env, 'OPENAI_PROJECT'),
    organization: optional(env, 'OPENAI_ORGANIZATION'),
    allowedModels,
    approvalSecret: optional(env, 'OPENAI_APPROVAL_SECRET', 4096),
    requireWriteApproval: boolean(env, 'OPENAI_REQUIRE_WRITE_APPROVAL', true),
    timeoutMs: integer(env, 'OPENAI_TIMEOUT_MS', 30_000, 1_000, 120_000),
    maxReadRetries: integer(env, 'OPENAI_MAX_READ_RETRIES', 2, 0, 3),
    maxRetryDelayMs: integer(env, 'OPENAI_MAX_RETRY_DELAY_MS', 30_000, 100, 30_000)
  });
}

export function assertModelAllowed(config, model) {
  if (config.allowedModels.size > 0 && !config.allowedModels.has(model)) {
    throw new Error(`Model ${model} is not in OPENAI_ALLOWED_MODELS`);
  }
}

export { OFFICIAL_API_BASE };
