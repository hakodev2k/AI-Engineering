import crypto from 'node:crypto';

function parseIntBounded(raw, fallback, min, max, name) {
  if (raw == null || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}
function parseBool(raw, fallback, name) {
  if (raw == null || raw === '') return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}
export function loadConfig(env = process.env) {
  if (!env.INNGEST_API_KEY) throw new Error('INNGEST_API_KEY is required');
  if (!/^sk-inn-api-/.test(env.INNGEST_API_KEY)) throw new Error('INNGEST_API_KEY must be an Inngest API key (sk-inn-api-...)');
  const url = new URL(env.INNGEST_MCP_URL || 'https://api.inngest.com/mcp');
  if (url.protocol !== 'https:' || url.hostname !== 'api.inngest.com' || url.pathname !== '/mcp' || url.username || url.password || url.search || url.hash) {
    throw new Error('INNGEST_MCP_URL must be exactly the official HTTPS Inngest Cloud MCP endpoint');
  }
  return Object.freeze({
    apiKey: env.INNGEST_API_KEY,
    mcpUrl: url.toString(),
    timeoutMs: parseIntBounded(env.INNGEST_TIMEOUT_MS, 20000, 1000, 120000, 'INNGEST_TIMEOUT_MS'),
    approvalSecret: env.INNGEST_APPROVAL_SECRET || '',
    requireWriteApproval: parseBool(env.INNGEST_REQUIRE_WRITE_APPROVAL, true, 'INNGEST_REQUIRE_WRITE_APPROVAL')
  });
}
function canonical(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
}
export function approvalDigest(secret, toolName, payload) {
  return crypto.createHmac('sha256', secret).update(`${toolName}\n${canonical(payload)}`).digest('hex');
}
