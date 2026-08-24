import crypto from 'node:crypto';

export interface Config {
  url: string;
  apiKey: string;
  mcpEnabled: boolean;
  allowedCollections: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const url = env.WEAVIATE_URL?.replace(/\/$/, '');
  if (!url) throw new Error('WEAVIATE_URL is required');
  if (!/^https?:\/\//.test(url)) throw new Error('WEAVIATE_URL must be http(s)');
  const apiKey = env.WEAVIATE_API_KEY ?? '';
  const timeoutMs = Number(env.WEAVIATE_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.WEAVIATE_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('WEAVIATE_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('WEAVIATE_MAX_RETRIES must be 0..5');
  return {
    url,
    apiKey,
    mcpEnabled: (env.WEAVIATE_MCP_ENABLED ?? 'true').toLowerCase() === 'true',
    allowedCollections: new Set((env.WEAVIATE_ALLOWED_COLLECTIONS ?? '').split(',').map(v => v.trim()).filter(Boolean)),
    approvalSecret: env.WEAVIATE_APPROVAL_SECRET,
    timeoutMs,
    maxRetries
  };
}

export function assertCollectionAllowed(config: Config, collection: string) {
  if (config.allowedCollections.size && !config.allowedCollections.has(collection)) throw new Error(`Collection not allowed: ${collection}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
