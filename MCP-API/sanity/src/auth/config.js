import crypto from 'node:crypto';

function boolValue(env, name, fallback) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}
function intValue(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}
export function loadConfig(env = process.env) {
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_DATASET || 'production';
  const token = env.SANITY_API_TOKEN;
  if (!projectId || !/^[a-z0-9-]+$/i.test(projectId)) throw new Error('SANITY_PROJECT_ID is required and invalid');
  if (!/^[a-z0-9_-]+$/i.test(dataset)) throw new Error('SANITY_DATASET is invalid');
  if (!token) throw new Error('SANITY_API_TOKEN is required');
  const mcpUrl = new URL(env.SANITY_MCP_URL || 'https://mcp.sanity.io');
  if (mcpUrl.protocol !== 'https:') throw new Error('SANITY_MCP_URL must use HTTPS');
  if (mcpUrl.username || mcpUrl.password || mcpUrl.search || mcpUrl.hash) throw new Error('SANITY_MCP_URL must not contain credentials, query, or fragment');
  const apiVersion = env.SANITY_API_VERSION || '2026-07-28';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) throw new Error('SANITY_API_VERSION must be YYYY-MM-DD');
  return Object.freeze({ projectId, dataset, token, apiVersion, mcpUrl: mcpUrl.toString(), mcpEnabled: boolValue(env,'SANITY_MCP_ENABLED',true), timeoutMs: intValue(env,'SANITY_TIMEOUT_MS',15000,1000,120000), maxReadRetries: intValue(env,'SANITY_MAX_READ_RETRIES',3,0,5), approvalSecret: env.SANITY_APPROVAL_SECRET || '', destructiveEnabled: boolValue(env,'SANITY_ENABLE_DESTRUCTIVE',false) });
}
function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
}
export function approvalDigest(secret, tool, payload) { return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex'); }
