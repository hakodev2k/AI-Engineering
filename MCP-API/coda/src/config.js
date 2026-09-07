const EXACT_API = 'https://coda.io/apis/v1';
const EXACT_MCP = 'https://coda.io/apis/mcp';

function boundedInt(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function exactUrl(env, name, fallback, expected) {
  const raw = (env[name] || fallback).trim();
  let url;
  try { url = new URL(raw); } catch { throw new Error(`${name} must be a valid URL.`); }
  const normalized = url.toString().replace(/\/$/, '');
  if (normalized !== expected) throw new Error(`${name} must be exactly ${expected}.`);
  return normalized;
}

export function loadConfig(env = process.env) {
  const apiToken = env.CODA_API_TOKEN?.trim();
  if (!apiToken) throw new Error('CODA_API_TOKEN is required.');
  const approvalToken = env.CODA_APPROVAL_TOKEN?.trim() || undefined;
  if (approvalToken && approvalToken.length < 16) {
    throw new Error('CODA_APPROVAL_TOKEN must be at least 16 characters when configured.');
  }
  return {
    apiToken,
    apiBaseUrl: exactUrl(env, 'CODA_API_BASE_URL', EXACT_API, EXACT_API),
    mcpUrl: exactUrl(env, 'CODA_MCP_URL', EXACT_MCP, EXACT_MCP),
    timeoutMs: boundedInt(env, 'CODA_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: boundedInt(env, 'CODA_MAX_RETRIES', 3, 0, 5),
    allowWrites: env.CODA_ALLOW_WRITES === 'true',
    allowHighRisk: env.CODA_ALLOW_HIGH_RISK === 'true',
    approvalToken
  };
}
