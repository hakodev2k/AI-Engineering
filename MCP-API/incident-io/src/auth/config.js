import crypto from 'node:crypto';

const int = (value, fallback, min, max) => {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`Integer value must be between ${min} and ${max}`);
  return parsed;
};
const bool = (value, fallback = false) => {
  if (value == null || value === '') return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean value must be true or false');
};

export function loadConfig(env = process.env) {
  if (!env.INCIDENT_IO_API_KEY) throw new Error('INCIDENT_IO_API_KEY is required');
  const url = new URL(env.INCIDENT_IO_MCP_URL || 'https://mcp.incident.io/mcp');
  if (url.protocol !== 'https:') throw new Error('INCIDENT_IO_MCP_URL must use HTTPS');
  if (url.username || url.password || url.hash || url.search) throw new Error('INCIDENT_IO_MCP_URL must not contain credentials, query, or fragment');
  return Object.freeze({
    mcpUrl: url.toString(),
    apiKey: env.INCIDENT_IO_API_KEY,
    timeoutMs: int(env.INCIDENT_IO_TIMEOUT_MS, 20000, 1000, 120000),
    approvalSecret: env.INCIDENT_IO_APPROVAL_SECRET || '',
    highRiskEnabled: bool(env.INCIDENT_IO_ENABLE_HIGH_RISK, false)
  });
}

function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}
