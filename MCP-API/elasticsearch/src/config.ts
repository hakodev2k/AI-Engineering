import crypto from 'node:crypto';

export type AuthMode = 'api-key' | 'bearer' | 'basic';

export interface ElasticConfig {
  baseUrl: string;
  authMode: AuthMode;
  apiKey?: string;
  bearerToken?: string;
  username?: string;
  password?: string;
  allowedIndices: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  preferMcp: boolean;
  kibanaUrl?: string;
  kibanaApiKey?: string;
  mcpSpace?: string;
}

function bool(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
function csv(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ElasticConfig {
  const baseUrl = (env.ELASTICSEARCH_URL ?? '').replace(/\/$/, '');
  if (!/^https?:\/\//.test(baseUrl)) throw new Error('ELASTICSEARCH_URL must be an http(s) URL');
  let authMode: AuthMode;
  if (env.ELASTICSEARCH_API_KEY) authMode = 'api-key';
  else if (env.ELASTICSEARCH_BEARER_TOKEN) authMode = 'bearer';
  else if (env.ELASTICSEARCH_USERNAME && env.ELASTICSEARCH_PASSWORD) authMode = 'basic';
  else throw new Error('Configure ELASTICSEARCH_API_KEY, ELASTICSEARCH_BEARER_TOKEN, or username/password');
  const timeoutMs = Number(env.ELASTIC_TIMEOUT_MS ?? 30000);
  const maxRetries = Number(env.ELASTIC_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 300000) throw new Error('ELASTIC_TIMEOUT_MS must be 1000..300000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('ELASTIC_MAX_RETRIES must be 0..5');
  const kibanaUrl = env.ELASTIC_KIBANA_URL?.replace(/\/$/, '');
  if (kibanaUrl && !/^https?:\/\//.test(kibanaUrl)) throw new Error('ELASTIC_KIBANA_URL must be an http(s) URL');
  return {
    baseUrl,
    authMode,
    apiKey: env.ELASTICSEARCH_API_KEY,
    bearerToken: env.ELASTICSEARCH_BEARER_TOKEN,
    username: env.ELASTICSEARCH_USERNAME,
    password: env.ELASTICSEARCH_PASSWORD,
    allowedIndices: csv(env.ELASTIC_ALLOWED_INDICES),
    approvalSecret: env.ELASTIC_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    preferMcp: bool(env.ELASTIC_PREFER_MCP, true),
    kibanaUrl,
    kibanaApiKey: env.ELASTIC_KIBANA_API_KEY,
    mcpSpace: env.ELASTIC_MCP_SPACE
  };
}

export function assertIndexAllowed(config: ElasticConfig, index: string) {
  if (index.includes('..') || index.startsWith('_')) throw new Error(`Unsafe index target: ${index}`);
  if (!config.allowedIndices.size) return;
  const matches = [...config.allowedIndices].some(pattern => {
    if (pattern === '*') return true;
    if (!pattern.includes('*')) return pattern === index;
    const re = new RegExp('^' + pattern.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return re.test(index);
  });
  if (!matches) throw new Error(`Index not allowed: ${index}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
